import { useState } from "react";
import Card from "../ui/Card";
import Button from "../ui/Button";
import { useUIStore } from "../../store/uiStore";
import { useUpload } from "../../hooks/useUpload";
import { Languages, FileText, Video, Image as ImageIcon, Music } from "lucide-react";

const ENRICHMENT_OPTIONS: Record<string, { label: string; endpoint: string }[]> = {
  video: [
    // --- VIDEO ONLY ENDPOINTS ---
    // Removed "/audio/transcribe_multi_language-azure" because it crashes with video files.
    // Use TTSOE for Video Transcription instead.
    { label: "Video Indexer (Transcription/Translation)", endpoint: "/video/TTSOE-azure_video_indexer" },
    { label: "Language, Emotion & Rolling Credits", endpoint: "/video/LangDetect_EmotionTag_RollingCredits" },
    { label: "OCR on Video (Azure)", endpoint: "/video/OCR_on_video-azure_indexer" },
    // Video 2 Endpoints
    { label: "Video Insights", endpoint: "/video_2/insights/" },
    { label: "Scene Detection", endpoint: "/video_2/detect_scenes/" },
    { label: "Extract Key Frames", endpoint: "/video_2/extract_key_frames/" }
  ],
  audio: [
    // --- AUDIO ONLY ENDPOINTS ---
    { label: "Transcribe Multi-Language", endpoint: "/audio/transcribe_multi_language-azure" },
    { label: "Syntax Analysis", endpoint: "/audio/Syntax_Analysis" },
    { label: "Video Indexer (Audio Mode)", endpoint: "/audio/TTSOE-azure_video_indexer/" },
    { label: "Language & Emotion Tagging", endpoint: "/audio/LangDetect_EmotionTag_RollingCredits" }
  ],
  image: [
    { label: "Image Description (GPT)", endpoint: "/image/object_detection-GPT" }
  ],
  // THESE MUST MATCH YOUR CURL COMMANDS EXACTLY:
  text: [
    { label: "NER Extract (GPT)", endpoint: "/text/name_entity_recognition-gpt" },
    { label: "Parts of Speech", endpoint: "/text/parts_of_speech_tagging-gpt" },
    { label: "Brand NER (GPT)", endpoint: "/text/brand_name_entity_recognition-gpt" },
    { label: "Detect Language (Azure)", endpoint: "/text/detect_language-azure" },
    { label: "Entity Extraction (Azure)", endpoint: "/text/name_entity_extraction-azure" },
    { label: "Detect Language (GPT)", endpoint: "/text/detect_language-gpt" }
  ]
};

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
  const mediaType = useUIStore((s) => s.activeMediaType);
  
  const { startUpload, loading } = useUpload();

  const [selectedLang, setSelectedLang] = useState("en-US");
  const [doTranslate, setDoTranslate] = useState(false);
  
  const [prevMediaType, setPrevMediaType] = useState(mediaType);
  const [textInput, setTextInput] = useState("");
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);

  if (mediaType !== prevMediaType) {
    setPrevMediaType(mediaType);
    setSelectedOptions([]);
    setTextInput("");
  }

  const toggleOption = (endpoint: string) => {
    setSelectedOptions(prev => 
      prev.includes(endpoint) ? prev.filter(o => o !== endpoint) : [...prev, endpoint]
    );
  };

  const handleProcess = () => {
    if (mediaType === 'text' && !textInput.trim()) return;

    startUpload({ 
      // Keep name for display in the Job List (truncated is fine for display)
      name: mediaType === 'text' ? `Text Analysis: ${textInput.slice(0, 15)}...` : undefined,
      
      // Pass full text for the API (CRITICAL FIX)
      textContent: mediaType === 'text' ? textInput : undefined,
      
      language: selectedLang, 
      translate: doTranslate,
      options: selectedOptions 
    });
  };

  const CurrentIcon = mediaType === 'video' ? Video 
    : mediaType === 'audio' ? Music 
    : mediaType === 'image' ? ImageIcon 
    : FileText;

  const isFileMode = mediaType !== 'text';
  const hasContent = isFileMode ? staged.length > 0 : textInput.trim().length > 0;
  const hasOptions = selectedOptions.length > 0;
  const isDisabled = loading || !hasContent || !hasOptions;

  return (
    <Card className="flex flex-col gap-6">
      <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg text-blue-600">
            <CurrentIcon size={20} />
          </div>
          <div>
            <h4 className="text-sm font-bold text-slate-900 dark:text-white capitalize">
              {mediaType} Analysis
            </h4>
            <p className="text-xs text-slate-500">Configure your job</p>
          </div>
        </div>
        <span className="text-xs font-medium bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded text-slate-600 dark:text-slate-300">
          {mediaType === 'text' ? 'Manual Input' : `${staged.length} Files`}
        </span>
      </div>

      <div>
        <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3 block">
          1. Selected Content
        </label>
        
        {mediaType === 'text' ? (
          <textarea
            value={textInput}
            onChange={(e) => setTextInput(e.target.value)}
            placeholder="Enter text to analyze..."
            className="w-full h-40 p-4 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-sm focus:ring-2 focus:ring-blue-500 outline-none resize-y"
          />
        ) : (
          <div className="space-y-2 max-h-[40vh] overflow-y-auto custom-scrollbar bg-slate-50 dark:bg-slate-900/50 p-3 rounded-xl border border-slate-100 dark:border-slate-800">
            {staged.length === 0 && (
              <div className="flex flex-col items-center justify-center py-8 text-slate-400">
                <p className="text-xs">No files selected</p>
                <p className="text-[10px] opacity-70">Use the dropzone above</p>
              </div>
            )}
            {staged.map((f, i) => (
              <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm group">
                <div className="flex items-center gap-3 overflow-hidden">
                  <div className="w-8 h-8 bg-slate-100 dark:bg-slate-700 flex items-center justify-center rounded-lg text-slate-500 shrink-0">
                    <FileText size={14} />
                  </div>
                  <div className="min-w-0">
                    <div className="text-sm font-medium text-slate-700 dark:text-slate-200 truncate max-w-[200px]" title={f.name}>
                      {f.name}
                    </div>
                    <div className="text-[10px] text-slate-400">{(f.size / 1024 / 1024).toFixed(2)} MB</div>
                  </div>
                </div>
                <button 
                  onClick={() => remove(i)} 
                  className="text-slate-400 hover:text-red-500 p-1 rounded-md hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <div>
        <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3 block">
          2. Enrichment Features
        </label>
        <div className="grid grid-cols-1 gap-2">
          {ENRICHMENT_OPTIONS[mediaType].map((opt) => (
            <label key={opt.endpoint} className="flex items-start gap-3 cursor-pointer group p-3 rounded-lg border border-slate-100 dark:border-slate-800 hover:border-blue-200 dark:hover:border-blue-800 hover:bg-blue-50 dark:hover:bg-blue-900/10 transition-all">
              <input 
                type="checkbox" 
                checked={selectedOptions.includes(opt.endpoint)}
                onChange={() => toggleOption(opt.endpoint)}
                className="mt-0.5 w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 shrink-0"
              />
              <span className="text-sm text-slate-700 dark:text-slate-300 leading-tight group-hover:text-blue-700 dark:group-hover:text-blue-300 transition-colors">
                {opt.label}
              </span>
            </label>
          ))}
        </div>
      </div>

      <div>
        <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3 block">
          3. Settings
        </label>
        <div className="space-y-4 p-4 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-slate-500">Source Language</label>
            <div className="relative">
              <Languages className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
              <select 
                value={selectedLang}
                onChange={(e) => setSelectedLang(e.target.value)}
                className="w-full pl-10 p-2.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-sm focus:ring-2 focus:ring-blue-500 outline-none appearance-none"
              >
                {API_LANGUAGES.map((l) => (
                  <option key={l.code} value={l.code}>{l.label}</option>
                ))}
              </select>
            </div>
          </div>

          <label className="flex items-center gap-3 cursor-pointer group">
            <input 
              type="checkbox" 
              checked={doTranslate}
              onChange={(e) => setDoTranslate(e.target.checked)}
              className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
            />
            <span className="text-sm text-slate-700 dark:text-slate-300 group-hover:text-blue-600 transition-colors">
              Translate Output to English
            </span>
          </label>
        </div>
      </div>

      <div className="mt-6">
        <Button 
          className="w-full justify-center py-3 text-base shadow-lg shadow-blue-500/20"
          disabled={isDisabled} 
          onClick={handleProcess}
        >
          {loading ? "Processing..." : "Start Processing"}
        </Button>
        {isDisabled && (
          <p className="text-[10px] text-center text-slate-400 mt-2">
            Select a file/text AND at least one feature to continue
          </p>
        )}
      </div>
    </Card>
  );
}