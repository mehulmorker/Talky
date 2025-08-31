import React, { useEffect, useState } from "react";
import { WelcomeChatScreen } from "./WelcomeChatScreen";
import { ChatHeader } from "./ChatHeader";
import { MessageArea } from "./MessageArea";
import { MessageInput } from "./MessageInput";
import { useSocket } from "../context/SocketContext";

export const MainChatArea = ({
  selectedChat,
  token,
  user,
  messages,
  setMessages,
}) => {
  const {
    joinConversation,
    leaveConversation,
    startTyping,
    stopTyping,
    onUserTyping,
    onUserStopTyping,
  } = useSocket();
  const [loading, setLoading] = useState(false);
  const [typingUsers, setTypingUsers] = useState([]);

  useEffect(() => {
    if (selectedChat) {
      joinConversation(selectedChat._id);
      return () => {
        leaveConversation(selectedChat._id);
      };
    }
  }, [selectedChat]);
  const fetchMessages = async () => {
    try {
      if (!selectedChat) return;
      setLoading(true);
      const res = await fetch(
        `http://localhost:5001/api/chat/messages/${selectedChat._id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const data = await res.json();
      setMessages(data.messages || []);
      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, [selectedChat, token]);

  useEffect(() => {
    const handleUserTyping = (data) => {
      if (
        data.conversationId === selectedChat?._id &&
        data.userId !== user.id
      ) {
        setTypingUsers((prev) => {
          const existing = prev.find((u) => u.userId === data.userId);
          if (existing) return prev;
          return [...prev, { userId: data.userId, userName: data.userName }];
        });
      }
    };

    const handleUserStopTyping = (data) => {
      if (data.conversationId === selectedChat?._id) {
        setTypingUsers((prev) => prev.filter((u) => u.userId !== data.userId));
      }
    };

    onUserTyping(handleUserTyping);
    onUserStopTyping(handleUserStopTyping);
  }, [selectedChat, user.id, onUserTyping, onUserStopTyping]);

  const handleTypingStart = () => {
    if (selectedChat) {
      startTyping({
        conversationId: selectedChat._id,
        userId: user.id,
        userName: user.name,
      });
    }
  };

  const handleTypingStop = () => {
    if (selectedChat) {
      stopTyping({
        conversationId: selectedChat._id,
        userId: user.id,
      });
    }
  };

  if (!selectedChat) return <WelcomeChatScreen />;

  return (
    <div className="flex-1 bg-gray-50 flex flex-col">
      <ChatHeader selectedChat={selectedChat} />
      {loading ? (
        <div className="flex-1 flex items-center justify-center text-gray-400">
          Loading messages...
        </div>
      ) : (
        <MessageArea
          messages={messages}
          user={user}
          typingUsers={typingUsers}
        />
      )}
      <MessageInput
        selectedChat={selectedChat}
        token={token}
        onTypingStart={handleTypingStart}
        onTypingStop={handleTypingStop}
      />
    </div>
  );
};
