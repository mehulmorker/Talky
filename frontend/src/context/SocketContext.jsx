import { createContext, useContext, useEffect, useRef } from "react";
import { io } from "socket.io-client";
import { useAuth } from "./AuthContext";

const SocketContext = createContext();

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error("useSocket must be used within a SocketProvider");
  }
  return context;
};

export const SocketProvider = ({ children }) => {
  const { token, user } = useAuth();
  const socketRef = useRef(null);
  const messageCallbackRef = useRef(null);

  useEffect(() => {
    if (!token || !user) {
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
      }
      return;
    }

    socketRef.current = io("http://localhost:5001", {
      auth: {
        token,
      },
    });

    socketRef.current.on("connect", () => {
      console.log("Connected to Socket.IO server");
    });

    socketRef.current.on("disconnect", () => {
      console.log("Disconnected from Socket.IO server");
    });

    socketRef.current.on("connect_error", (error) => {
      console.error("Socket.IO connection error:", error);
    });

    socketRef.current.on("receive_message", (message) => {
      console.log("📨 Socket.IO received message:", message);
      if (messageCallbackRef.current) {
        console.log("📞 Calling message callback");
        messageCallbackRef.current(message);
      } else {
        console.log("❌ No message callback set");
      }
    });

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
      }
    };
  }, [token, user]);

  const joinConversation = (conversationId) => {
    if (socketRef.current) {
      socketRef.current.emit("join_conversation", conversationId);
    }
  };

  const leaveConversation = (conversationId) => {
    if (socketRef.current) {
      socketRef.current.emit("leave_conversation", conversationId);
    }
  };

  const onReceiveMessage = (callback) => {
    messageCallbackRef.current = callback;
  };

  const value = {
    socket: socketRef.current,
    onReceiveMessage,
    joinConversation,
    leaveConversation,
  };

  return (
    <SocketContext.Provider value={value}>{children}</SocketContext.Provider>
  );
};
