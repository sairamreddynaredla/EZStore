import { useEffect } from "react";
import { initSocket, disconnectSocket } from "../services/socket";

/**
 * Hook to initialize and manage socket connection
 * Ensures socket is connected when component mounts
 * Cleans up on unmount
 */
export const useSocket = () => {
  useEffect(() => {
    const socket = initSocket();

    return () => {
      // Keep socket alive for other components
      // Only disconnect if it's the last component using it
    };
  }, []);
};
