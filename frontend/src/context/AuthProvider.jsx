import { useEffect, useState } from "react";
import { AuthContext } from "./AuthContext";

const STORAGE_USER_KEY = "ezstore_user";
const STORAGE_TOKEN_KEY = "ezstore_token";

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    if (typeof window === "undefined") {
      return null;
    }

    try {
      const stored = window.localStorage.getItem(STORAGE_USER_KEY);
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  useEffect(() => {
    if (!user) return;

    try {
      window.localStorage.setItem(STORAGE_USER_KEY, JSON.stringify(user));
    } catch {
      // ignore localStorage failures
    }
  }, [user]);

  const login = (userData, token) => {
    setUser(userData);

    try {
      window.localStorage.setItem(STORAGE_USER_KEY, JSON.stringify(userData));
      if (token) {
        window.localStorage.setItem(STORAGE_TOKEN_KEY, token);
      }
    } catch {
      // ignore localStorage failures
    }
  };

  const logout = () => {
    setUser(null);

    try {
      window.localStorage.removeItem(STORAGE_USER_KEY);
      window.localStorage.removeItem(STORAGE_TOKEN_KEY);
    } catch {
      // ignore localStorage failures
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: Boolean(user),
        initializing: false,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
