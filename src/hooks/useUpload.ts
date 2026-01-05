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
}

interface ApiError {
  response?: {
    data?: {
      message?: string;
      detail?: string;
    };
  };
}

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

          // --- BRANCH 1: TEXT ANALYSIS (Instant Result) ---
          if (mediaType === 'text') {
            const rawText = opts?.name?.replace("Text Analysis: ", "") || "";
            
            const textPayload = {
              text: rawText, 
              language: opts?.language || "en-US"
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

            if (endpoint.includes("/image/object_detection-GPT")) {
                fd.append("image", fileToProcess);
                
                response = await processFile(endpoint, fd);
                
                jobStatus = "Completed";
                resultData = JSON.stringify(response, null, 2);
            } 
            // --- STANDARD HANDLING (Video/Audio) ---
            else {
                // Default logic for /audio endpoints
                filesToUpload.forEach((file) => fd.append("files", file)); 
                if (opts?.language) fd.append("language", opts.language);
                
                response = await processFile(endpoint, fd);
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
        console.error(err);
        
        let msg = "Processing failed";
        if (err && typeof err === 'object' && 'response' in err) {
          const apiErr = err as ApiError;
          msg += ": " + (apiErr.response?.data?.message || apiErr.response?.data?.detail || "Server Error");
        } else if (err instanceof Error) {
          msg += ": " + err.message;
        }
        
        toast.error(msg);
      } finally {
        setLoading(false);
      }
    },
    [stagedFiles, addJob, removeStagedFile, mediaType]
  );

  return { startUpload, loading };
}