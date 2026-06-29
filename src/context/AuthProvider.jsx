import { useEffect, useMemo, useState } from "react";
import authApi, { setAuthFailureHandler } from "../services/authApi";
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

  const [initializing, setInitializing] = useState(true);

  useEffect(() => {
    const initializeAuth = async () => {
      if (typeof window === "undefined") {
        setInitializing(false);
        return;
      }

      try {
        const response = await authApi.get("/auth/refresh-token");
        const authUser = response.data?.user;
        const token = response.data?.token;

        if (authUser && token) {
          login(authUser, token);
          return;
        }
      } catch {
        logoutLocal();
      } finally {
        setInitializing(false);
      }
    };

    initializeAuth();

    setAuthFailureHandler(logoutLocal);
    return () => setAuthFailureHandler(null);
  }, []);

  useEffect(() => {
    if (!user) {
      try {
        window.localStorage.removeItem(STORAGE_USER_KEY);
      } catch {
        // ignore localStorage failures
      }
      return;
    }

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

  const updateUser = (userData) => {
    setUser(userData);
    try {
      window.localStorage.setItem(STORAGE_USER_KEY, JSON.stringify(userData));
    } catch {
      // ignore localStorage failures
    }
  };

  const logoutLocal = () => {
    setUser(null);

    try {
      window.localStorage.removeItem(STORAGE_USER_KEY);
      window.localStorage.removeItem(STORAGE_TOKEN_KEY);
    } catch {
      // ignore localStorage failures
    }
  };

  const logout = async () => {
    try {
      await authApi.post("/auth/logout");
    } catch {
      // ignore logout errors, still clear local state
    }

    logoutLocal();
  };

  const value = useMemo(
    () => ({
      user,
      login,
      logout,
      isAuthenticated: Boolean(user),
      initializing,
    }),
    [user, initializing]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthProvider;
