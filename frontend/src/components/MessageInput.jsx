import React, { useEffect, useRef, useState } from "react";

export const MessageInput = ({
  selectedChat,
  token,
  onTypingStart,
  onTypingStop,
}) => {
  const [value, setValue] = useState("");
  const [loading, setLoading] = useState(false);
  const typingTimeoutRef = useRef(null);

  const handleInputChange = (e) => {
    const newValue = e.target.value;
    setValue(newValue);
    if (onTypingStart && newValue.trim()) {
      onTypingStart();

      // Clear existing timeout
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }

      // Set new timeout to stop typing indicator
      typingTimeoutRef.current = setTimeout(() => {
        if (onTypingStop) onTypingStop();
      }, 2000);
    } else if (onTypingStop && !newValue.trim()) {
      onTypingStop();
    }
  };

  const handleSend = async (e) => {
    e.preventDefault();

    try {
      if (value.trim() && !loading) {
        setLoading(true);
        await fetch("http://localhost:5001/api/chat/messages", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            conversationId: selectedChat._id,
            content: value,
          }),
        });
      }
    } finally {
      setValue("");
      setLoading(false);
    }
  };

  useEffect(() => {
    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    };
  }, []);

  return (
    <form
      onSubmit={handleSend}
      className="bg-white border-t border-gray-200 p-4"
    >
      <div className="flex space-x-3">
        <input
          type="text"
          placeholder="Type a message..."
          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          value={value}
          onChange={handleInputChange}
        />
        <button
          type="submit"
          className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
        >
          {loading ? "Sending..." : "Send"}
        </button>
      </div>
    </form>
  );
};
