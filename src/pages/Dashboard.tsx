import DragDropUpload from "../components/upload/DragDropUpload";
import StagedFilesList from "../components/upload/StagedFilesList";
import ProcessingJobs from "../components/jobs/ProcessingJobs";
import JobDetails from "../components/details/JobDetails";
import { useJobsPoller } from "../hooks/useJobs";

export default function Dashboard() {
  useJobsPoller();

  return (
    <div className="space-y-6 pb-20">
      <div className="flex flex-col gap-1">
        <h2 className="text-2xl font-semibold tracking-tight text-slate-900 dark:text-white">ASR Processing</h2>
        <p className="text-sm text-slate-500">Manage your transcription pipeline and view results.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

        <div className="lg:col-span-4 flex flex-col gap-6">
          <DragDropUpload />
          <StagedFilesList />
        </div>

        <div className="lg:col-span-5 flex flex-col h-[calc(100vh-120px)] min-h-[500px] sticky top-6">
          <ProcessingJobs />
        </div>

        <div className="lg:col-span-3 flex flex-col gap-6 sticky top-6">
          <JobDetails />
        </div>
      </div>
    </div>
  );
}