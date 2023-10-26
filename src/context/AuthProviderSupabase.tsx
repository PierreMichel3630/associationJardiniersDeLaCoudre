import { AuthError, AuthTokenResponse, User } from "@supabase/supabase-js";
import { createContext, useContext, useEffect, useState } from "react";
import { signInWithEmail, signOut } from "../api/auth";
import { supabase } from "../api/commun";

type Props = {
  children: string | JSX.Element | JSX.Element[];
};

const AuthContext = createContext<{
  user: User | null;
  login: (email: string, password: string) => Promise<AuthTokenResponse>;
  logout: () => Promise<{ error: AuthError | null }>;
}>({
  user:
    localStorage.getItem("user") !== null
      ? (JSON.parse(localStorage.getItem("user")!) as User)
      : null,
  login: (email: string, password: string) => signInWithEmail(email, password),
  logout: () => signOut(),
});

export const useAuth = () => useContext(AuthContext);

const login = (email: string, password: string) =>
  signInWithEmail(email, password);

const logout = () => signOut();

export const AuthProviderSupabase = ({ children }: Props) => {
  const [user, setUser] = useState<User | null>(
    localStorage.getItem("user") !== null
      ? (JSON.parse(localStorage.getItem("user")!) as User)
      : null
  );
  const [auth, setAuth] = useState(false);

  useEffect(() => {
    localStorage.setItem("user", JSON.stringify(user));
  }, [user]);

  useEffect(() => {
    const { data } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_IN") {
        setUser(session !== null ? session.user : null);
        setAuth(true);
      } else if (event === "SIGNED_OUT") {
        setUser(null);
        setAuth(false);
      }
    });
    return () => {
      data.subscription.unsubscribe();
    };
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
