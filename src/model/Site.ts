import { Adresse } from "./Adresse";

export interface Site {
  id: number;
  nom: string;
  image: string | null;
  adresse: Adresse;
}

export interface SiteInsert {
  nom: string;
  adresse: number;
  image: string | null;
}

export interface SiteUpdate {
  image: string | null;
  id: number;
  nom: string;
  adresse: number;
}
