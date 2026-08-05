import { Server } from "socket.io";

let io;

export const initSocket = (server, corsOptions = {}) => {
  if (io) return io;

  io = new Server(server, {
    cors: {
      origin: corsOptions.origin || ["http://localhost:5173"],
      methods: ["GET", "POST"],
      credentials: true,
    },
  });

  io.on("connection", (socket) => {
    socket.on("joinAdminRoom", () => {
      socket.join("admins");
    });

    socket.on("joinCustomerRoom", (customerId) => {
      if (customerId) {
        socket.join(`customer_${customerId}`);
      }
    });

    socket.on("joinOrderRoom", (orderId) => {
      if (orderId) {
        socket.join(`order_${orderId}`);
      }
    });
  });

  return io;
};

export const getSocket = () => {
  if (!io) {
    throw new Error("Socket.IO not initialized");
  }
  return io;
};
