import React, { createContext, useContext, useState, useEffect } from "react";

interface User {
  id: number;
  name: string;
  email: string;
  role: "admin" | "employee" | "guest";
  isGuest?: boolean;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (token: string, user: User) => void;
  logout: () => void;
  isAdmin: () => boolean;
  isEmployee: () => boolean;
  isGuest: () => boolean;
  isAuthenticated: () => boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");
    if (storedToken && storedUser) {
      try {
        const parsed = JSON.parse(storedUser);
        // Validate the stored user has all required fields (older sessions won't have role)
        if (parsed && parsed.id && parsed.role && (["admin", "employee", "guest"].includes(parsed.role))) {
          setToken(storedToken);
          setUser(parsed);
        } else {
          // Stale/invalid session — clear it so user is sent to login
          localStorage.removeItem("token");
          localStorage.removeItem("user");
        }
      } catch {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
      }
    }
  }, []);

  const login = (newToken: string, newUser: User) => {
    setToken(newToken);
    setUser(newUser);
    localStorage.setItem("token", newToken);
    localStorage.setItem("user", JSON.stringify(newUser));
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  };

  const isAdmin = () => user?.role === "admin";
  const isEmployee = () => user?.role === "employee";
  const isGuest = () => user?.isGuest === true;
  const isAuthenticated = () => !!token && !!user;

  return (
    <AuthContext.Provider value={{ user, token, login, logout, isAdmin, isEmployee, isGuest, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};
