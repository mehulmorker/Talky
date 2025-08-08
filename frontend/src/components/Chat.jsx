import React, { useEffect, useState } from "react";
import { LeftSidebar } from "./LeftSidebar";
import { MainChatArea } from "./MainChatArea";
import { useAuth } from "../context/AuthContext";

export const Chat = () => {
  const { user, token } = useAuth();
  const [selectedChat, setSelectedChat] = useState(null);
  const [conversations, setConversations] = useState([]);

  const fetchConversations = async (selectId = null) => {
    try {
      const res = await fetch("http://localhost:5001/api/chat/conversations", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      // console.log("🔍 Conversations data:", JSON.stringify(data));
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

  useEffect(() => {
    fetchConversations();
  }, [token]);

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
      <MainChatArea selectedChat={selectedChat} token={token} user={user} />
    </div>
  );
};
