const formatMeta = (meta) => {
  if (!meta) return undefined;
  if (typeof meta === "string") return meta;
  try {
    return JSON.stringify(meta);
  } catch {
    return meta;
  }
};

const logger = {
  info: (event, meta = {}) => {
    // eslint-disable-next-line no-console
    console.info(
      JSON.stringify({
        level: "info",
        event,
        timestamp: new Date().toISOString(),
        meta: formatMeta(meta),
      })
    );
  },

  warn: (event, meta = {}) => {
    // eslint-disable-next-line no-console
    console.warn(
      JSON.stringify({
        level: "warn",
        event,
        timestamp: new Date().toISOString(),
        meta: formatMeta(meta),
      })
    );
  },

  error: (event, meta = {}) => {
    // eslint-disable-next-line no-console
    console.error(
      JSON.stringify({
        level: "error",
        event,
        timestamp: new Date().toISOString(),
        meta: formatMeta(meta),
      })
    );
  },
};

export default logger;
