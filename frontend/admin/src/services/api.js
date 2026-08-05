import axios from "axios";

const getAdminApiBaseUrl = () => {
  try {
    const env = import.meta?.env;
    const configuredBaseUrl = env?.VITE_ADMIN_API_BASE_URL || env?.VITE_API_BASE_URL;

    if (configuredBaseUrl) {
      return configuredBaseUrl.replace(/\/$/, "");
    }

    if (typeof window !== "undefined") {
      const hostname = window.location.hostname;
      if (hostname.includes("vercel.app")) {
        return "https://ezstore-backend.onrender.com/api/admin";
      }
    }

    return "/api/admin";
  } catch {
    return "/api/admin";
  }
};

export const resolveAdminAssetUrl = (assetUrl) => {
  if (!assetUrl || /^(?:https?:|data:|blob:)/i.test(assetUrl)) {
    return assetUrl;
  }

  const apiBaseUrl = getAdminApiBaseUrl();
  // When the API base is a relative path (e.g. "/api/admin") the admin
  // app may be running on a different dev origin (vite dev server). In
  // that case prefix relative asset paths with the current origin so
  // they resolve correctly (and benefit from dev-server proxies).
  if (apiBaseUrl.startsWith("/")) {
    try {
      if (typeof window !== "undefined" && window.location && window.location.origin) {
        const origin = String(window.location.origin).replace(/\/$/, "");
        return assetUrl.startsWith("/") ? `${origin}${assetUrl}` : `${origin}/${assetUrl}`;
      }
    } catch {
      // fall through to returning the raw assetUrl
    }
    return assetUrl;
  }

  try {
    return new URL(assetUrl, apiBaseUrl).toString();
  } catch {
    return assetUrl;
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
  withCredentials: true,
});

adminApi.interceptors.request.use((config) => {
  try {
    const token = typeof window !== "undefined" ? window.localStorage.getItem("ezstore_admin_token") : null;
    if (token) {
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${token}`;
    }
  } catch {
    // Ignore localStorage failures in SSR or restricted contexts
  }

  if (config.data instanceof FormData) {
    config.headers = config.headers || {};
    delete config.headers["Content-Type"];
  } else if (config.data) {
    config.headers = config.headers || {};
    config.headers["Content-Type"] = "application/json";
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
