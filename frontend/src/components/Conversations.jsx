import React from "react";

export const Conversations = ({ conversations }) => {
  return (
    <div className="flex-1 overflow-y-auto">
      {conversations.map((conversation) => (
        <div
          key={conversation._id}
          className="p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors bg-blue-50 border-l-4 border-l-green-500"
        >
          <div className="flex items-center space-x-3">
            {/* avatar */}
            <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
              <span className="text-sm font-medium text-gray-600">
                {conversation.participants
                  .filter((p) => !p.isCurrentUser)
                  .map((p) =>
                    p.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")
                  )
                  .join("")}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex justify-between items-start">
                <h3 className="text-sm font-medium text-gray-900 truncate">
                  {conversation.participants
                    .filter((p) => !p.isCurrentUser)
                    .map((p) => p.name)
                    .join(", ")}
                </h3>

                <div>
                  <span className="text-xs text-gray-500">
                    {conversation.lastMessage &&
                      new Date(
                        conversation.lastMessage.createdAt
                      ).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <p className="text-sm text-gray-600 truncate">
                  {conversation.lastMessage?.content || "No messages yet"}
                </p>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
