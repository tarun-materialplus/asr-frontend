import { create } from "zustand";
import type { Job } from "../types/asr";

type UIState = {
  stagedFiles: File[];
  jobs: Job[];
  selectedJobId?: string | null;

  addStagedFiles: (files: File[]) => void;
  removeStagedFile: (index: number) => void;
  addJob: (job: Job) => void;

  setJobs: (updater: Job[] | ((prev: Job[]) => Job[])) => void;

  setSelectedJobId: (id?: string | null) => void;
};

export const useUIStore = create<UIState>((set) => ({
  stagedFiles: [],
  jobs: [],
  selectedJobId: null,

  addStagedFiles: (files) =>
    set((s) => ({ stagedFiles: [...s.stagedFiles, ...files] })),

  removeStagedFile: (index) =>
    set((s) => ({
      stagedFiles: s.stagedFiles.filter((_, i) => i !== index),
    })),

  addJob: (job) => set((s) => ({ jobs: [job, ...s.jobs] })),

  setJobs: (updater) =>
    set((state) => ({
      jobs:
        typeof updater === "function"
          ? updater(state.jobs)
          : updater,
    })),

  setSelectedJobId: (id) => set({ selectedJobId: id }),
}));
