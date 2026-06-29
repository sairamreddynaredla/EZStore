import axios from "axios";

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
  baseURL: import.meta.env.VITE_ADMIN_API_BASE_URL || "/api/admin",
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

adminApi.interceptors.request.use((config) => {
  try {
    const token = window.localStorage.getItem("ezstore_admin_token");

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
        window.localStorage.removeItem("ezstore_admin_token");
        window.localStorage.removeItem("ezstore_admin_user");
      } catch {
        // ignore localStorage failures
      }
      try {
        window.dispatchEvent(new Event("ezstoreAdminLogout"));
      } catch {
        // ignore event dispatch failures
      }
    }
    return Promise.reject(error);
  }
);

export default adminApi;
