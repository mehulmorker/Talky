import React, { useState } from "react";
import { FaUserPlus } from "react-icons/fa";

export const UserSearch = () => {
  const [showUserSearch, setShowUserSearch] = useState(false);
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
              autoFocus
            />
            {/* search user list */}
            <div className="max-h-60 overflow-y-auto">
              {/* MOCK */}
              <div className="flex items-center justify-between p-2 rounded hover:bg-gray-100 cursor-pointer transition-colors">
                <div className="flex items-center space-x-3">
                  <img
                    src="https://prepsec.org/wp-content/uploads/2017/09/unknown-person-icon-Image-from.png"
                    alt="https://prepsec.org/wp-content/uploads/2017/09/unknown-person-icon-Image-from.png"
                    className="w-8 h-8 rounded-full"
                  />

                  <div>
                    <div className="text-sm font-medium text-gray-900">
                      Mehul Morker
                    </div>
                    <div className="text-xs text-gray-500">abc@cm.com</div>
                  </div>
                </div>
                <button className="px-3 py-1 bg-blue-500 text-white text-xs rounded hover:bg-blue-600 transition-colors">
                  Start Chat
                </button>
              </div>

              <div className="flex items-center justify-between p-2 rounded hover:bg-gray-100 cursor-pointer transition-colors">
                <div className="flex items-center space-x-3">
                  <img
                    src="https://prepsec.org/wp-content/uploads/2017/09/unknown-person-icon-Image-from.png"
                    alt="https://prepsec.org/wp-content/uploads/2017/09/unknown-person-icon-Image-from.png"
                    className="w-8 h-8 rounded-full"
                  />

                  <div>
                    <div className="text-sm font-medium text-gray-900">
                      Mehul Morker
                    </div>
                    <div className="text-xs text-gray-500">abc@cm.com</div>
                  </div>
                </div>
                <button className="px-3 py-1 bg-blue-500 text-white text-xs rounded hover:bg-blue-600 transition-colors">
                  Start Chat
                </button>
              </div>

              <div className="flex items-center justify-between p-2 rounded hover:bg-gray-100 cursor-pointer transition-colors">
                <div className="flex items-center space-x-3">
                  <img
                    src="https://prepsec.org/wp-content/uploads/2017/09/unknown-person-icon-Image-from.png"
                    alt="https://prepsec.org/wp-content/uploads/2017/09/unknown-person-icon-Image-from.png"
                    className="w-8 h-8 rounded-full"
                  />

                  <div>
                    <div className="text-sm font-medium text-gray-900">
                      Mehul Morker
                    </div>
                    <div className="text-xs text-gray-500">abc@cm.com</div>
                  </div>
                </div>
                <button className="px-3 py-1 bg-blue-500 text-white text-xs rounded hover:bg-blue-600 transition-colors">
                  Start Chat
                </button>
              </div>

              <div className="flex items-center justify-between p-2 rounded hover:bg-gray-100 cursor-pointer transition-colors">
                <div className="flex items-center space-x-3">
                  <img
                    src="https://prepsec.org/wp-content/uploads/2017/09/unknown-person-icon-Image-from.png"
                    alt="https://prepsec.org/wp-content/uploads/2017/09/unknown-person-icon-Image-from.png"
                    className="w-8 h-8 rounded-full"
                  />

                  <div>
                    <div className="text-sm font-medium text-gray-900">
                      Mehul Morker
                    </div>
                    <div className="text-xs text-gray-500">abc@cm.com</div>
                  </div>
                </div>
                <button className="px-3 py-1 bg-blue-500 text-white text-xs rounded hover:bg-blue-600 transition-colors">
                  Start Chat
                </button>
              </div>

              <div className="flex items-center justify-between p-2 rounded hover:bg-gray-100 cursor-pointer transition-colors">
                <div className="flex items-center space-x-3">
                  <img
                    src="https://prepsec.org/wp-content/uploads/2017/09/unknown-person-icon-Image-from.png"
                    alt="https://prepsec.org/wp-content/uploads/2017/09/unknown-person-icon-Image-from.png"
                    className="w-8 h-8 rounded-full"
                  />

                  <div>
                    <div className="text-sm font-medium text-gray-900">
                      Mehul Morker
                    </div>
                    <div className="text-xs text-gray-500">abc@cm.com</div>
                  </div>
                </div>
                <button className="px-3 py-1 bg-blue-500 text-white text-xs rounded hover:bg-blue-600 transition-colors">
                  Start Chat
                </button>
              </div>

              <div className="flex items-center justify-between p-2 rounded hover:bg-gray-100 cursor-pointer transition-colors">
                <div className="flex items-center space-x-3">
                  <img
                    src="https://prepsec.org/wp-content/uploads/2017/09/unknown-person-icon-Image-from.png"
                    alt="https://prepsec.org/wp-content/uploads/2017/09/unknown-person-icon-Image-from.png"
                    className="w-8 h-8 rounded-full"
                  />

                  <div>
                    <div className="text-sm font-medium text-gray-900">
                      Mehul Morker
                    </div>
                    <div className="text-xs text-gray-500">abc@cm.com</div>
                  </div>
                </div>
                <button className="px-3 py-1 bg-blue-500 text-white text-xs rounded hover:bg-blue-600 transition-colors">
                  Start Chat
                </button>
              </div>

              <div className="flex items-center justify-between p-2 rounded hover:bg-gray-100 cursor-pointer transition-colors">
                <div className="flex items-center space-x-3">
                  <img
                    src="https://prepsec.org/wp-content/uploads/2017/09/unknown-person-icon-Image-from.png"
                    alt="https://prepsec.org/wp-content/uploads/2017/09/unknown-person-icon-Image-from.png"
                    className="w-8 h-8 rounded-full"
                  />

                  <div>
                    <div className="text-sm font-medium text-gray-900">
                      Mehul Morker
                    </div>
                    <div className="text-xs text-gray-500">abc@cm.com</div>
                  </div>
                </div>
                <button className="px-3 py-1 bg-blue-500 text-white text-xs rounded hover:bg-blue-600 transition-colors">
                  Start Chat
                </button>
              </div>

              <div className="flex items-center justify-between p-2 rounded hover:bg-gray-100 cursor-pointer transition-colors">
                <div className="flex items-center space-x-3">
                  <img
                    src="https://prepsec.org/wp-content/uploads/2017/09/unknown-person-icon-Image-from.png"
                    alt="https://prepsec.org/wp-content/uploads/2017/09/unknown-person-icon-Image-from.png"
                    className="w-8 h-8 rounded-full"
                  />

                  <div>
                    <div className="text-sm font-medium text-gray-900">
                      Mehul Morker
                    </div>
                    <div className="text-xs text-gray-500">abc@cm.com</div>
                  </div>
                </div>
                <button className="px-3 py-1 bg-blue-500 text-white text-xs rounded hover:bg-blue-600 transition-colors">
                  Start Chat
                </button>
              </div>
              {/* MOCK */}
            </div>
          </div>
        </div>
      )}
    </>
  );
};
