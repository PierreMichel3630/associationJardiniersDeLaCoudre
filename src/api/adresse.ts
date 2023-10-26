import { AdresseInsert, AdresseUpdate } from "../model/Adresse";
import { supabase } from "./commun";

export const SUPABASE_ADRESSE_TABLE = "adresse";

export const insertAdresse = (value: AdresseInsert) =>
  supabase.from(SUPABASE_ADRESSE_TABLE).insert(value).select().single();

export const updateAdresse = (value: AdresseUpdate) =>
  supabase
    .from(SUPABASE_ADRESSE_TABLE)
    .update(value)
    .eq("id", value.id)
    .select()
    .single();
