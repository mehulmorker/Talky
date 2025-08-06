import React from "react";
import { useAuth } from "../context/AuthContext";

export const Navbar = ({ navbarRef }) => {
  const { user, logout } = useAuth();
  return (
    <nav
      ref={navbarRef}
      className="bg-white flex justify-between items-center py-4 px-6"
    >
      <div className="flex items-center">
        {/* logo */}
        <h1 className="text-xl font-bold">Talky</h1>
      </div>

      {user && (
        <div className="flex items-center space-x-2">
          {/* avtar */}
          <div className="flex items-center space-x-2">
            {user.picture && (
              <img
                src={user.picture}
                alt={user.name}
                className="w-8 h-8 rounded-full"
              />
            )}
            {/* user name */}
            <span className="text-sm text-gray-600">{user.name}</span>
          </div>
          {/* logout btn */}
          <button
            onClick={logout}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
          >
            Logout
          </button>
        </div>
      )}
    </nav>
  );
};
