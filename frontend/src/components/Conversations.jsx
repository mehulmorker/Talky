import React from "react";

export const Conversations = () => {
  return (
    <div className="flex-1 overflow-y-auto bg-amber-300">
      {/* Conversations */}
      <Conversation />
      <Conversation />
      <Conversation />
      <Conversation />
      <Conversation />
      <Conversation />
      <Conversation />
      <Conversation />
      <Conversation />
      <Conversation />
      <Conversation />
      <Conversation />
      {/* Conversations */}
    </div>
  );
};

// Don't need this component, once api integration done we will remove
export const Conversation = () => {
  return (
    <div className="p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors bg-blue-50 border-l-4 border-l-green-500">
      <div className="flex items-center space-x-3">
        {/* avatar */}
        <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
          <span className="text-sm font-medium text-gray-600">MM</span>
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex justify-between items-start">
            <h3 className="text-sm font-medium text-gray-900 truncate">
              Morker Mehul
            </h3>

            <div>
              <span className="text-xs text-gray-500">17:25</span>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-600 truncate">No messages yet</p>
          </div>
        </div>
      </div>
    </div>
  );
};
