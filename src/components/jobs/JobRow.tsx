import type { Job } from "../../types/asr";
import StatusBadge from "./StatusBadge";
import { FileAudio, ChevronRight } from "lucide-react";
import { useUIStore } from "../../store/uiStore";
import clsx from "clsx";

export default function JobRow({ job, onSelect }: { job: Job; onSelect: (id: string) => void }) {
  const selectedId = useUIStore((s) => s.selectedJobId);
  const isSelected = selectedId === job.session_id;

  const dateStr = new Date(job.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  const sizeStr = job.filename ? `${((job.filename.length) * 0.5).toFixed(1)}MB` : "N/A";

  return (
    <div
      onClick={() => onSelect(job.session_id)}
      className={clsx(
        "group flex items-start justify-between p-3 rounded-lg border cursor-pointer transition-all duration-200",
        isSelected
          ? "bg-white dark:bg-slate-800 border-blue-500 shadow-sm"
          : "bg-[var(--bg-card)] border-transparent hover:border-[var(--border)] hover:bg-slate-50 dark:hover:bg-slate-800/50"
      )}
    >
      <div className="flex items-start gap-4 overflow-hidden w-full">
        <div className={clsx(
          "w-10 h-10 rounded-lg flex items-center justify-center shrink-0 transition-colors mt-0.5",
          isSelected ? "bg-blue-100 text-blue-600 dark:bg-blue-900/40 dark:text-blue-400" : "bg-slate-100 text-slate-500 dark:bg-slate-800"
        )}>
          <FileAudio size={20} />
        </div>

        <div className="flex flex-col min-w-0 flex-1 pr-2">
          <span
            title={job.name || job.filename}
            className={clsx(
              "text-sm font-medium transition-all leading-snug",
              isSelected
                ? "text-blue-600 dark:text-blue-400 whitespace-normal break-words"
                : "text-[var(--text-main)] truncate"
            )}
          >
            {job.name || job.filename}
          </span>

          <span className="text-xs text-[var(--text-muted)] truncate mt-0.5">
            {job.status === 'Running' && job.message
              ? <span className="text-blue-500 dark:text-blue-400 animate-pulse">{job.message}</span>
              : `${dateStr} • ${sizeStr}`
            }
          </span>
        </div>
      </div>

      <div className="flex flex-col items-end gap-2 pl-2 shrink-0">
        <div className="flex items-center gap-2">
          <StatusBadge status={job.status} />

          <ChevronRight
            size={16}
            className={clsx(
              "text-slate-300 transition-transform duration-300",
              isSelected && "rotate-90 text-blue-500"
            )}
          />
        </div>

        {job.status === 'Running' && (
          <div className="w-20">
            <div className="h-1 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
              {job.progress ? (
                <div
                  className="h-full bg-blue-500 rounded-full transition-all duration-500"
                  style={{ width: `${job.progress}%` }}
                />
              ) : (
                <div className="h-full w-full bg-blue-500 rounded-full animate-pulse opacity-60" />
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}