"use client";
import { useProfile } from "@/hooks/queries/use-profile";
import { supabase } from "@/supabase/supabaseClients";
import { Profile } from "@/types/profile";
import { User } from "@supabase/supabase-js";
import React, { useContext, useEffect, useState } from "react";

interface AuthContextType {
  user: User;
  profile: Profile;
  loading: boolean;
}

const AuthContext = React.createContext<AuthContextType | null>(null);

export default function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const { data: profileUser } = useProfile(user?.id || "");
  useEffect(() => {
    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      setUser(user);
      setLoading(false);
    };

    getUser();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  return (
    <AuthContext.Provider
      value={{ user: user!, profile: profileUser!, loading }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within provider");
  return context;
};
