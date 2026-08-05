import axios from "axios";
import { getApiBaseUrl } from "./apiConfig";

const api = axios.create({
  baseURL: getApiBaseUrl(),
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.response.use(
  (response) => {
    const payload = response?.data;
    if (
      payload &&
      typeof payload === "object" &&
      Object.prototype.hasOwnProperty.call(payload, "success") &&
      Object.prototype.hasOwnProperty.call(payload, "data")
    ) {
      return {
        ...response,
        data: payload.data,
        meta: payload.meta ?? {},
        message: payload.message,
        success: payload.success,
      };
    }
    return response;
  },
  (error) => Promise.reject(error)
);

export default api;
