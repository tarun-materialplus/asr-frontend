import { useCallback, useState } from "react";
import { uploadFiles } from "../services/asr";
import { useUIStore } from "../store/uiStore";
import { toast } from "sonner";
import type { Job } from "../types/asr";

interface ApiError {
  response?: {
    data?: {
      message?: string;
    };
  };
}

export function useUpload() {
  const addJob = useUIStore((s) => s.addJob);
  const stagedFiles = useUIStore((s) => s.stagedFiles);
  const removeStagedFile = useUIStore((s) => s.removeStagedFile);

  const [loading, setLoading] = useState(false);

  const startUpload = useCallback(
    async (opts?: { 
      name?: string; 
      description?: string;
      language?: string;
      translate?: boolean;
    }) => {
      setLoading(true);

      try {
        const fd = new FormData();
        
        // Add all staged files
        stagedFiles.forEach((file) => fd.append("files", file));
        
        // Add optional parameters
        if (opts?.name) fd.append("name", opts.name);
        if (opts?.description) fd.append("description", opts.description);
        
        // Add configuration parameters matching API spec
        fd.append("language", opts?.language || "en-US");
        fd.append("offset", "0");
        fd.append("use_whisper", "true");
        fd.append("split_into_chunks", "true");
        fd.append("translate", String(opts?.translate || false));

        // Make API call
        const response = await uploadFiles(fd);

        // Create new job with API response data
        const newJob: Job = {
          session_id: response.session_id,
          container_name: response.container_name,
          name: opts?.name || stagedFiles[0]?.name,
          filename: stagedFiles[0]?.name,
          // Use status from API response, fallback to Queued
          status: response.status || "Queued",
          createdAt: new Date().toISOString(),
          language: (opts?.language || "en-US") as Job["language"],
        };

        // Add to UI store
        addJob(newJob);

        // Persist to localStorage
        const currentHistory = JSON.parse(localStorage.getItem("my_asr_jobs") || "[]");
        localStorage.setItem("my_asr_jobs", JSON.stringify([newJob, ...currentHistory]));

        // Clear staged files
        for (let i = stagedFiles.length - 1; i >= 0; i--) {
          removeStagedFile(i);
        }
        
        toast.success("Upload successful! Processing started.");

      } catch (err: unknown) {
        console.error(err);
        
        let msg = "Upload failed";
        
        // Extract error message from API response
        if (err && typeof err === 'object' && 'response' in err) {
          const apiErr = err as ApiError;
          msg += ": " + (apiErr.response?.data?.message || "Server Error");
        } else if (err instanceof Error) {
          msg += ": " + err.message;
        }
        
        toast.error(msg);
      } finally {
        setLoading(false);
      }
    },
    [stagedFiles, addJob, removeStagedFile]
  );

  return { startUpload, loading };
}