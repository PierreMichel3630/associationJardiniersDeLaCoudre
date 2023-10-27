import { ParcelleInsert, ParcelleUpdate } from "../model/Parcelle";
import { supabase } from "./commun";

export const SUPABASE_PARCELLE_TABLE = "parcelle";
export const SUPABASE_PARCELLEDISPONIBLE_TABLE = "parcelledisponible";

export const insertParcelle = (value: ParcelleInsert) =>
  supabase.from(SUPABASE_PARCELLE_TABLE).insert(value).select().single();

export const updateParcelle = (value: ParcelleUpdate) =>
  supabase
    .from(SUPABASE_PARCELLE_TABLE)
    .update(value)
    .eq("id", value.id)
    .select()
    .single();

export const getAllParcelle = () =>
  supabase.from(SUPABASE_PARCELLE_TABLE).select("*, site!inner(*)");

export const getAllParcelleDisponible = () =>
  supabase.from(SUPABASE_PARCELLEDISPONIBLE_TABLE).select("*, site(*)");
