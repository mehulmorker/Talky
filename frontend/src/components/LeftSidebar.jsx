import React from "react";
import { UserSearch } from "./UserSearch";
import { LeftSidebarSearch } from "./LeftSidebarSearch";
import { Conversations } from "./Conversations";

export const LeftSidebar = () => {
  return (
    <div className="bg-white w-80 border-r border-gray-200 flex flex-col">
      {/* Header with action buttons: User Search Button & Model*/}
      <UserSearch />
      {/* Search Bar */}
      <LeftSidebarSearch />
      {/* Conversations List */}
      <Conversations/>
    </div>
  );
};
