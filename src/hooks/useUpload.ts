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

          // --- BRANCH 1: TEXT ANALYSIS ---
          if (mediaType === 'text') {
            // FIX: Use the full textContent, fallback to extracting from name only if missing
            const rawText = opts?.textContent || opts?.name?.replace("Text Analysis: ", "") || "";
            
            // Matches cURL payload exactly
            const textPayload = {
              text: rawText 
            };
            
            response = await processText(endpoint, textPayload);
            jobStatus = "Completed";
            resultData = JSON.stringify(response, null, 2);
          } 
          
          // --- BRANCH 2: FILE UPLOAD ---
          else {
            const filesToUpload = opts?.file ? [opts.file] : stagedFiles;
            if (filesToUpload.length === 0) continue; 

            const fileToProcess = filesToUpload[0]; 
            const fd = new FormData();

            if (endpoint.includes("/image/")) {
                 fd.append("image", fileToProcess); 
            } else {
                 fd.append("files", fileToProcess); 
                 
                 let langToSend = opts?.language || "en-US";
                 if (endpoint.includes("/video/") || endpoint.includes("TTSOE")) {
                    const langMap: Record<string, string> = {
                        "en-US": "English", "en-GB": "English", "en-SG": "English",
                        "zh-CN": "Chinese", "ta-IN": "Tamil", "ms-MY": "Malaysian"
                    };
                    if (langMap[langToSend]) langToSend = langMap[langToSend];
                 }
                 
                 fd.append("language", langToSend);
                 fd.append("offset", "0");
                 fd.append("use_whisper", "true");
                 fd.append("split_into_chunks", "true");
                 if (opts?.translate) fd.append("translate", "true");
            }
            
            response = await processFile(endpoint, fd);
            
            if (!response.session_id && Object.keys(response).length > 0) {
                jobStatus = "Completed";
                resultData = JSON.stringify(response, null, 2);
            } else {
                jobStatus = response.status || "Queued";
            }
          }

          const featureName = endpoint.split('/').pop()?.replace(/[-_]/g, ' ') || "Analysis";

          const newJob: Job = {
            session_id: response?.session_id || `${mediaType}_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
            container_name: response?.container_name,
            name: `${mediaType === 'text' ? 'Text Input' : (opts?.file?.name || stagedFiles[0]?.name)} (${featureName})`,
            filename: mediaType === 'text' ? "Raw Text" : (opts?.file?.name || stagedFiles[0]?.name),
            status: jobStatus, 
            createdAt: new Date().toISOString(),
            language: (opts?.language || "en-US") as Job["language"],
            srtText: resultData 
          };

          addJob(newJob);
          
          const currentHistory = JSON.parse(localStorage.getItem("my_asr_jobs") || "[]");
          localStorage.setItem("my_asr_jobs", JSON.stringify([newJob, ...currentHistory]));
          
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