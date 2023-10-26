import { SiteInsert, SiteUpdate } from "../model/Site";
import { supabase } from "./commun";

export const SUPABASE_SITE_TABLE = "site";

export const insertSite = (value: SiteInsert) =>
  supabase.from(SUPABASE_SITE_TABLE).insert(value).select().single();

export const updateSite = (value: SiteUpdate) =>
  supabase
    .from(SUPABASE_SITE_TABLE)
    .update(value)
    .eq("id", value.id)
    .select()
    .single();

export const getAllSite = () =>
  supabase.from(SUPABASE_SITE_TABLE).select("*, adresse!inner(*)");
