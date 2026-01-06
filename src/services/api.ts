import axios from "axios";
import { toast } from "sonner";

const api = axios.create({
  baseURL: "",

  timeout: 0,
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (!error.response) {
      console.error("Network/CORS Error:", error);
      toast.error("Network Error: Backend is unreachable or CORS blocked.");
      return Promise.reject(error);
    }

    const status = error.response.status;
    const msg = error.response.data?.message || error.response.data?.detail || "An error occurred";

    if (status === 422) {
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