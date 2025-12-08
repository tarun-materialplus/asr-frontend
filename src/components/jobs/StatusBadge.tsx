import clsx from "clsx";
import { CheckCircle2, CircleDashed, Clock, AlertCircle, PauseCircle, XCircle, type LucideIcon } from "lucide-react";

export default function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    Completed: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
    Running: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20",
    Queued: "bg-slate-500/10 text-slate-600 dark:text-slate-400 border-slate-500/20",
    Error: "bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20",
    Paused: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
    Aborted: "bg-gray-500/10 text-gray-600 dark:text-gray-400 border-gray-500/20",
  };

  const Icons: Record<string, LucideIcon> = {
    Completed: CheckCircle2,
    Running: CircleDashed,
    Queued: Clock,
    Error: AlertCircle,
    Paused: PauseCircle,
    Aborted: XCircle,
  };

  const Icon = Icons[status] || Clock;
  const styleClass = styles[status] || styles.Queued;

  return (
    <span className={clsx("inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border", styleClass)}>
      <Icon className={clsx("w-3.5 h-3.5", status === 'Running' && "animate-spin")} />
      {status}
    </span>
  );
}