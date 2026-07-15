import { io } from "socket.io-client";

let socket = null;

const SOCKET_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

/**
 * Initialize socket connection
 */
export const initSocket = () => {
  if (socket?.connected) {
    return socket;
  }

  socket = io(SOCKET_URL, {
    reconnection: true,
    reconnectionDelay: 1000,
    reconnectionDelayMax: 5000,
    reconnectionAttempts: 5,
  });

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
 * Subscribe to real-time recommended products
 * @param {string} productId - Product ID
 * @param {function} callback - Callback function when recommendations update
 */
export const subscribeToRecommendations = (productId, callback) => {
  const socketInstance = getSocket();
  
  const eventName = `product:recommendations:${productId}`;
  socketInstance.on(eventName, (data) => {
    callback(data);
  });

  return () => {
    socketInstance.off(eventName, callback);
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
