import { useCallback, useState } from "react";
import { processFile, processText } from "../services/asr";
import { useUIStore } from "../store/uiStore";
import { toast } from "sonner";
import type { Job } from "../types/asr";

interface UploadOptions {
  name?: string;
  language?: string;
  translate?: boolean;
  file?: File;
  options?: string[];
  textContent?: string;
}

const getErrorMessage = (err: any) => {
  if (!err) return "Unknown Error";
  if (err.response && err.response.data) {
    const data = err.response.data;
    if (data instanceof Blob) return "Server returned a file or connection failed.";

    if (data.detail && Array.isArray(data.detail)) {
      return data.detail.map((e: any) => `${e.loc?.join('.')} - ${e.msg}`).join(', ');
    }
    return data.message || data.detail || JSON.stringify(data);
  }
  return err.message || "Server Error";
};

export function useUpload() {
  const addJob = useUIStore((s) => s.addJob);
  const mediaType = useUIStore((s) => s.activeMediaType);
  const stagedFiles = useUIStore((s) => s.stagedFiles);
  const removeStagedFile = useUIStore((s) => s.removeStagedFile);

  const [loading, setLoading] = useState(false);

  const startUpload = useCallback(
    async (opts?: UploadOptions) => {
      setLoading(true);

      const selectedEndpoints = opts?.options || [];

      if (selectedEndpoints.length === 0) {
        toast.error("Please select at least one enrichment feature.");
        setLoading(false);
        return;
      }

      try {
        let successCount = 0;

        for (const endpoint of selectedEndpoints) {
          let response;
          let jobStatus: Job["status"] = "Queued";
          let resultData = "";

          if (mediaType === 'text') {
            const rawText = opts?.textContent || opts?.name?.replace("Text Analysis: ", "") || "";
            const textPayload = {
              text: rawText
            };

            response = await processText(endpoint, textPayload);
            jobStatus = "Completed";
            resultData = JSON.stringify(response, null, 2);
          }

          else {
            const filesToUpload = opts?.file ? [opts.file] : stagedFiles;
            if (filesToUpload.length === 0) continue;

            const fileToProcess = filesToUpload[0];
            const fd = new FormData();

            // 1. KEY SELECTION
            let fileKey = "file";
            if (endpoint.includes("/image/")) {
              fileKey = "image";
            } else if (endpoint.includes("TTSOE")) {
              fileKey = "file";
            } else if (endpoint.includes("/video/") || endpoint.includes("/video_2/")) {
              fileKey = "video";
            }

            fd.append(fileKey, fileToProcess);

            const supportsMetadata =
              endpoint.includes("TTSOE") ||
              endpoint.includes("transcribe") ||
              endpoint.includes("LangDetect") ||
              endpoint.includes("Syntax");

            if (supportsMetadata) {
              let langToSend = opts?.language || "en-US";
              const langMap: Record<string, string> = {
                "en-US": "English", "en-GB": "English", "en-SG": "English",
                "zh-CN": "Chinese", "ta-IN": "Tamil", "ms-MY": "Malaysian"
              };
              if (langMap[langToSend]) langToSend = langMap[langToSend];

              fd.append("language", langToSend);
              fd.append("offset", "0");
              fd.append("use_whisper", "true");
              fd.append("split_into_chunks", "true");
              if (opts?.translate) fd.append("translate", "true");

              if (endpoint.includes("TTSOE")) {
                const taskName = opts?.translate ? "Translation" : "Transcription";
                fd.append("task", taskName);
                const indicator = mediaType === 'video' ? "Video" : "Audio";
                fd.append("indicator", indicator);
              }
            }

            const isBinary =
              endpoint.includes("/video_2/") ||
              endpoint.includes("extract_key_frames") ||
              endpoint.includes("OCR_on_video") ||
              endpoint.includes("insights");

            response = await processFile(endpoint, fd, isBinary);

            if (isBinary) {

              resultData = URL.createObjectURL(response);
              jobStatus = "Completed";
            } else {
              if (!response.session_id && Object.keys(response).length > 0) {
                jobStatus = "Completed";
                resultData = JSON.stringify(response, null, 2);
              } else {
                jobStatus = response.status || "Queued";
              }
            }
          }

          const featureName = endpoint.split('/').pop()?.replace(/[-_]/g, ' ') || "Analysis";

          const newJob: Job = {
            session_id: (typeof response === 'object' && response.session_id) ? response.session_id : `${mediaType}_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
            container_name: (typeof response === 'object') ? response.container_name : undefined,
            name: `${mediaType === 'text' ? 'Text Input' : (opts?.file?.name || stagedFiles[0]?.name)} (${featureName})`,
            filename: mediaType === 'text' ? "Raw Text" : (opts?.file?.name || stagedFiles[0]?.name),
            status: jobStatus,
            createdAt: new Date().toISOString(),
            language: (opts?.language || "en-US") as Job["language"],
            srtText: resultData
          };

          addJob(newJob);

          if (!resultData.startsWith("blob:")) {
            const currentHistory = JSON.parse(localStorage.getItem("my_asr_jobs") || "[]");
            const updatedHistory = [newJob, ...currentHistory].slice(0, 20);
            try {
              localStorage.setItem("my_asr_jobs", JSON.stringify(updatedHistory));
            } catch (e) {
              console.warn("Storage full");
            }
          }

          successCount++;
        }

        if (!opts?.file && mediaType !== 'text') {
          stagedFiles.forEach((_, i) => removeStagedFile(i));
        }

        if (successCount > 0) {
          toast.success(`Success! Result available.`);
        }

      } catch (err: unknown) {
        console.error("Upload Error:", err);
        const msg = getErrorMessage(err);
        toast.error(`Failed: ${msg}`);
      } finally {
        setLoading(false);
      }
    },
    [stagedFiles, addJob, removeStagedFile, mediaType]
  );

  return { startUpload, loading };
}