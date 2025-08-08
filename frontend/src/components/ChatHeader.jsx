import React from "react";
import { useAuth } from "../context/AuthContext";

export const ChatHeader = ({ selectedChat }) => {
  const { user } = useAuth();

  const otherUser = selectedChat.participants.find((p) => p._id !== user.id);
  return (
    <div className="bg-white border-b border-gray-200 px-6 py-4 flex items-center space-x-3">
      <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
        {otherUser.picture ? (
          <img
            src={otherUser.picture}
            alt={otherUser.name}
            className="rounded-full"
          />
        ) : (
          <span className="text-sm font-medium text-gray-600">
            {otherUser.name
              .split(" ")
              .map((n) => n[0])
              .join("")}
          </span>
        )}
      </div>
      <div>
        <h3 className="text-lg font-semibold text-gray-800">
          {otherUser.name}
        </h3>
        <p className="text-sm text-gray-500">Online</p>
      </div>
    </div>
  );
};
