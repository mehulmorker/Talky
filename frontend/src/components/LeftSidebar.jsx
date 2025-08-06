import React from "react";
import { FaUserPlus } from "react-icons/fa";

export const LeftSidebar = () => {
  return (
    <div className="bg-white w-80 border-r border-gray-200">
      {/* Header with action buttons: User Search */}
      <div className="p-4 border-b border-gray-200 flex items-center justify-between">
        <button className="flex items-center space-x-2 bg-blue-100 px-3 py-2 rounded-md text-sm font-medium hover:bg-blue-200 text-blue-700 transition-colors cursor-pointer">
          <FaUserPlus className="w-4 h-4" />
          <span>Search User</span>
        </button>
      </div>
      {/* User Search Modal */}
      {/* Search Bar */}
      {/* Conversations List */}
    </div>
  );
};
