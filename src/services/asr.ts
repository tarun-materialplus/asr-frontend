import api from "./api";
import type { Job } from "../types/asr";
import { toast } from "sonner";
export const processFile = async (endpoint: string, fd: FormData, isBinary: boolean = false) => {
  const res = await api.post(`/api${endpoint}`, fd, {
    headers: { "Content-Type": "multipart/form-data" },
    responseType: isBinary ? "blob" : "json"

  });
  return res.data;
};

export const processText = async (endpoint: string, payload: any) => {
  const res = await api.post(`/api${endpoint}`, payload, {
    headers: { "Content-Type": "application/json" },

  });
  return res.data;
};

const MOCK_JOBS: Job[] = [
  {
    session_id: "mock_1",
    name: "Q3 Financial Review.mp4",
    filename: "Q3_Financial_Review.mp4",
    status: "Completed",
    createdAt: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
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
    createdAt: new Date().toISOString(),
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
    createdAt: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
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

export const uploadFiles = async (fd: FormData) => {
  try {
    const res = await api.post("/process", fd, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return res.data;
  } catch (err) {
    console.log("Backend unavailable. Simulating upload.", err);
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

export const getStatus = async (sessionId: string) => {
  if (sessionId.startsWith("mock_") || sessionId.startsWith("sim_")) {
    return simulateStatus(sessionId);
  }

  try {
    const res = await api.get(`/api/get_status/${sessionId}`);
    return res.data;
  } catch (err) {
    console.log("Error fetching real job status:", err);
    return { status: "Error", message: "Connection lost" };
  }
};

const simulateStatus = (id: string) => {
  const mockJob = MOCK_JOBS.find(j => j.session_id === id);

  if (id === "mock_2" || id.startsWith("sim_")) {
    return {
      status: "Processing",
      message: "Transcribing...",
      progress: Math.floor(Math.random() * 100),
      folder_name: "mock_folder"
    };
  }

  return {
    status: mockJob?.status || "Completed",
    message: mockJob?.message || "Done",
    progress: mockJob?.progress || 100,
    folder_name: "mock_folder"
  };
};

export const pauseSession = (id: string) => api.post(`/pause/${id}`);
export const resumeSession = (id: string) => api.post(`/resume/${id}`);
export const abortSession = (id: string) => api.post(`/abort/${id}`);

export const downloadSrts = (container_name: string, folder: string) =>
  api.post("/download-srts", { container_name, folder }, { responseType: "blob" });

export const getLocalJobs = (): Job[] => {
  try {
    const stored = JSON.parse(localStorage.getItem("my_asr_jobs") || "[]");

    const storedIds = new Set(stored.map((j: Job) => j.session_id));
    const freshMocks = MOCK_JOBS.filter(m => !storedIds.has(m.session_id));

    return [...stored, ...freshMocks];
  } catch {
    return MOCK_JOBS;
  }
};