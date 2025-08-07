import React from "react";
import { WelcomeChatScreen } from "./WelcomeChatScreen";

export const MainChatArea = ({ selectedChat }) => {
  if (!selectedChat) return <WelcomeChatScreen />;
};
