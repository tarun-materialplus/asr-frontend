import { useEffect } from "react";
import { useUIStore } from "../store/uiStore";
import { getStatus, getLocalJobs } from "../services/asr";

export function useJobsPoller() {
  const setJobs = useUIStore((s) => s.setJobs);
  const jobs = useUIStore((s) => s.jobs);

  // Load jobs from localStorage on mount
  useEffect(() => {
    const localData = getLocalJobs();
    if (localData.length > 0 && jobs.length === 0) {
      setJobs(localData);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Poll active jobs every 5 seconds
  useEffect(() => {
    const interval = setInterval(async () => {
      const currentJobs = useUIStore.getState().jobs;

      // Only poll jobs that are not in a terminal state
      const activeJobs = currentJobs.filter(
        (j) => !["Completed", "Error", "Aborted"].includes(j.status)
      );

      for (const job of activeJobs) {
        try {
          const statusData = await getStatus(job.session_id);
          
          // Update job with latest status from API
          useUIStore.setState((state) => ({
            jobs: state.jobs.map((j) =>
              j.session_id === job.session_id
                ? { 
                    ...j, 
                    // Use API status directly (Running, Completed, etc.)
                    status: statusData.status || j.status,
                    // Update folder_name when available (needed for download)
                    folder_name: statusData.folder_name || j.folder_name,
                    // Update progress if available
                    progress: statusData.progress, 
                    // Update message from API
                    message: statusData.message || j.message
                  }
                : j
            ),
          }));
          
          // Persist to localStorage
          localStorage.setItem("my_asr_jobs", JSON.stringify(useUIStore.getState().jobs));
          
        } catch (e) {
          console.warn(`Failed to poll job ${job.session_id}:`, e);
        }
      }
    }, 5000); // Poll every 5 seconds

    return () => clearInterval(interval);
  }, []);
}