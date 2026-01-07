import { useState, useMemo } from "react";
import Card from "../ui/Card";
import { Copy, FileJson, AlignLeft, Clock, FileDown, Image as ImageIcon } from "lucide-react";
import { toast } from "sonner";

export default function SRTPreview({ srt }: { srt?: string }) {
  const [viewMode, setViewMode] = useState<"pretty" | "raw">("pretty");
  const [copied, setCopied] = useState(false);

  const isBlob = srt?.trim().startsWith("blob:");
  const blobUrl = isBlob ? srt?.replace("blob:", "") : "";

  const cleanAndParse = (input: string) => {
    try {
      let clean = input.trim();
      if (clean.startsWith("```")) {
        clean = clean.replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/, "");
      }

      if (clean.startsWith("{") || clean.startsWith("[")) {
        if (clean.includes("'") && !clean.includes('"')) {
          clean = clean.replace(/'/g, '"');
        }
      }
      return JSON.parse(clean);
    } catch {
      return null;
    }
  };

  const parsedData = useMemo(() => {
    if (!srt || isBlob) return null;

    let data = cleanAndParse(srt);
    if (!data) return null;

    if (typeof data === 'string') {
      const innerData = cleanAndParse(data);
      if (innerData) data = innerData;
    }

    if (typeof data === 'object' && data !== null) {
      Object.keys(data).forEach(key => {
        if (typeof data[key] === 'string') {
          const val = data[key].trim();
          if (val.startsWith("```") || val.startsWith("{") || val.startsWith("[")) {
            const nested = cleanAndParse(val);
            if (nested) {
              data[key] = nested;
            }
          }
        }
      });
    }
    return data;
  }, [srt, isBlob]);

  const handleCopy = () => {
    if (!srt) return;
    navigator.clipboard.writeText(srt);
    setCopied(true);
    toast.success("Copied to clipboard");
    setTimeout(() => setCopied(false), 2000);
  };

  const renderGroupedDictionary = (obj: Record<string, any>) => {
    const groups: Record<string, string[]> = {};
    Object.entries(obj).forEach(([word, category]) => {
      const cat = String(category).toUpperCase();
      if (!groups[cat]) groups[cat] = [];
      groups[cat].push(word);
    });

    return (
      <div className="flex flex-col gap-3 mt-1">
        {Object.entries(groups).map(([category, items]) => (
          <div key={category} className="flex flex-col border-b border-slate-100 dark:border-slate-800 pb-2 last:border-0">
            <div className="flex items-center gap-2 mb-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
              <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">
                {category}
              </span>
            </div>
            <div className="flex flex-wrap gap-1.5 pl-3">
              {items.map((txt, idx) => (
                <span key={idx} className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 px-2 py-1 rounded-md text-xs border border-slate-200 dark:border-slate-700">
                  {txt}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  };

  const renderValue = (value: any) => {
    if (Array.isArray(value)) {
      if (value.length === 0) return <span className="text-xs text-slate-400">None</span>;
      const firstItem = value[0];

      const hasTime = typeof firstItem === 'object' && ('start_time' in firstItem || 'startTime' in firstItem);
      if (hasTime) {
        return (
          <div className="flex flex-col gap-2 mt-2">
            {value.map((item, i) => (
              <div key={i} className="flex items-center justify-between p-2 rounded bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 text-xs">
                <span className="font-semibold text-slate-700 dark:text-slate-200 truncate pr-4">
                  {item.text || item.type || item.label || `Item ${i + 1}`}
                </span>
                <div className="flex items-center gap-1.5 text-slate-400 font-mono text-[10px]">
                  <Clock size={10} />
                  <span>{item.start_time || item.startTime || "0:00"}</span>
                </div>
              </div>
            ))}
          </div>
        );
      }

      if (typeof firstItem === 'object' && firstItem !== null) {
        return (
          <div className="grid grid-cols-1 gap-3 mt-2">
            {value.map((item, i) => {
              const headerKey = Object.keys(item).find(k => ['type', 'category', 'label', 'name', 'object'].includes(k.toLowerCase()));
              const headerValue = headerKey ? item[headerKey] : null;

              const bodyKey = Object.keys(item).find(k => ['description', 'text', 'content', 'value'].includes(k.toLowerCase()));
              const bodyValue = bodyKey ? item[bodyKey] : null;

              const otherKeys = Object.entries(item).filter(([k]) => k !== headerKey && k !== bodyKey);

              if (headerValue || bodyValue) {
                return (
                  <div key={i} className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 text-sm hover:border-blue-200 dark:hover:border-blue-800 transition-colors">

                    {headerValue && (
                      <div className="mb-2.5">
                        <span className="inline-flex items-center px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300">
                          {String(headerValue)}
                        </span>
                      </div>
                    )}

                    {bodyValue && (
                      <div className="text-slate-700 dark:text-slate-300 leading-relaxed text-xs sm:text-sm">
                        {String(bodyValue)}
                      </div>
                    )}

                    {otherKeys.length > 0 && (
                      <div className="mt-3 pt-3 border-t border-slate-200 dark:border-slate-700/50 grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-3">
                        {otherKeys.map(([k, v]) => {
                          const isComplex = typeof v === 'object';
                          const displayValue = isComplex ? JSON.stringify(v) : String(v);
                          const isLong = displayValue.length > 40;

                          return (
                            <div
                              key={k}
                              className={`flex flex-col ${isComplex || isLong ? 'col-span-1 sm:col-span-2' : ''}`}
                            >
                              <span className="text-[9px] uppercase font-bold text-slate-400 mb-1">{k.replace(/_/g, " ")}</span>
                              <span className="text-[11px] text-slate-600 dark:text-slate-400 font-mono break-all whitespace-pre-wrap leading-tight bg-white dark:bg-slate-900/50 p-1.5 rounded border border-slate-100 dark:border-slate-800/50">
                                {displayValue}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              }

              return (
                <div key={i} className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 text-xs space-y-1">
                  {Object.entries(item).map(([k, v]) => (
                    <div key={k} className="flex flex-col gap-0.5">
                      <span className="text-[10px] uppercase font-bold text-slate-400">{k}</span>
                      <span className="text-slate-700 dark:text-slate-200 break-words">
                        {typeof v === 'object' ? JSON.stringify(v) : String(v)}
                      </span>
                    </div>
                  ))}
                </div>
              );
            })}
          </div>
        );
      }

      return (
        <div className="flex flex-wrap gap-2 mt-1">
          {value.map((item, i) => (
            <span key={i} className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
              {String(item)}
            </span>
          ))}
        </div>
      );
    }

    if (typeof value === "object" && value !== null) {
      const values = Object.values(value);
      const isFlatDict = values.length > 0 && values.every(v => typeof v === 'string' || typeof v === 'number');

      if (isFlatDict) {
        return renderGroupedDictionary(value);
      }

      return <div className="pl-0 mt-2">
        {Object.entries(value).map(([k, v]) => (
          <div key={k} className="mb-4">
            <span className="text-[10px] uppercase text-slate-400 font-bold tracking-wider block mb-1.5">{k.replace(/_/g, " ")}</span>
            <div className="text-sm text-slate-700 dark:text-slate-300">
              {typeof v === 'object' ? renderValue(v) : String(v)}
            </div>
          </div>
        ))}
      </div>;
    }

    return <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed font-medium bg-slate-50 dark:bg-slate-900/50 p-2 rounded">{String(value)}</p>;
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
          {!isBlob && parsedData && (
            <div className="flex bg-slate-200 dark:bg-slate-800 rounded p-0.5 mr-2">
              <button onClick={() => setViewMode("pretty")} className={`p-1 rounded ${viewMode === 'pretty' ? 'bg-white shadow-sm' : 'text-slate-400'}`}><AlignLeft size={14} /></button>
              <button onClick={() => setViewMode("raw")} className={`p-1 rounded ${viewMode === 'raw' ? 'bg-white shadow-sm' : 'text-slate-400'}`}><FileJson size={14} /></button>
            </div>
          )}
          {!isBlob && <button onClick={handleCopy} className="p-1.5 hover:bg-slate-200 rounded text-slate-500"><Copy size={14} /></button>}
        </div>
      </div>

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
            <a href={blobUrl} download={`analysis_result_${Date.now()}`} className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 transition-colors">
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
                <div className="h-px bg-slate-50 dark:bg-slate-800 mt-4 last:hidden" />
              </div>
            ))}
          </div>
        ) : !isBlob && (
          <div className="p-4">
            <textarea
              readOnly
              value={srt || ""}
              className="w-full h-full min-h-[300px] p-4 bg-[#1e293b] text-slate-300 font-mono text-xs leading-relaxed resize-none focus:outline-none rounded-lg"
            />
          </div>
        )}
      </div>
    </Card>
  );
}