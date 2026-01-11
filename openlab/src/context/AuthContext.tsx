import React, { createContext, useContext, useState, useEffect } from "react";

type Role = "student" | "lab" | "master";

type User = {
  email: string;
  name?: string;
  labName?: string;
  isMaster?: boolean;
};

type AuthState = {
  isLoggedIn: boolean;
  role: Role | null;
  user: User | null;
  currentMode: "student" | "lab"; // master가 선택한 현재 모드
};

type AuthContextValue = {
  auth: AuthState;
  login: (role: Role, user: User) => void;
  logout: () => void;
  switchMode: (mode: "student" | "lab") => void;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [auth, setAuth] = useState<AuthState>(() => {
    try {
      const raw = localStorage.getItem("openlab_auth");
      if (raw) return JSON.parse(raw) as AuthState;
    } catch (e) {
      /* ignore */
    }
    return { isLoggedIn: false, role: null, user: null, currentMode: "student" };
  });

  useEffect(() => {
    try {
      localStorage.setItem("openlab_auth", JSON.stringify(auth));
    } catch (e) {
      // ignore
    }
  }, [auth]);

  const login = (role: Role, user: User) => {
    const currentMode = role === "master" ? "student" : role === "student" ? "student" : "lab";
    setAuth({ isLoggedIn: true, role, user, currentMode });
  };

  const logout = () => {
    setAuth({ isLoggedIn: false, role: null, user: null, currentMode: "student" });
  };

  const switchMode = (mode: "student" | "lab") => {
    if (auth.role === "master") {
      setAuth({ ...auth, currentMode: mode });
    }
  };

  return (
    <AuthContext.Provider value={{ auth, login, logout, switchMode }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
