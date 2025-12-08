import { useState } from "react";
import Card from "../ui/Card";
import Button from "../ui/Button";
import { useUIStore } from "../../store/uiStore";
import { useUpload } from "../../hooks/useUpload";
import { Languages, FileAudio } from "lucide-react"; 

const API_LANGUAGES = [
  { code: "en-US", label: "English (US)" },
  { code: "en-GB", label: "English (UK)" },
  { code: "en-SG", label: "English (Singapore)" },
  { code: "ms-MY", label: "Malay (Malaysia)" },
  { code: "ta-IN", label: "Tamil (India)" },
  { code: "zh-CN", label: "Chinese (Simplified)" },
];

export default function StagedFilesList() {
  const staged = useUIStore((s) => s.stagedFiles);
  const remove = useUIStore((s) => s.removeStagedFile);
  const { startUpload, loading } = useUpload();

  const [selectedLang, setSelectedLang] = useState("en-US");
  const [doTranslate, setDoTranslate] = useState(false);

  const handleProcess = () => {
    startUpload({ 
      language: selectedLang, 
      
      translate: doTranslate 
    });
  };

  return (
    <Card>
      <div className="flex items-center justify-between mb-3">
        <h4 className="text-sm font-semibold text-slate-900 dark:text-white">Staged Files</h4>
        <span className="text-xs text-slate-500">{staged.length} files</span>
      </div>

      <div className="space-y-2 max-h-60 overflow-y-auto custom-scrollbar">
        {staged.length === 0 && <p className="text-sm text-slate-400 italic py-2">No files selected</p>}
        {staged.map((f, i) => (
          <div key={i} className="flex items-center justify-between bg-slate-50 dark:bg-slate-800/50 p-2 rounded border border-slate-100 dark:border-slate-700">
            <div className="flex items-center gap-3 overflow-hidden">
              <div className="w-8 h-8 bg-slate-200 dark:bg-slate-700 flex items-center justify-center rounded text-slate-500">
                <FileAudio size={14} />
              </div>
              <div className="min-w-0">
                <div className="text-sm font-medium text-slate-700 dark:text-slate-200 truncate max-w-[150px]">{f.name}</div>
                <div className="text-[10px] text-slate-400">{(f.size / 1024 / 1024).toFixed(1)} MB</div>
              </div>
            </div>
            <button onClick={() => remove(i)} className="text-xs text-red-500 hover:text-red-600 font-medium px-2">
              Remove
            </button>
          </div>
        ))}
      </div>

      {/* Configuration Section */}
      <div className="mt-4 space-y-3 pt-3 border-t border-slate-100 dark:border-slate-800">
        
        {/* Language Selector */}
        <div className="flex flex-col gap-1">
          <label className="text-xs font-medium text-slate-500">Source Language</label>
          <div className="relative">
            <Languages className="absolute left-2.5 top-2.5 w-4 h-4 text-slate-400" />
            <select 
              value={selectedLang}
              onChange={(e) => setSelectedLang(e.target.value)}
              className="w-full pl-9 p-2 rounded bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-sm focus:ring-2 focus:ring-blue-500 outline-none appearance-none"
            >
              {API_LANGUAGES.map((l) => (
                <option key={l.code} value={l.code}>{l.label}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Translate Checkbox */}
        <label className="flex items-center gap-2 cursor-pointer group">
          <input 
            type="checkbox" 
            checked={doTranslate}
            onChange={(e) => setDoTranslate(e.target.checked)}
            className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
          />
          <span className="text-sm text-slate-700 dark:text-slate-300 group-hover:text-blue-600 transition-colors">
            Translate to English
          </span>
        </label>
      </div>

      <div className="mt-4">
        <Button 
          className="w-full justify-center"
          disabled={staged.length === 0 || loading} 
          onClick={handleProcess}
        >
          {loading ? "Uploading & Processing..." : "Start Processing"}
        </Button>
      </div>
    </Card>
  );
}