import React from "react";
import { useAuth } from "../context/AuthContext";
import { FaUsers } from "react-icons/fa";

export const ChatHeader = ({ selectedChat }) => {
  const { user } = useAuth();

  const otherUser = selectedChat.participants.find((p) => p._id !== user.id);
  let headerIcon = selectedChat?.isGroup ? (
    <FaUsers className="w-9 h-9 text-gray-200" />
  ) : otherUser.picture ? (
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
  );

  let chatHeaderTitle = selectedChat?.isGroup ? selectedChat?.name : otherUser.name
  return (
    <div className="bg-white border-b border-gray-200 px-6 py-4 flex items-center space-x-3">
      <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
        {headerIcon}
      </div>
      <div>
        <h3 className="text-lg font-semibold text-gray-800">
          {chatHeaderTitle}
        </h3>
        <p className="text-sm text-gray-500">Online</p>
      </div>
    </div>
  );
};
