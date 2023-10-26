import { Adresse } from "./Adresse";

export interface Adherent {
  id: number;
  nom: string;
  prenom: string;
  mail: string;
  adresse: Adresse;
  telephone: string;
  conjointnom: string;
  conjointprenom: string;
}

export interface AdherentInsert {
  nom: string;
  prenom: string;
  mail: string;
  adresse: number;
  telephone: string;
  conjointnom: string;
  conjointprenom: string;
}

export interface AdherentUpdate {
  id: number;
  nom: string;
  prenom: string;
  mail: string;
  adresse: number;
  telephone: string;
  conjointnom: string;
  conjointprenom: string;
}
