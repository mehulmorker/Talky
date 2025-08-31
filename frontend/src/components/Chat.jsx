import React, { useEffect, useState } from "react";
import { LeftSidebar } from "./LeftSidebar";
import { MainChatArea } from "./MainChatArea";
import { useAuth } from "../context/AuthContext";
import { useSocket } from "../context/SocketContext";

export const Chat = () => {
  const { user, token } = useAuth();
  const { onReceiveMessage } = useSocket();
  const [selectedChat, setSelectedChat] = useState(null);
  const [conversations, setConversations] = useState([]);
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    fetchConversations();
  }, [token]);

  useEffect(() => {
    const handleNewMessage = (message) => {
      setConversations((prev) => {
        const updated = prev.map((conv) => {
          if (message.conversationId === conv._id) {
            return {
              ...conv,
              lastMessage: {
                content: message.content,
                createdAt: message.createdAt,
                sender: message.sender,
              },
              updatedAt: message.createdAt,
            };
          }
          return conv;
        });

        const sorted = updated.sort((a, b) => {
          const dateA = new Date(a.updatedAt || a.lastMessage?.createdAt || 0);
          const dateB = new Date(b.updatedAt || b.lastMessage?.createdAt || 0);
          return dateB - dateA;
        });

        return sorted;
      });

      if (message.conversationId === selectedChat?._id) {
        setMessages((prev) => [...prev, message]);
      }
    };
    onReceiveMessage(handleNewMessage);
  }, [conversations.length, onReceiveMessage, selectedChat]);

  const fetchConversations = async (selectId = null) => {
    try {
      const res = await fetch("http://localhost:5001/api/chat/conversations", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();

      const userConversations = (data.conversations || []).map((conv) => ({
        ...conv,
        participants: conv.participants.map((p) => ({
          ...p,
          isCurrentUser: p._id === user.id,
        })),
      }));

      setConversations(userConversations);
      if (selectId) {
        const found = userConversations.find((c) => c._id === selectId);

        if (found) setSelectedChat(found);
      }
    } catch (error) {
      console.log(error);
    }
  };
  const handleConversationCreated = (conversation) => {
    fetchConversations(conversation._id);
  };

  return (
    <div className="flex h-full overflow-hidden">
      <LeftSidebar
        conversations={conversations}
        setSelectedChat={setSelectedChat}
        selectedChat={selectedChat}
        onConversationCreated={handleConversationCreated}
      />
      <MainChatArea
        selectedChat={selectedChat}
        token={token}
        user={user}
        messages={messages}
        setMessages={setMessages}
      />
    </div>
  );
};
