export interface Adresse {
  id: number;
  adresse: string;
  codepostal: string;
  ville: string;
}

export interface AdresseUpdate {
  id: number;
  adresse: string;
  codepostal: string;
  ville: string;
}

export interface AdresseInsert {
  adresse: string;
  codepostal: string;
  ville: string;
}
