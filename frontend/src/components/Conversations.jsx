import React from "react";
import { FaUsers } from "react-icons/fa";
import { useAuth } from "../context/AuthContext";

export const Conversations = ({
  conversations,
  setSelectedChat,
  selectedChat,
}) => {
  const { user } = useAuth();

  return (
    <div className="flex-1 overflow-y-auto">
      {conversations.map((conversation) => {
        const otherParticipant = conversation.participants.find(
          (p) => p._id !== user.id
        );

        let chatIcon = otherParticipant?.picture ? (
          <img
            src={otherParticipant.picture}
            alt={otherParticipant.name}
            className="w-9 h-9 rounded-full object-cover"
          />
        ) : (
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
        );

        let chatName = conversation.isGroup
          ? conversation.name
          : conversation.participants
              .filter((p) => !p.isCurrentUser)
              .map((p) => p.name)
              .join(", ");

        return (
          <div
            key={conversation._id}
            onClick={() => setSelectedChat(conversation)}
            className={`p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors ${
              selectedChat?._id === conversation._id
                ? "bg-blue-50 border-l-4 border-l-green-500"
                : ""
            }`}
          >
            <div className="flex items-center space-x-3">
              {/* avatar */}
              <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
                {conversation.isGroup ? (
                  <FaUsers className="w-9 h-9 text-gray-200" />
                ) : (
                  chatIcon
                )}
              </div>
              {/* avatar */}

              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-start">
                  <h3 className="text-sm font-medium text-gray-900 truncate">
                    {chatName}
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
        );
      })}
    </div>
  );
};
