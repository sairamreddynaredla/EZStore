import { io } from "socket.io-client";
import { getBackendBaseUrl } from "./apiConfig";

let socket = null;

const SOCKET_PATH = import.meta.env.VITE_SOCKET_PATH || "/socket.io";
const SOCKET_URL = getBackendBaseUrl();

/**
 * Initialize socket connection
 */
export const initSocket = () => {
  if (socket?.connected) {
    return socket;
  }

  const opts = {
    path: SOCKET_PATH,
    reconnection: true,
    reconnectionDelay: 1000,
    reconnectionDelayMax: 5000,
    reconnectionAttempts: 5,
  };

  // If a backend origin is known (production absolute URL), connect directly.
  // Otherwise let the client connect to the current origin so the Vite dev
  // server proxy forwards the socket connection to the backend.
  socket = SOCKET_URL ? io(SOCKET_URL, opts) : io(opts);

  socket.on("connect", () => {
    console.log("Socket connected:", socket.id);
  });

  socket.on("disconnect", () => {
    console.log("Socket disconnected");
  });

  socket.on("connect_error", (error) => {
    console.error("Socket connection error:", error);
  });

  return socket;
};

/**
 * Get socket instance
 */
export const getSocket = () => {
  if (!socket) {
    return initSocket();
  }
  return socket;
};

/**
 * Subscribe to real-time product price updates
 * @param {string} productId - Product ID
 * @param {function} callback - Callback function when price updates
 */
export const subscribeToPriceUpdates = (productId, callback) => {
  const socketInstance = getSocket();
  
  // Subscribe to specific product channel
  const eventName = `product:priceUpdate:${productId}`;
  socketInstance.on(eventName, (data) => {
    callback(data);
  });

  // Return unsubscribe function
  return () => {
    socketInstance.off(eventName, callback);
  };
};

/**
 * Join a customer-specific socket room for real-time order updates
 * @param {number|string} customerId - Customer ID
 */
export const joinCustomerRoom = (customerId) => {
  if (!customerId) return;
  const socketInstance = getSocket();
  socketInstance.emit("joinCustomerRoom", customerId);
};

/**
 * Subscribe to customer order events
 * @param {function} callback - Callback for order events
 */
export const subscribeToCustomerOrderEvents = (callback) => {
  const socketInstance = getSocket();
  const orderCreated = (data) => callback({ type: "orderCreated", ...data });
  const orderUpdated = (data) => callback({ type: "orderUpdated", ...data });

  socketInstance.on("orderCreated", orderCreated);
  socketInstance.on("orderUpdated", orderUpdated);

  return () => {
    socketInstance.off("orderCreated", orderCreated);
    socketInstance.off("orderUpdated", orderUpdated);
  };
};

/**
 * Disconnect socket
 */
export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};
