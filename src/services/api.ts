import axios from "axios";
import { toast } from "sonner";

const api = axios.create({
  // FIX: Leave this empty so requests go to "localhost:5173/api/..."
  // This triggers the proxy in vite.config.ts to handle CORS for us.
  baseURL: "", 
  
  // Increase timeout because AI processing (OCR/Transcription) takes time
  timeout: 0, 
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    // 1. Handle Network Errors (Proxy failed or Server down)
    if (!error.response) {
      console.error("Network/CORS Error:", error);
      toast.error("Network Error: Backend is unreachable or CORS blocked.");
      return Promise.reject(error);
    }

    // 2. Handle HTTP Errors (4xx, 5xx)
    const status = error.response.status;
    const msg = error.response.data?.message || error.response.data?.detail || "An error occurred";

    if (status === 422) {
      // Common for Swagger: Validation Error (Wrong parameter names)
      toast.error(`Validation Error: ${msg}`);
    } else if (status >= 500) {
      toast.error(`Server Error: ${msg}`);
    } else {
      toast.error(`Error (${status}): ${msg}`);
    }

    return Promise.reject(error);
  }
);

export default api;