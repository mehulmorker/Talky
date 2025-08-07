import { createContext, useContext, useEffect, useState } from "react";
import TokenStorage from "../utils/tokenStorage";

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(TokenStorage.getToken());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    verifyToken();
  }, []);

  const verifyToken = async (retryCount = 0) => {
    const storedToken = TokenStorage.getToken();
    if (!storedToken) {
      setLoading(false);
      return;
    }

    try {
      const response = await fetch("http://localhost:5001/api/auth/verify", {
        headers: {
          Authorization: `Bearer ${storedToken}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setUser(data.user);
        setToken(storedToken);
      } else if (response.status === 401) {
        TokenStorage.removeToken();
        setToken(null);
      } else {
        // For other HTTP errors, don't remove token immediately
        if (retryCount < 2) {
          // Retry after 1 second
          setTimeout(() => verifyToken(retryCount + 1), 1000);
          return;
        }
        // Only remove token after multiple failed attempts
        console.error("Token verification failed after retries");
        TokenStorage.removeToken();
        setToken(null);
      }
    } catch (error) {
      // Don't remove token immediately on network errors
      if (retryCount < 2) {
        // Retry after 1 second for network errors
        setTimeout(() => verifyToken(retryCount + 1), 1000);
        return;
      }

      // Only remove token after multiple failed attempts
      TokenStorage.removeToken();
      setToken(null);
    } finally {
      if (retryCount === 0) {
        setLoading(false);
      }
    }
  };

  const login = (userData, authToken) => {
    setUser(userData);
    setToken(authToken);
    TokenStorage.setToken(authToken);
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    TokenStorage.clearAuthData();
  };

  const value = {
    user,
    token,
    login,
    logout,
    isAuthenticated: !!token,
    loading,
  };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
