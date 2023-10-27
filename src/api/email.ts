import { supabase } from "./commun";

export const sendEmail = async (to: string, subject: string, html: string) =>
  supabase.functions.invoke("sendEmail", {
    body: { to, subject, html },
  });
