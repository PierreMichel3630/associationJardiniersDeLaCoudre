import { supabase } from "./commun";

export const URL_FILE =
  "https://klvzqffhdonzxeqygvqn.supabase.co/storage/v1/object/public/";
export const BUCKET_IMAGE = "jdc";

export const storeFile = (bucket: string, filePath: string, file: File) =>
  supabase.storage.from(bucket).upload(filePath, file);

export const deleteFile = (bucket: string, name: string) =>
  supabase.storage.from(bucket).remove([name]);

export const getUrlImage = (name: string) =>
  URL_FILE + BUCKET_IMAGE + "/" + name;
