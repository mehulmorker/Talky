import React, { useEffect, useState } from "react";
import { WelcomeChatScreen } from "./WelcomeChatScreen";
import { ChatHeader } from "./ChatHeader";
import { MessageArea } from "./MessageArea";
import { MessageInput } from "./MessageInput";

export const MainChatArea = ({ selectedChat, token, user }) => {
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState([]);

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
      console.log(error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, [selectedChat, token]);

  if (!selectedChat) return <WelcomeChatScreen />;

  return (
    <div className="flex-1 bg-gray-50 flex flex-col">
      <ChatHeader selectedChat={selectedChat} />
      {loading ? (
        <div className="flex-1 flex items-center justify-center text-gray-400">
          Loading messages...
        </div>
      ) : (
        <MessageArea messages={messages} user={user} />
      )}
      <MessageInput selectedChat={selectedChat} token={token} />
    </div>
  );
};
