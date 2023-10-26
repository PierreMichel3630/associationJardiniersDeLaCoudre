import { AttributionInsert, AttributionUpdate } from "../model/Attribution";
import { supabase } from "./commun";

export const SUPABASE_ATTRIBUTION_TABLE = "attribution";

export const insertAttribution = (value: AttributionInsert) =>
  supabase.from(SUPABASE_ATTRIBUTION_TABLE).insert(value).select().single();

export const deleteAttribution = (id: number) =>
  supabase.from(SUPABASE_ATTRIBUTION_TABLE).delete().eq("id", id);

export const updateAttribution = (value: AttributionUpdate) =>
  supabase
    .from(SUPABASE_ATTRIBUTION_TABLE)
    .update(value)
    .eq("id", value.id)
    .select()
    .single();

export const getAllAttribution = () =>
  supabase
    .from(SUPABASE_ATTRIBUTION_TABLE)
    .select("*, adherent!inner(*), parcelle!inner(*)");

export const getAttributionParAnnee = (annee: number) =>
  supabase
    .from(SUPABASE_ATTRIBUTION_TABLE)
    .select("*, adherent!inner(*), parcelle!inner(*)")
    .eq("annee", annee);

export const getAttributionParAnneeEtParcelle = (
  annee: number,
  parcelle: number
) =>
  supabase
    .from(SUPABASE_ATTRIBUTION_TABLE)
    .select("*, adherent!inner(*), parcelle!inner(*)")
    .eq("parcelle", parcelle)
    .eq("annee", annee);
