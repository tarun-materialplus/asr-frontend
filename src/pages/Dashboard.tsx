import DragDropUpload from "../components/upload/DragDropUpload";
import StagedFilesList from "../components/upload/StagedFilesList";
import ProcessingJobs from "../components/jobs/ProcessingJobs";
import JobDetails from "../components/details/JobDetails";
import { useJobsPoller } from "../hooks/useJobs";

export default function Dashboard() {
  useJobsPoller();

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-1">
        <h2 className="text-2xl font-semibold tracking-tight text-[var(--text-main)]">ASR Processing</h2>
        <p className="text-sm text-[var(--text-muted)]">Manage your transcription pipeline and view results.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 h-[calc(100vh-140px)] min-h-[600px]">
        <div className="lg:col-span-4 flex flex-col gap-6 overflow-y-auto pr-1">
          <DragDropUpload />
          <StagedFilesList />
        </div>

        <div className="lg:col-span-5 flex flex-col overflow-hidden glass-panel rounded-xl">
           <ProcessingJobs />
        </div>

        <div className="lg:col-span-3 flex flex-col gap-6 overflow-y-auto">
          <JobDetails />
        </div>
      </div>
    </div>
  );
}