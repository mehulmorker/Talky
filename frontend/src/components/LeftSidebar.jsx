import React from "react";
import { UserSearch } from "./UserSearch";
import { LeftSidebarSearch } from "./LeftSidebarSearch";

export const LeftSidebar = () => {
  return (
    <div className="bg-white w-80 border-r border-gray-200">
      {/* Header with action buttons: User Search */}
      <UserSearch />

      {/* User Search Modal */}
      <LeftSidebarSearch/>
      {/* Search Bar */}
      {/* Conversations List */}
    </div>
  );
};
