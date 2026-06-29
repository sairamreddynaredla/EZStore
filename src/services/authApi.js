import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "/api";

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
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

const refreshClient = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

let authFailureHandler = null;
const setAuthFailureHandler = (handler) => {
  authFailureHandler = typeof handler === "function" ? handler : null;
};

const notifyAuthFailure = () => {
  if (typeof authFailureHandler === "function") {
    authFailureHandler();
  }
};

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
  async (error) => {
    const originalRequest = error.config;
    if (
      originalRequest &&
      !originalRequest._retry &&
      error.response?.status === 401 &&
      !originalRequest.url?.includes("/auth/login") &&
      !originalRequest.url?.includes("/auth/register") &&
      !originalRequest.url?.includes("/auth/refresh-token")
    ) {
      originalRequest._retry = true;

      try {
        const refreshResponse = await refreshClient.get("/auth/refresh-token");
        const refreshData = refreshResponse.data?.data ?? refreshResponse.data;
        const newToken = refreshData?.token;

        if (newToken) {
          try {
            window.localStorage.setItem("ezstore_token", newToken);
          } catch {
            // ignore localStorage failures
          }

          if (originalRequest.headers) {
            originalRequest.headers.Authorization = `Bearer ${newToken}`;
          }

          return authApi(originalRequest);
        }
      } catch (_refreshError) {
        notifyAuthFailure();
        // ignore refresh failure and fall through to original rejection
      }
    }

    return Promise.reject(error);
  }
);

export { setAuthFailureHandler };
export default authApi;
