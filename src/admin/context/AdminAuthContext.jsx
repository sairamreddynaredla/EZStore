import { createContext, useCallback, useEffect, useMemo, useState } from "react";
import adminApi from "../services/api";

export const AdminAuthContext = createContext(null);

const ADMIN_TOKEN_KEY = "ezstore_admin_token";
const ADMIN_USER_KEY = "ezstore_admin_user";

const safeStorage = {
  get(key) {
    try {
      return window.localStorage.getItem(key);
    } catch {
      return null;
    }
  },
  set(key, value) {
    try {
      window.localStorage.setItem(key, value);
    } catch {
      // Ignore storage failures in private browsing or restricted environments.
    }
  },
  remove(key) {
    try {
      window.localStorage.removeItem(key);
    } catch {
      // Ignore storage failures in private browsing or restricted environments.
    }
  },
};

export const AdminAuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);

  useEffect(() => {
    const storedToken = safeStorage.get(ADMIN_TOKEN_KEY);
    const storedUser = safeStorage.get(ADMIN_USER_KEY);

    if (storedToken) {
      setToken(storedToken);
    }

    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch {
        setUser(null);
      }
    }

    const logoutHandler = () => {
      safeStorage.remove(ADMIN_TOKEN_KEY);
      safeStorage.remove(ADMIN_USER_KEY);
      setToken(null);
      setUser(null);
    };

    window.addEventListener("ezstoreAdminLogout", logoutHandler);

    if (storedToken) {
      let isActive = true;
      adminApi
        .get("/auth/me")
        .then((response) => {
          if (!isActive) return;
          const nextUser = response?.data?.user ?? null;
          if (nextUser) {
            safeStorage.set(ADMIN_USER_KEY, JSON.stringify(nextUser));
            setUser(nextUser);
          }
        })
        .catch(() => {
          if (!isActive) return;
          logoutHandler();
        });

      return () => {
        isActive = false;
        window.removeEventListener("ezstoreAdminLogout", logoutHandler);
      };
    }

    return () => {
      window.removeEventListener("ezstoreAdminLogout", logoutHandler);
    };
  }, []);

  const login = useCallback(({ token: authToken, user: authUser }) => {
    safeStorage.set(ADMIN_TOKEN_KEY, authToken);
    safeStorage.set(ADMIN_USER_KEY, JSON.stringify(authUser));
    setToken(authToken);
    setUser(authUser);
  }, []);

  const logout = useCallback(() => {
    safeStorage.remove(ADMIN_TOKEN_KEY);
    safeStorage.remove(ADMIN_USER_KEY);
    setToken(null);
    setUser(null);
  }, []);

  const value = useMemo(
    () => ({
      isAuthenticated: Boolean(token),
      token,
      user,
      login,
      logout,
    }),
    [token, user, login, logout]
  );

  return <AdminAuthContext.Provider value={value}>{children}</AdminAuthContext.Provider>;
};
