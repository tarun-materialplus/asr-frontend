import { useState, useMemo } from "react";
import Card from "../ui/Card";
import { Copy, FileJson, AlignLeft, Check } from "lucide-react";
import { toast } from "sonner";

export default function SRTPreview({ srt }: { srt?: string }) {
  const [viewMode, setViewMode] = useState<"pretty" | "raw">("pretty");
  const [copied, setCopied] = useState(false);

  const parsedData = useMemo(() => {
    if (!srt) return null;
    try {
      if (srt.trim().startsWith("{") || srt.trim().startsWith("[")) {
        return JSON.parse(srt);
      }
      return null;
    } catch {
      return null;
    }
  }, [srt]);

  const handleCopy = () => {
    if (!srt) return;
    navigator.clipboard.writeText(srt);
    setCopied(true);
    toast.success("Copied to clipboard");
    setTimeout(() => setCopied(false), 2000);
  };

  const renderValue = (value: any) => {
    if (Array.isArray(value)) {
      return (
        <div className="flex flex-wrap gap-2 mt-1">
          {value.map((item, i) => (
            <span key={i} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
              {String(item)}
            </span>
          ))}
        </div>
      );
    }
    if (typeof value === "object" && value !== null) {
      return <pre className="text-[10px] opacity-70">{JSON.stringify(value, null, 2)}</pre>;
    }
    return <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">{String(value)}</p>;
  };

  return (
    <Card className="flex flex-col h-full min-h-[300px] flex-1 overflow-hidden" noPadding>
      {/* Header */}
      <div className="px-4 py-3 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-900/50">
        <div className="flex items-center gap-2">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">Analysis Result</h4>
          {parsedData && (
            <span className="text-[10px] bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 px-1.5 py-0.5 rounded">
              JSON
            </span>
          )}
        </div>
        
        <div className="flex items-center gap-1">
          {parsedData && (
            <div className="flex bg-slate-200 dark:bg-slate-800 rounded p-0.5 mr-2">
              <button
                onClick={() => setViewMode("pretty")}
                className={`p-1 rounded ${viewMode === 'pretty' ? 'bg-white dark:bg-slate-700 shadow-sm' : 'text-slate-400'}`}
                title="Readable View"
              >
                <AlignLeft size={14} />
              </button>
              <button
                onClick={() => setViewMode("raw")}
                className={`p-1 rounded ${viewMode === 'raw' ? 'bg-white dark:bg-slate-700 shadow-sm' : 'text-slate-400'}`}
                title="Raw Code View"
              >
                <FileJson size={14} />
              </button>
            </div>
          )}

          <button 
            onClick={handleCopy}
            className="p-1.5 hover:bg-slate-200 dark:hover:bg-slate-700 rounded text-slate-500 transition" 
            title="Copy Content"
          >
            {copied ? <Check size={14} className="text-green-500" /> : <Copy size={14} />}
          </button>
        </div>
      </div>

      <div className="relative flex-1 bg-white dark:bg-[#0f172a] overflow-auto custom-scrollbar">
        
        {!srt && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none p-4 text-center">
            <span className="text-slate-400 text-sm">
              Select a completed job to view results.
            </span>
          </div>
        )}

        {srt && parsedData && viewMode === "pretty" ? (
          <div className="p-5 space-y-5">
            {Object.entries(parsedData).map(([key, value]) => (
              <div key={key}>
                <h5 className="text-[10px] uppercase font-bold text-slate-400 mb-1 tracking-wide">
                  {key.replace(/_/g, " ")}
                </h5>
                {renderValue(value)}
                <div className="h-px bg-slate-50 dark:bg-slate-800 mt-4" />
              </div>
            ))}
          </div>
        ) : (
          <textarea 
            readOnly
            value={srt || ""}
            className="w-full h-full p-4 bg-[#1e293b] text-slate-300 font-mono text-xs leading-relaxed resize-none focus:outline-none"
            style={{ fontFamily: '"JetBrains Mono", "Fira Code", monospace' }}
          />
        )}
      </div>
    </Card>
  );
}