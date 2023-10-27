import { BilanInsert, BilanUpdate } from "../model/Bilan";
import { supabase } from "./commun";

export const SUPABASE_BILAN_TABLE = "bilan";

export const insertBilan = (value: BilanInsert) =>
  supabase.from(SUPABASE_BILAN_TABLE).insert(value).select().single();

export const updateBilan = (value: BilanUpdate) =>
  supabase
    .from(SUPABASE_BILAN_TABLE)
    .update(value)
    .eq("id", value.id)
    .select()
    .single();

export const getBilanByAnnee = (annee: number) =>
  supabase.from(SUPABASE_BILAN_TABLE).select("*").eq("annee", annee).single();
