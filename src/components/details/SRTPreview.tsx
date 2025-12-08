import Card from "../ui/Card";
import { Download, Copy } from "lucide-react";

export default function SRTPreview({ srt }: { srt?: string }) {
  return (
    <Card className="flex flex-col h-full min-h-[300px]" noPadding>
      <div className="px-4 py-3 border-b border-[var(--border)] flex items-center justify-between bg-slate-50 dark:bg-slate-900/50">
        <div className="flex items-center gap-2">
          <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--text-muted)]">Transcript Preview</h4>
          <span className="text-[10px] bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300 px-1.5 py-0.5 rounded">SRT</span>
        </div>
        <div className="flex gap-1">
          <button className="p-1.5 hover:bg-slate-200 dark:hover:bg-slate-700 rounded text-[var(--text-muted)] transition" title="Copy">
            <Copy size={14} />
          </button>
          <button className="p-1.5 hover:bg-slate-200 dark:hover:bg-slate-700 rounded text-[var(--text-muted)] transition" title="Download">
            <Download size={14} />
          </button>
        </div>
      </div>

      <div className="relative flex-1 bg-[#1e293b] overflow-hidden group">
        <textarea 
          readOnly
          value={srt || "Waiting for transcription..."}
          className="w-full h-full p-4 bg-transparent text-slate-300 font-mono text-xs leading-relaxed resize-none focus:outline-none selection:bg-blue-500/30"
          style={{ fontFamily: '"JetBrains Mono", "Fira Code", monospace' }}
        />
        {!srt && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <span className="text-slate-600 text-sm">No content available</span>
          </div>
        )}
      </div>
    </Card>
  );
}