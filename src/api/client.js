import axios from "axios";

const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true, // Send secure HTTP-only cookies across requests
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000,
});

// Response interceptor to format error messages cleanly
apiClient.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const errorData = error.response?.data || {};
    const message =
      errorData.message ||
      (error.response?.status === 503
        ? "Platform database is connecting or unavailable. Check server config."
        : error.message || "Network request failed.");

    const formattedError = new Error(message);
    formattedError.status = error.response?.status;
    formattedError.code = errorData.code;
    formattedError.data = errorData;
    return Promise.reject(formattedError);
  }
);
