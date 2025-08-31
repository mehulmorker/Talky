import React, { useEffect, useState } from "react";
import { FaUserPlus, FaUsers } from "react-icons/fa";
import { useAuth } from "../context/AuthContext";

export const UserActions = ({ onConversationCreated }) => {
  const { token, user } = useAuth();

  return (
    <>
      <div className="p-4 border-b border-gray-200 flex items-center justify-between">
        {/* Search Button */}
        <SearchUsers
          token={token}
          onConversationCreated={onConversationCreated}
        />
        {/* Group Create Button */}
        <CreateGroup
          token={token}
          user={user}
          onConversationCreated={onConversationCreated}
        />
      </div>
    </>
  );
};

export const SearchUsers = ({ token, onConversationCreated }) => {
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
      <button
        onClick={() => {
          setShowUserSearch(true);
          setSearchQuery("");
          setSearchResults([]);
        }}
        className="flex items-center space-x-2 bg-blue-100 px-3 py-2 rounded-md text-sm font-medium hover:bg-blue-200 text-blue-700 transition-colors cursor-pointer"
      >
        <FaUserPlus className="w-4 h-4" />
        <span>Search User</span>
      </button>
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

export const CreateGroup = ({ token, user, onConversationCreated }) => {
  const [showGroupCreate, setShowGroupCreate] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const [groupName, setGroupName] = useState("");
  const [selectedGroupParticipants, setSelectedGroupParticipants] = useState(
    []
  );
  const [groupCreationLoading, setGroupCreationLoading] = useState(false);
  const [groupCreationError, setGroupCreationError] = useState("");
  const [groupSearchQuery, setGroupSearchQuery] = useState("");
  const [groupSearchResults, setGroupSearchResults] = useState([]);
  const [groupSearchLoading, setGroupSearchLoading] = useState(false);
  const [groupSearchError, setGroupSearchError] = useState("");

  const fetchSearchResults = async () => {
    try {
      if (
        !showGroupCreate ||
        groupSearchQuery.trim().length < 2 ||
        groupSearchQuery.trim() === searchQuery.trim() // Prevent duplicate search if same as direct search
      ) {
        setGroupSearchResults([]);
        setGroupSearchError("");
        return;
      }
      setGroupSearchLoading(true);
      setGroupSearchError("");

      const res = await fetch(
        `http://localhost:5000/api/users/search?q=${encodeURIComponent(
          groupSearchQuery
        )}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const data = await res.json();
      const filteredResults = (data.users || []).filter(
        (user) =>
          !selectedGroupParticipants.some((p) => p._id === user._id) &&
          user._id !== user.id // Exclude already selected participants and current user
      );
      setGroupSearchResults(filteredResults);
      setGroupSearchLoading(false);
    } catch (error) {
      setGroupSearchError("Failed to search users for group");
      setGroupSearchLoading(false);
    }
  };

  useEffect(() => {
    fetchSearchResults();
  }, [groupSearchQuery, showGroupCreate, token, selectedGroupParticipants]);

  const handleAddParticipant = (user) => {
    setSelectedGroupParticipants((prev) => [...prev, user]);
    setGroupSearchQuery(""); // Clear search after adding
    setGroupSearchResults([]);
  };

  const handleRemoveParticipant = (userId) => {
    setSelectedGroupParticipants((prev) =>
      prev.filter((p) => p._id !== userId)
    );
  };

  const handleCreateGroup = async () => {
    setGroupCreationLoading(true);
    setGroupCreationError("");

    const participantIds = selectedGroupParticipants.map((p) => p._id);

    // Minimum 2 participants including current user (backend handles adding current user if not present)
    if (participantIds.length < 1) {
      setGroupCreationError(
        "Please add at least one other participant to the group."
      );
      setGroupCreationLoading(false);
      return;
    }

    try {
      const res = await fetch("http://localhost:5000/api/chat/groups", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: groupName.trim() === "" ? null : groupName.trim(),
          participants: participantIds,
        }),
      });
      const data = await res.json();

      if (data.success && data.conversation) {
        setShowGroupCreate(false);
        setGroupName("");
        setSelectedGroupParticipants([]);
        setGroupSearchResults([]);
        if (onConversationCreated) onConversationCreated(data.conversation);
      } else {
        setGroupCreationError(data.message || "Failed to create group chat");
      }
    } catch (err) {
      setGroupCreationError("An unexpected error occurred.");
    } finally {
      setGroupCreationLoading(false);
    }
  };

  return (
    <>
      <button
        className="flex items-center space-x-2 px-3 py-2 bg-green-100 hover:bg-green-200 text-green-700 rounded-md text-sm font-medium transition-colors"
        onClick={() => {
          setShowGroupCreate(true);
          setGroupName("");
          setSelectedGroupParticipants([]);
          setGroupSearchQuery("");
          setGroupSearchResults([]);
          setGroupCreationError("");
        }}
      >
        <FaUsers className="w-4 h-4" />
        <span>Create Group</span>
      </button>

      {showGroupCreate && (
        <div className="fixed flex items-center justify-center inset-0 bg-black/30">
          <div className="bg-white max-w-md rounded-lg shadow-lg p-6 w-full relative">
            <button
              onClick={() => {
                setShowGroupCreate(false);
                setGroupName("");
                setSelectedGroupParticipants([]);
                setGroupSearchQuery("");
                setGroupSearchResults([]);
                setGroupCreationError("");
              }}
              className="absolute top-2 right-2 text-gray-400 hover:text-gray-600 cursor-pointer"
            >
              &times;
            </button>
            <h3 className="text-lg font-semibold mb-4">Create Group Chat</h3>
            {/* Group Name */}
            <div className="mb-4">
              <label
                htmlFor="groupName"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Group Name (optional)
              </label>
              <input
                id="groupName"
                type="text"
                placeholder="My Group"
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                value={groupName}
                onChange={(e) => setGroupName(e.target.value)}
              />
            </div>

            {/* Participant Search */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Add Participants
              </label>
              <input
                type="text"
                placeholder="Search by name or email..."
                className="w-full p-2 border border-gray-300 rounded-md mb-2 focus:ring-blue-500 focus:border-blue-500"
                value={groupSearchQuery}
                onChange={(e) => setGroupSearchQuery(e.target.value)}
              />
              {groupSearchLoading && (
                <p className="text-gray-500">Searching...</p>
              )}
              {groupSearchError && (
                <p className="text-red-500">{groupSearchError}</p>
              )}
              <div
                className={`max-h-40 overflow-y-auto p-2 mb-2 ${
                  !groupSearchLoading && groupSearchQuery.trim().length >= 2
                    ? "border border-gray-200 rounded-md"
                    : ""
                }`}
              >
                {groupSearchResults.length === 0 &&
                  !groupSearchLoading &&
                  !groupSearchError &&
                  groupSearchQuery.trim().length >= 2 && (
                    <p className="text-gray-500">No users found.</p>
                  )}
                {groupSearchResults.map((user) => (
                  <div
                    key={user._id}
                    className="flex items-center justify-between p-2 hover:bg-gray-100 cursor-pointer rounded-md"
                    onClick={() => handleAddParticipant(user)}
                  >
                    <span className="font-medium">{user.name}</span>
                    <span className="text-sm text-gray-500">{user.email}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Selected Participants */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Selected Participants ({selectedGroupParticipants.length + 1}{" "}
                including you)
              </label>
              <div className="max-h-24 overflow-y-auto border border-gray-200 rounded-md p-2">
                <div className="flex items-center justify-between p-1 bg-gray-50 rounded-md mb-1">
                  <span className="font-medium">{user.name} (You)</span>
                </div>
                {selectedGroupParticipants.length === 0 && (
                  <p className="text-gray-500">
                    No other participants added yet.
                  </p>
                )}
                {selectedGroupParticipants.map((participant) => (
                  <div
                    key={participant._id}
                    className="flex items-center justify-between p-1 hover:bg-gray-100 rounded-md mb-1"
                  >
                    <span className="font-medium">{participant.name}</span>
                    <button
                      className="text-red-500 hover:text-red-700 text-sm"
                      onClick={() => handleRemoveParticipant(participant._id)}
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {groupCreationError && (
              <p className="text-red-500 text-sm mb-4">{groupCreationError}</p>
            )}
            <button
              className={
                `w-full py-2 px-4 rounded-md text-green-700 font-semibold transition-colors ` +
                (groupCreationLoading || selectedGroupParticipants.length < 1
                  ? "bg-green-300 cursor-not-allowed"
                  : "bg-green-100 hover:bg-green-200")
              }
              onClick={handleCreateGroup}
              disabled={
                groupCreationLoading || selectedGroupParticipants.length < 1
              }
            >
              {groupCreationLoading ? "Creating Group..." : "Create Group"}
            </button>
          </div>
        </div>
      )}
    </>
  );
};
