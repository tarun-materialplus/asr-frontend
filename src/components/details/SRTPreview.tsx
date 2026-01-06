import { useState, useMemo } from "react";
import Card from "../ui/Card";
import { Copy, FileJson, AlignLeft, Check, Clock, FileDown, Image as ImageIcon } from "lucide-react";
import { toast } from "sonner";

export default function SRTPreview({ srt }: { srt?: string }) {
  const [viewMode, setViewMode] = useState<"pretty" | "raw">("pretty");
  const [copied, setCopied] = useState(false);

  const isBlob = srt?.trim().startsWith("blob:");
  const blobUrl = srt;

  const parsedData = useMemo(() => {
    if (!srt || isBlob) return null;
    try {
      const trimmed = srt.trim();
      if (trimmed.startsWith("{") || trimmed.startsWith("[")) {
        return JSON.parse(srt);
      }
      return null;
    } catch {
      return null;
    }
  }, [srt, isBlob]);

  const handleCopy = () => {
    if (!srt) return;
    navigator.clipboard.writeText(srt);
    setCopied(true);
    toast.success("Copied to clipboard");
    setTimeout(() => setCopied(false), 2000);
  };

  const renderValue = (value: any) => {
    if (Array.isArray(value)) {
      if (value.length === 0) return <span className="text-xs text-slate-400">None</span>;
      if (typeof value[0] === 'object') {
        return (
          <div className="flex flex-col gap-2 mt-2">
            {value.map((item, i) => (
              <div key={i} className="flex items-center justify-between p-3 rounded bg-slate-50 dark:bg-slate-800/50 text-xs border border-slate-100 dark:border-slate-800">
                <span className="font-semibold text-slate-700 dark:text-slate-200 truncate pr-4">
                  {item.text || item.type || item.name || item.label || `Item ${i + 1}`}
                </span>
                {(item.start_time || item.startTime) && (
                  <div className="flex items-center gap-1.5 text-slate-400 font-mono bg-white dark:bg-slate-900 px-2 py-1 rounded border border-slate-100 dark:border-slate-700 shrink-0">
                    <Clock size={10} />
                    <span>{item.start_time || item.startTime}</span>
                    <span className="text-slate-300">-</span>
                    <span>{item.end_time || item.endTime}</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        );
      }
      return (
        <div className="flex flex-wrap gap-2 mt-1">
          {value.map((item, i) => (
            <span key={i} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
              {String(item)}
            </span>
          ))}
        </div>
      );
    }
    if (typeof value === "object" && value !== null) {
      return <pre className="text-[10px] opacity-70 mt-1">{JSON.stringify(value, null, 2)}</pre>;
    }
    return <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed font-medium">{String(value)}</p>;
  };

  return (
    <Card className="flex flex-col h-full min-h-[300px] flex-1 overflow-hidden" noPadding>
      <div className="px-4 py-3 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-900/50">
        <div className="flex items-center gap-2">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">Analysis Result</h4>
          {parsedData && <span className="text-[10px] bg-emerald-100 text-emerald-700 px-1.5 py-0.5 rounded font-medium">JSON</span>}
          {isBlob && <span className="text-[10px] bg-purple-100 text-purple-700 px-1.5 py-0.5 rounded font-medium">MEDIA FILE</span>}
        </div>

        <div className="flex items-center gap-1">
          {parsedData && (
            <div className="flex bg-slate-200 dark:bg-slate-800 rounded p-0.5 mr-2">
              <button onClick={() => setViewMode("pretty")} className={`p-1 rounded ${viewMode === 'pretty' ? 'bg-white shadow-sm' : 'text-slate-400'}`}><AlignLeft size={14} /></button>
              <button onClick={() => setViewMode("raw")} className={`p-1 rounded ${viewMode === 'raw' ? 'bg-white shadow-sm' : 'text-slate-400'}`}><FileJson size={14} /></button>
            </div>
          )}
          {!isBlob && <button onClick={handleCopy} className="p-1.5 hover:bg-slate-200 rounded text-slate-500"><Copy size={14} /></button>}
        </div>
      </div>

      {/* Content Area */}
      <div className="relative flex-1 bg-white dark:bg-[#0f172a] overflow-auto custom-scrollbar">
        {!srt && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none p-4 text-center">
            <span className="text-slate-400 text-sm">Select a completed job to view results.</span>
          </div>
        )}

        {isBlob && blobUrl && (
          <div className="flex flex-col items-center justify-center h-full p-6 gap-4 text-center">
            <div className="p-4 bg-slate-50 dark:bg-slate-900 rounded-full">
              <ImageIcon className="w-8 h-8 text-blue-500" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-slate-900 dark:text-white">Analysis File Generated</h3>
              <p className="text-xs text-slate-500 mt-1 max-w-xs mx-auto">
                The analysis returned a media file or archive. Click below to view or download it.
              </p>
            </div>

            <div className="border rounded-lg overflow-hidden max-h-48 shadow-sm">
              <img src={blobUrl} alt="Result Preview" className="object-contain max-h-48" onError={(e) => e.currentTarget.style.display = 'none'} />
            </div>

            <a
              href={blobUrl}
              download={`analysis_result_${Date.now()}`}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 transition-colors"
            >
              <FileDown size={16} /> Download File
            </a>
          </div>
        )}

        {srt && !isBlob && parsedData && viewMode === "pretty" ? (
          <div className="p-5 space-y-6">
            {Object.entries(parsedData).map(([key, value]) => (
              <div key={key}>
                <h5 className="text-[10px] uppercase font-bold text-slate-400 mb-2 tracking-wide">{key.replace(/_/g, " ")}</h5>
                {renderValue(value)}
                <div className="h-px bg-slate-50 dark:bg-slate-800 mt-4" />
              </div>
            ))}
          </div>
        ) : !isBlob && (
          <div className="p-4">
            <textarea
              readOnly
              value={srt || ""}
              className="w-full h-64 p-4 bg-[#1e293b] text-slate-300 font-mono text-xs leading-relaxed resize-none focus:outline-none rounded-lg"
            />
          </div>
        )}
      </div>
    </Card>
  );
}