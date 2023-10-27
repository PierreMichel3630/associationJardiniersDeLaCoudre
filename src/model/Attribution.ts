import { Adherent } from "./Adherent";
import { ParcelleNotJoin } from "./Parcelle";

export interface Attribution {
  id: number;
  annee: number;
  parcelle: ParcelleNotJoin;
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
