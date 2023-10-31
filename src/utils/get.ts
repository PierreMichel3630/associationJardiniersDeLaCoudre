import { Adherent } from "../model/Adherent";

export const getLabelAdherent = (adherent: Adherent) =>
  `${adherent.nom !== null ? adherent.nom.toUpperCase() : ""} ${
    adherent.prenom !== null ? adherent.prenom : ""
  }  ${
    adherent.conjointnom !== "" && adherent.conjointnom !== null
      ? `et ${adherent.conjointnom.toUpperCase()} ${adherent.conjointprenom}`
      : ""
  }`;
