import React from "react";
import { UserActions } from "./UserActions";
import { LeftSidebarSearch } from "./LeftSidebarSearch";
import { Conversations } from "./Conversations";

export const LeftSidebar = ({
  conversations,
  setSelectedChat,
  selectedChat,
  onConversationCreated,
}) => {
  return (
    <div className="bg-white w-80 border-r border-gray-200 flex flex-col">
      {/* Header with action buttons: User Search Button & Model*/}
      <UserActions onConversationCreated={onConversationCreated} />

      {/* Search Bar */}
      <LeftSidebarSearch />
      {/* Conversations List */}
      <Conversations
        conversations={conversations}
        setSelectedChat={setSelectedChat}
        selectedChat={selectedChat}
      />
    </div>
  );
};
