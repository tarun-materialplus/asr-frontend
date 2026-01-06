export type JobStatus = "Queued" | "Running" | "Completed" | "Error" | "Paused" | "Aborted" | "Processing";

export interface Job {
  session_id: string;
  container_name?: string;
  status: JobStatus;

  name: string;
  filename: string;
  createdAt: string;
  progress?: number;


  language?: "en-US" | "ms-MY" | "en-GB" | "en-SG" | "ta-IN" | "zh-CN";
  message?: string;
  folder_name?: string;
  srtText?: string;
  duration?: string;
}