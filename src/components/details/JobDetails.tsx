import { useState } from "react";
import { useUIStore } from "../../store/uiStore";
import { downloadSrts } from "../../services/asr";
import Card from "../ui/Card";
import SRTPreview from "./SRTPreview";
import { Download, FileText, Loader2, AlertCircle } from "lucide-react";
import { toast } from "sonner";

export default function JobDetails() {
  const jobs = useUIStore((s) => s.jobs);
  const selectedId = useUIStore((s) => s.selectedJobId);
  const job = jobs.find((j) => j.session_id === selectedId) ?? jobs[0];
  
  const [downloading, setDownloading] = useState(false);

  const handleDownload = async () => {
    if (!job.container_name || !job.folder_name) {
      toast.error("Missing container or folder info. Cannot download.");
      return;
    }

    setDownloading(true);
    try {
      const response = await downloadSrts(job.container_name, job.folder_name);
      
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${job.name || "transcription"}_output.zip`); // Name of the downloaded file
      document.body.appendChild(link);
      link.click();
      
      link.remove();
      toast.success("Download started");
    } catch (e) {
      console.error(e);
      toast.error("Failed to download files. Backend error.");
    } finally {
      setDownloading(false);
    }
  };

  if (!job) {
    return (
      <Card>
        <div className="text-sm text-slate-500 text-center py-8">Select a job to view details</div>
      </Card>
    );
  }

  const isCompleted = job.status === "Completed";

  return (
    <div className="space-y-4">
      <Card>
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-base font-semibold text-slate-900 dark:text-white line-clamp-1" title={job.name}>
              {job.name || job.filename}
            </h3>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-xs text-slate-500 font-mono bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded">
                {job.session_id.slice(0, 8)}...
              </span>
              <span className="text-xs text-slate-400">
                {job.language || "en-US"}
              </span>
            </div>
          </div>
          
          <div className={`px-2 py-1 rounded text-xs font-medium ${
            isCompleted 
              ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400"
              : "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
          }`}>
            {job.status}
          </div>
        </div>

        <div className="mt-5 flex gap-3">
          <button 
            onClick={handleDownload}
            disabled={!isCompleted || downloading}
            className="flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-sm font-medium hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            {downloading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
            Download ZIP
          </button>
          
          <button disabled className="px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-400 text-sm font-medium cursor-not-allowed flex items-center gap-2">
            <FileText className="w-4 h-4" />
            Logs
          </button>
        </div>

        {!isCompleted && (
          <div className="mt-3 flex items-start gap-2 text-xs text-amber-600 dark:text-amber-500 bg-amber-50 dark:bg-amber-900/20 p-2 rounded">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <p>Downloads will be available once processing is complete.</p>
          </div>
        )}
      </Card>

      <SRTPreview srt={job.srtText} />

      <Card>
        <h5 className="text-sm font-semibold text-slate-900 dark:text-white mb-2">Technical Metadata</h5>
        <div className="bg-slate-50 dark:bg-slate-900 p-3 rounded-lg overflow-x-auto">
          <pre className="text-[10px] leading-relaxed text-slate-600 dark:text-slate-400 font-mono">
{JSON.stringify({
  container: job.container_name,
  folder: job.folder_name,
  created: job.createdAt,
  raw_status: job.status
}, null, 2)}
          </pre>
        </div>
      </Card>
    </div>
  );
}