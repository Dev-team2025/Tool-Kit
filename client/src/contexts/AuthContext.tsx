import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import type { User as SupabaseUser } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabaseClient";

interface User {
  id?: string;
  email: string;
  name?: string;
  role?: string;
}

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  loading: boolean;
  login: (
    email: string,
    password: string
  ) => Promise<{ ok: boolean; error?: string }>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const buildUser = (authUser: SupabaseUser | null): User | null => {
    if (!authUser) return null;

    return {
      id: authUser.id,
      email: authUser.email ?? "",
      name: authUser.user_metadata?.name ?? undefined,
      role: authUser.user_metadata?.role ?? undefined,
    };
  };

  useEffect(() => {
    let isMounted = true;

    const initSession = async () => {
      const { data } = await supabase.auth.getSession();
      if (!isMounted) return;

      const nextUser = buildUser(data.session?.user ?? null);
      setUser(nextUser);
      setIsAuthenticated(Boolean(nextUser));
      setLoading(false);
    };

    initSession();

    const { data: authListener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        if (!isMounted) return;

        const nextUser = buildUser(session?.user ?? null);
        setUser(nextUser);
        setIsAuthenticated(Boolean(nextUser));
        setLoading(false);
      }
    );

    return () => {
      isMounted = false;
      authListener.subscription.unsubscribe();
    };
  }, []);

  // Login Function
  const login = async (
    email: string,
    password: string
  ): Promise<{ ok: boolean; error?: string }> => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error || !data.user) {
        return { ok: false, error: error?.message ?? "Login failed" };
      }

      const nextUser = buildUser(data.user);
      setUser(nextUser);
      setIsAuthenticated(Boolean(nextUser));

      return { ok: Boolean(nextUser) };
    } catch (error) {
      console.error("Login error:", error);
      return { ok: false, error: "Unexpected login error" };
    }
  };

  // Logout function
  const logout = async () => {
    await supabase.auth.signOut();
    setIsAuthenticated(false);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, user, loading, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};
