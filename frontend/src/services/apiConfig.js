const normalizeUrl = (value) => {
  if (typeof value !== "string") {
    return "";
  }
  return value.trim().replace(/\/+$/, "");
};

export const getApiBaseUrl = () => {
  const configuredBase = normalizeUrl(import.meta.env.VITE_API_BASE_URL);
  let baseUrl;

  if (!configuredBase) {
    if (typeof window !== "undefined" && window.location.hostname === "localhost") {
      baseUrl = "http://localhost:5000/api";
    } else {
      baseUrl = "/api";
    }
  } else if (configuredBase.startsWith("/")) {
    baseUrl = configuredBase;
  } else if (/^https?:\/\//i.test(configuredBase)) {
    baseUrl = configuredBase.endsWith("/api") ? configuredBase : `${configuredBase}/api`;
  } else if (/^:\d+(\/.*)?$/.test(configuredBase)) {
    baseUrl = `http://localhost${configuredBase}`;
    if (import.meta.env.DEV) {
      console.warn(
        `[EZStore] VITE_API_BASE_URL appears malformed: ${configuredBase}. ` +
          `Falling back to ${baseUrl}. Set VITE_API_BASE_URL to a full URL or a relative /api path.`
      );
    }
  } else {
    baseUrl = configuredBase;
  }

  if (import.meta.env.DEV) {
    console.info(
      "[EZStore] API base URL resolved:",
      baseUrl,
      "(configured:",
      configuredBase || "<auto>",
      ")"
    );
  }

  return baseUrl;
};

export const getBackendBaseUrl = () => {
  const configuredBase = normalizeUrl(import.meta.env.VITE_API_BASE_URL);
  if (!configuredBase) {
    if (typeof window !== "undefined" && window.location.hostname === "localhost") {
      return "http://localhost:5000";
    }
    return "";
  }
  // If an absolute URL was provided, return its origin (strip any /api suffix)
  if (/^https?:\/\//i.test(configuredBase)) {
    try {
      const url = new URL(configuredBase);
      return `${url.protocol}//${url.host}`;
    } catch {
      return configuredBase;
    }
  }

  // If a relative path like "/api" is configured (dev with Vite proxy),
  // connect to the current origin so the dev proxy routes socket/ws requests.
  if (configuredBase.startsWith("/")) {
    try {
      return typeof window !== "undefined" ? window.location.origin : "";
    } catch {
      return "";
    }
  }

  return configuredBase;
};
