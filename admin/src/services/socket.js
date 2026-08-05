let socket = null;
let initializing = null;

export const initSocket = async (opts = {}) => {
  if (typeof window === "undefined") return null;
  if (socket) return socket;
  if (initializing) return initializing;

  initializing = (async () => {
    try {
      // build package name at runtime to avoid Vite static import analysis
      const pkgName = "socket" + ".io-client";
      const mod = await import(pkgName);
      const { io } = mod;
      socket = io({ path: "/socket.io", transports: ["websocket"] });
      socket.on("connect_error", (err) => {
        // eslint-disable-next-line no-console
        console.debug("socket connect error", err && err.message);
      });
      return socket;
    } catch (e) {
      // socket.io-client not installed or failed to load — feature degrades gracefully
      // eslint-disable-next-line no-console
      console.debug("socket.io-client unavailable — realtime disabled");
      initializing = null;
      return null;
    }
  })();

  return initializing;
};

export const subscribeToProductUpdates = (handler) => {
  let unsubbed = false;
  initSocket().then((s) => {
    if (!s || unsubbed) return;
    s.on("product:update", handler);
  }).catch(() => {});

  return () => {
    unsubbed = true;
    if (socket) {
      try { socket.off("product:update", handler); } catch (e) { /* ignore */ }
    }
  };
};

export default initSocket;
