import JobRow from "./JobRow";
import { useUIStore } from "../../store/uiStore";

export default function ProcessingJobs() {
  const jobs = useUIStore((s) => s.jobs);
  const setSelected = useUIStore((s) => s.setSelectedJobId);

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b border-[var(--border)] bg-[var(--bg-card)] flex justify-between items-center sticky top-0 z-10">
        <h3 className="font-semibold text-[var(--text-main)]">Processing Queue</h3>
        <span className="px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-xs font-medium text-[var(--text-muted)]">
          {jobs.length} Tasks
        </span>
      </div>

      <div className="flex-1 overflow-y-auto p-2 space-y-1 bg-[var(--bg-app)]/50 dark:bg-slate-950/50">
        {jobs.length === 0 && (
          <div className="h-40 flex flex-col items-center justify-center text-[var(--text-muted)]">
            <p className="text-sm">Queue is empty</p>
          </div>
        )}
        {jobs.map((j) => (
          <JobRow key={j.session_id} job={j} onSelect={(id) => setSelected(id)} />
        ))}
      </div>
    </div>
  );
}