export interface Bilan {
  id: number;
  annee: number;
  lieu: string;
  date: Date;
  president: string;
  ordresdujour: Array<string>;
  resolutions: Array<string>;
}

export interface BilanUpdate {
  id: number;
  annee: number;
  lieu: string;
  date: Date;
  president: string;
  ordresdujour: Array<string>;
  resolutions: Array<string>;
}

export interface BilanInsert {
  annee: number;
  lieu: string;
  date: Date;
  president: string;
  ordresdujour: Array<string>;
  resolutions: Array<string>;
}
