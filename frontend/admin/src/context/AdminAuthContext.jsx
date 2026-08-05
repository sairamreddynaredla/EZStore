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
  const [user, setUser] = useState(() => {
    const storedUser = safeStorage.get(ADMIN_USER_KEY);
    if (!storedUser) return null;

    try {
      return JSON.parse(storedUser);
    } catch {
      return null;
    }
  });
  const [token, setToken] = useState(() => safeStorage.get(ADMIN_TOKEN_KEY));
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let isActive = true;

    const logoutHandler = () => {
      safeStorage.remove(ADMIN_TOKEN_KEY);
      safeStorage.remove(ADMIN_USER_KEY);
      setToken(null);
      setUser(null);
    };

    const cleanup = () => {
      isActive = false;
      window.removeEventListener("ezstoreAdminLogout", logoutHandler);
    };

    window.addEventListener("ezstoreAdminLogout", logoutHandler);

    if (!token) {
      setReady(true);
      return cleanup;
    }

    const fallbackUser = safeStorage.get(ADMIN_USER_KEY);

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

        if (fallbackUser) {
          try {
            const parsedUser = JSON.parse(fallbackUser);
            if (parsedUser) {
              setUser(parsedUser);
            }
          } catch {
            // Ignore malformed stored user data.
          }
        } else {
          logoutHandler();
        }
      })
      .finally(() => {
        if (!isActive) return;
        setReady(true);
      });

    return cleanup;
  }, [token]);

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
      isReady: ready,
      token,
      user,
      login,
      logout,
    }),
    [ready, token, user, login, logout]
  );

  return <AdminAuthContext.Provider value={value}>{children}</AdminAuthContext.Provider>;
};
