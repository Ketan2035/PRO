import { io } from "socket.io-client";

// Singleton socket instance for the app
export const socket = io("http://localhost:3000", {
  // We'll set the userId query when connecting
  autoConnect: false,
  transports: ["websocket"]
});
