import { supabase } from "./commun";

export const signInWithEmail = (email: string, password: string) => {
  return supabase.auth.signInWithPassword({
    email,
    password,
  });
};

export const signOut = () => supabase.auth.signOut();
