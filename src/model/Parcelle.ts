import { Site } from "./Site";

export interface Parcelle {
  id: number;
  nom: string;
  surface: number;
  prix: number;
  image: string | null;
  site: Site;
  prixpartage: boolean;
}

export interface ParcelleInsert {
  nom: string;
  site: number;
  surface: number;
  prix: number;
  image: string | null;
}

export interface ParcelleUpdate {
  image: string | null;
  id: number;
  nom: string;
  surface: number;
  prix: number;
  site: number;
}
