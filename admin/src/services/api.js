import axios from "axios";

const getAdminApiBaseUrl = () => {
  try {
    const env = import.meta?.env;
    return env?.VITE_ADMIN_API_BASE_URL || "/api/admin";
  } catch {
    return "/api/admin";
  }
};

const unwrapApiResponse = (response) => {
  const payload = response?.data;

  if (payload && typeof payload === "object" && Object.prototype.hasOwnProperty.call(payload, "success") && Object.prototype.hasOwnProperty.call(payload, "data")) {
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

const adminApi = axios.create({
  baseURL: getAdminApiBaseUrl(),
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

adminApi.interceptors.request.use((config) => {
  try {
    const token = typeof window !== "undefined" ? window.localStorage.getItem("ezstore_admin_token") : null;

    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  } catch {
    // Ignore localStorage failures in SSR or restricted contexts
  }

  return config;
});

adminApi.interceptors.response.use(
  (response) => unwrapApiResponse(response),
  (error) => {
    if (error.response?.status === 401 || error.response?.status === 403) {
      try {
        if (typeof window !== "undefined") {
          window.localStorage.removeItem("ezstore_admin_token");
          window.localStorage.removeItem("ezstore_admin_user");
          window.dispatchEvent(new Event("ezstoreAdminLogout"));
        }
      } catch {
        // ignore localStorage failures
      }
    }
    return Promise.reject(error);
  }
);

export default adminApi;
