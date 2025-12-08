/* src/services/asr.ts - DEMO / VISUAL TESTING MODE */
import api from "./api";
import type { Job } from "../types/asr";
import { toast } from "sonner";

// --- 1. RICH MOCK DATA ---
const MOCK_JOBS: Job[] = [
  {
    session_id: "mock_1",
    name: "Q3 Financial Review.mp4",
    filename: "Q3_Financial_Review.mp4",
    status: "Completed",
    createdAt: new Date(Date.now() - 1000 * 60 * 45).toISOString(), // 45 mins ago
    progress: 100,
    language: "en-US",
    duration: "45:20",
    container_name: "mock_container",
    folder_name: "mock_folder",
    srtText: "1\n00:00:01,000 --> 00:00:04,000\nWelcome to the Q3 financial review.\n\n2\n00:00:04,500 --> 00:00:08,000\nOur revenue has increased by 20%."
  },
  {
    session_id: "mock_2",
    name: "Interview_John_Doe_v2.wav",
    filename: "Interview_John_Doe_v2.wav",
    status: "Processing",
    createdAt: new Date().toISOString(), // Just now
    progress: 45,
    language: "en-GB",
    message: "Transcribing audio...",
    container_name: "mock_container"
  },
  {
    session_id: "mock_3",
    name: "Corrupted_File_Test.mkv",
    filename: "Corrupted_File_Test.mkv",
    status: "Error",
    createdAt: new Date(Date.now() - 1000 * 60 * 120).toISOString(), // 2 hours ago
    progress: 0,
    language: "en-US",
    message: "Unsupported file format or codec."
  },
  {
    session_id: "mock_4",
    name: "Marketing_Brainstorm_Session.m4a",
    filename: "Marketing_Brainstorm_Session.m4a",
    status: "Queued",
    createdAt: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
    progress: 0,
    language: "ms-MY",
  }
];

// --- 2. UPLOAD (With Simulation Fallback) ---
export const uploadFiles = async (fd: FormData) => {
  try {
    // Try Real Backend first
    const res = await api.post("/process", fd, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return res.data;
  } catch (err) {
    // Fallback to Simulation if Backend is offline
    console.log("Backend unavailable. Simulating upload.",err);
    toast.warning("Backend offline. Simulating upload for UI testing.");
    
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          session_id: `sim_${Date.now()}`,
          container_name: "sim_container",
          status: "Queued",
          message: "Simulation started",
          container: "test"
        });
      }, 1500);
    });
  }
};

// --- 3. GET STATUS (Handles Mock & Real IDs) ---
export const getStatus = async (sessionId: string) => {
  // If it is a Mock or Sim job, fake the response
  if (sessionId.startsWith("mock_") || sessionId.startsWith("sim_")) {
    return simulateStatus(sessionId);
  }

  // Else, try Real Backend
  try {
    const res = await api.get(`/get_status/${sessionId}`);
    return res.data;
  } catch (err) {
    console.log("Error fetching real job status:", err);
    // Return dummy status so UI doesn't crash
    return { status: "Error", message: "Connection lost" };
  }
};

// Helper to animate the mock jobs
const simulateStatus = (id: string) => {
  // Find the mock job to see its current state
  const mockJob = MOCK_JOBS.find(j => j.session_id === id);
  
  // If it's the "Processing" mock job, increment progress randomly
  if (id === "mock_2" || id.startsWith("sim_")) {
    return {
      status: "Processing",
      message: "Transcribing...",
      progress: Math.floor(Math.random() * 100), // Random jitter
      folder_name: "mock_folder"
    };
  }
  
  // Otherwise return static status (Completed/Error)
  return {
    status: mockJob?.status || "Completed",
    message: mockJob?.message || "Done",
    progress: mockJob?.progress || 100,
    folder_name: "mock_folder"
  };
};

// --- 4. CONTROLS ---
export const pauseSession = (id: string) => api.post(`/pause/${id}`);
export const resumeSession = (id: string) => api.post(`/resume/${id}`);
export const abortSession = (id: string) => api.post(`/abort/${id}`);

// --- 5. DOWNLOAD ---
export const downloadSrts = (container_name: string, folder: string) =>
  api.post("/download-srts", { container_name, folder }, { responseType: "blob" });

// --- 6. LOCAL JOBS (Seeds the UI with Mock Data) ---
export const getLocalJobs = (): Job[] => {
  try {
    // 1. Get any real jobs you uploaded
    const stored = JSON.parse(localStorage.getItem("my_asr_jobs") || "[]");
    
    // 2. Merge with Mock Data so the UI is never empty
    // We filter out duplicates just in case
    const storedIds = new Set(stored.map((j: Job) => j.session_id));
    const freshMocks = MOCK_JOBS.filter(m => !storedIds.has(m.session_id));
    
    return [...stored, ...freshMocks];
  } catch {
    return MOCK_JOBS;
  }
};