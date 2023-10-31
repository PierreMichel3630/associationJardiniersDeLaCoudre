import { AdherentInsert, AdherentUpdate } from "../model/Adherent";
import { supabase } from "./commun";

export const SUPABASE_ADHERENT_TABLE = "adherent";

export const insertAdherent = (value: AdherentInsert) =>
  supabase.from(SUPABASE_ADHERENT_TABLE).insert(value).select().single();

export const updateAdherent = (value: AdherentUpdate) =>
  supabase
    .from(SUPABASE_ADHERENT_TABLE)
    .update(value)
    .eq("id", value.id)
    .select()
    .single();

export const getAllAdherentWithAdresse = () =>
  supabase.from(SUPABASE_ADHERENT_TABLE).select("*, adresse!inner(*)");

export const getAllAdherent = () =>
  supabase.from(SUPABASE_ADHERENT_TABLE).select("*");
