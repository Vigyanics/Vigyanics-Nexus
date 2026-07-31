import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import supabase from "@/lib/supabase";

interface User {
  id: string;
  email: string;
  role: string;
  firstName: string | null;
  lastName: string | null;
  isActive: boolean;
  createdAt: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (token: string, user: User) => void;
  logout: () => void;
  isAdmin: boolean;
  isSuperAdmin: boolean;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

function isLocalDevToken(token: string | null): boolean {
  if (!token) return false;
  try {
    const payload = JSON.parse(atob(token.split(".")[1] ?? "")) as { provider?: string };
    return payload.provider === "local-dev";
  } catch {
    return false;
  }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(() => localStorage.getItem("admin_token"));
  const [user, setUser] = useState<User | null>(() => {
    try {
      const u = localStorage.getItem("admin_user");
      return u ? (JSON.parse(u) as User) : null;
    } catch {
      return null;
    }
  });
  const [isLoading, setIsLoading] = useState(true);

  // On mount: verify the stored token with Supabase and refresh user data
  useEffect(() => {
    const storedToken = localStorage.getItem("admin_token");
    if (!storedToken) {
      setIsLoading(false);
      return;
    }
    if (isLocalDevToken(storedToken)) {
      setIsLoading(false);
      return;
    }

    supabase.auth.getUser(storedToken).then(async ({ data: { user: sbUser }, error }) => {
      if (error || !sbUser) {
        // Token expired or invalid — clear session
        setToken(null);
        setUser(null);
        localStorage.removeItem("admin_token");
        localStorage.removeItem("admin_user");
        setIsLoading(false);
        return;
      }

      // Fetch fresh profile from API
      try {
        const res = await fetch("/api/auth/me", {
          headers: { Authorization: `Bearer ${storedToken}` },
        });
        if (res.ok) {
          const profile = await res.json() as User;
          if (profile.role !== "admin" && profile.role !== "super_admin") {
            // Not an admin — reject
            setToken(null);
            setUser(null);
            localStorage.removeItem("admin_token");
            localStorage.removeItem("admin_user");
          } else {
            setUser(profile);
            localStorage.setItem("admin_user", JSON.stringify(profile));
          }
        }
      } catch {
        // keep existing stored user
      }
      setIsLoading(false);
    });
  }, []);

  // Listen for Supabase session changes
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (isLocalDevToken(localStorage.getItem("admin_token"))) return;
      if (event === "SIGNED_OUT" || !session) {
        setToken(null);
        setUser(null);
        localStorage.removeItem("admin_token");
        localStorage.removeItem("admin_user");
      }
    });
    return () => subscription.unsubscribe();
  }, []);

  const login = useCallback((newToken: string, newUser: User) => {
    setToken(newToken);
    setUser(newUser);
    localStorage.setItem("admin_token", newToken);
    localStorage.setItem("admin_user", JSON.stringify(newUser));
  }, []);

  const logout = useCallback(async () => {
    await supabase.auth.signOut();
    setToken(null);
    setUser(null);
    localStorage.removeItem("admin_token");
    localStorage.removeItem("admin_user");
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        login,
        logout,
        isAdmin: user?.role === "admin" || user?.role === "super_admin",
        isSuperAdmin: user?.role === "super_admin",
        isLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
