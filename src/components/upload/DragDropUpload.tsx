import { useDropzone } from "react-dropzone";
import { useUIStore } from "../../store/uiStore";
import Card from "../ui/Card";
import { UploadCloud, FileAudio, FileVideo } from "lucide-react";

export default function DragDropUpload() {
  const addStagedFiles = useUIStore((s) => s.addStagedFiles);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: (acceptedFiles) => {
      addStagedFiles(acceptedFiles);
    },
    accept: { "video/*": [], "audio/*": [], "image/*": [] },
    multiple: true,
  });

  return (
    <Card className="relative group overflow-hidden border-2 border-dashed border-[var(--border)] hover:border-blue-500 dark:hover:border-blue-500 transition-colors">
      <div {...getRootProps()} className="flex flex-col items-center justify-center py-8 cursor-pointer z-10 relative">
        <input {...getInputProps()} />

        <div className={`p-4 rounded-full mb-4 transition-transform duration-300 ${isDragActive ? 'scale-110 bg-blue-100 dark:bg-blue-900/30' : 'bg-[var(--bg-app)]'}`}>
          <UploadCloud className={`w-8 h-8 ${isDragActive ? 'text-blue-600' : 'text-[var(--text-muted)]'}`} />
        </div>

        <h3 className="text-sm font-semibold text-[var(--text-main)] mb-1">
          {isDragActive ? "Drop files now" : "Click or Drag files here"}
        </h3>
        <p className="text-xs text-[var(--text-muted)] text-center max-w-[200px]">
          Support for MP4, WAV, MP3. <br /> Max file size 2GB.
        </p>

        <FileVideo className="absolute top-4 left-4 w-12 h-12 text-slate-100 dark:text-slate-800 -rotate-12 opacity-50 pointer-events-none" />
        <FileAudio className="absolute bottom-4 right-4 w-12 h-12 text-slate-100 dark:text-slate-800 rotate-12 opacity-50 pointer-events-none" />
      </div>
    </Card>
  );
}