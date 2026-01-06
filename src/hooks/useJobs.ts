import { useEffect } from "react";
import { useUIStore } from "../store/uiStore";
import { getStatus, getLocalJobs } from "../services/asr";

export function useJobsPoller() {
  const setJobs = useUIStore((s) => s.setJobs);
  const jobs = useUIStore((s) => s.jobs);

  useEffect(() => {
    const localData = getLocalJobs();
    if (localData.length > 0 && jobs.length === 0) {
      setJobs(localData);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const interval = setInterval(async () => {
      const currentJobs = useUIStore.getState().jobs;

      const activeJobs = currentJobs.filter(
        (j) => !["Completed", "Error", "Aborted"].includes(j.status)
      );

      for (const job of activeJobs) {
        try {
          const statusData = await getStatus(job.session_id);

          useUIStore.setState((state) => ({
            jobs: state.jobs.map((j) =>
              j.session_id === job.session_id
                ? {
                  ...j,
                  status: statusData.status || j.status,
                  folder_name: statusData.folder_name || j.folder_name,
                  progress: statusData.progress,
                  message: statusData.message || j.message
                }
                : j
            ),
          }));

          localStorage.setItem("my_asr_jobs", JSON.stringify(useUIStore.getState().jobs));

        } catch (e) {
          console.warn(`Failed to poll job ${job.session_id}:`, e);
        }
      }
    }, 5000);

    return () => clearInterval(interval);
  }, []);
}