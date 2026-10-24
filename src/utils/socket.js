import { io } from "socket.io-client";

let socket = null;

const SOCKET_SERVER_URL =
  import.meta.env.VITE_SOCKET_URL || "http://localhost:5000";

export function getSocket() {
  if (!socket) {
    socket = io(SOCKET_SERVER_URL, {
      withCredentials: true,
      transports: ["websocket", "polling"],
      autoConnect: true,
      reconnection: true,
      reconnectionAttempts: 10,
      reconnectionDelay: 2000,
    });

    socket.on("connect", () => {
      console.log("[Socket.IO] Connected to backend gateway. Socket ID:", socket.id);
    });

    socket.on("connect_error", (err) => {
      console.warn("[Socket.IO] Gateway connection error:", err.message);
    });

    socket.on("disconnect", (reason) => {
      console.log("[Socket.IO] Disconnected from gateway. Reason:", reason);
    });
  }

  return socket;
}

export function disconnectSocket() {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
}
