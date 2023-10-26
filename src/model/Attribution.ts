import { Adherent } from "./Adherent";
import { Parcelle } from "./Parcelle";

export interface Attribution {
  id: number;
  annee: number;
  parcelle: Parcelle;
  adherent: Adherent;
}

export interface AttributionInsert {
  annee: number;
  parcelle: number;
  adherent: number;
}

export interface AttributionUpdate {
  id: number;
  annee: number;
  parcelle: number;
  adherent: number;
}
