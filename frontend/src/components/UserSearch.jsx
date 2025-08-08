import React, { useEffect, useState } from "react";
import { FaUserPlus } from "react-icons/fa";
import { useAuth } from "../context/AuthContext";

export const UserSearch = ({ onConversationCreated }) => {
  const { token } = useAuth();
  const [showUserSearch, setShowUserSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);

  const fetchSearchResults = async () => {
    try {
      if (!showUserSearch || searchQuery.trim().length < 2) {
        setSearchResults([]);
        return;
      }
      setSearchLoading(true);
      const res = await fetch(
        `http://localhost:5001/api/users/search?q=${encodeURIComponent(
          searchQuery
        )}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const data = await res.json();
      setSearchResults(data.users || []);
      setSearchLoading(false);
    } catch (error) {
      setSearchLoading(false);
    }
  };

  useEffect(() => {
    fetchSearchResults();
  }, [searchQuery, showUserSearch, token]);

  const handleStartConversation = async (user) => {
    try {
      const res = await fetch("http://localhost:5001/api/chat/conversations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ participantId: user._id }),
      });
      const data = await res.json();
      if (data.success && data.conversation) {
        setShowUserSearch(false);
        setSearchQuery("");
        setSearchResults([]);
        if (onConversationCreated) onConversationCreated(data.conversation);
      }
    } catch (err) {
      // Optionally show error
    }
  };

  return (
    <>
      {/* Search Button */}
      <div className="p-4 border-b border-gray-200 flex items-center justify-between">
        <button
          onClick={() => setShowUserSearch(true)}
          className="flex items-center space-x-2 bg-blue-100 px-3 py-2 rounded-md text-sm font-medium hover:bg-blue-200 text-blue-700 transition-colors cursor-pointer"
        >
          <FaUserPlus className="w-4 h-4" />
          <span>Search User</span>
        </button>
      </div>
      {/* Search Model */}
      {showUserSearch && (
        <div className="fixed flex items-center justify-center inset-0 bg-black/30">
          <div className="bg-white max-w-md rounded-lg shadow-lg p-6 w-full relative">
            <button
              onClick={() => setShowUserSearch(false)}
              className="absolute top-2 right-2 text-gray-400 hover:text-gray-600 cursor-pointer"
            >
              &times;
            </button>
            <h2 className="text-lg font-semibold mb-4">Search User</h2>
            <input
              type="text"
              placeholder="Type a name or email..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg mb-4"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              autoFocus
            />
            {searchLoading && (
              <div className="text-gray-400 text-sm mb-2">Searching...</div>
            )}
            {/* search user list */}
            <div className="max-h-60 overflow-y-auto">
              {searchResults.length === 0 && !searchLoading && (
                <div className="text-gray-500 text-sm">No users found.</div>
              )}

              {searchResults.map((user) => (
                <div
                  key={user._id}
                  className="flex items-center justify-between p-2 rounded hover:bg-gray-100 cursor-pointer transition-colors"
                  onClick={() => handleStartConversation(user)}
                >
                  <div className="flex items-center space-x-3">
                    {user.picture ? (
                      <img
                        src={user.picture}
                        alt={user.name}
                        className="w-8 h-8 rounded-full"
                      />
                    ) : (
                      <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                        <span className="text-xs font-medium text-gray-600">
                          {user.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </span>
                      </div>
                    )}

                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {user.name}
                      </div>
                      <div className="text-xs text-gray-500">{user.email}</div>
                    </div>
                  </div>
                  <button className="px-3 py-1 bg-blue-500 text-white text-xs rounded hover:bg-blue-600 transition-colors">
                    Start Chat
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
};
