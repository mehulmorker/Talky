import React from "react";
import { WelcomeChatScreen } from "./WelcomeChatScreen";
import { ChatHeader } from "./ChatHeader";
import { MessageArea } from "./MessageArea";
import { MessageInput } from "./MessageInput";

export const MainChatArea = ({ selectedChat }) => {
  if (!selectedChat) return <WelcomeChatScreen />;

  return (
    <div className="flex-1 bg-gray-50 flex flex-col">
      <ChatHeader selectedChat={selectedChat} />
      <MessageArea />
      <MessageInput />
    </div>
  );
};
