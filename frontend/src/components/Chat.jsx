import React from "react";
import { LeftSidebar } from "./LeftSidebar";
import { MainChatArea } from "./MainChatArea";

export const Chat = () => {
  return (
    <div className="flex h-full">
      <LeftSidebar />
      <MainChatArea />
    </div>
  );
};
