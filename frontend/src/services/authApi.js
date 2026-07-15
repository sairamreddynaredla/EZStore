import axios from "axios";

const unwrapApiResponse = (response) => {
  const payload = response?.data;

  if (
    payload &&
    typeof payload === "object" &&
    Object.prototype.hasOwnProperty.call(payload, "success") &&
    Object.prototype.hasOwnProperty.call(payload, "data")
  ) {
    return {
      ...response,
      data: payload.data ?? null,
      meta: payload.meta ?? {},
      message: payload.message,
      success: payload.success,
    };
  }

  return response;
};

const authApi = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api",
  headers: {
    "Content-Type": "application/json",
  },
});

authApi.interceptors.request.use((config) => {
  try {
    const token = window.localStorage.getItem("ezstore_token");
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  } catch {
    // Ignore localStorage failures in SSR or restricted contexts
  }

  return config;
});

authApi.interceptors.response.use(
  (response) => unwrapApiResponse(response),
  (error) => Promise.reject(error)
);

export default authApi;
