export const sortByNom = (a: any, b: any) => a.nom.localeCompare(b.nom);

export const sortByAdherentNomAndPrenom = (a: any, b: any) =>
  a.adherent.nom.localeCompare(b.adherent.nom) ||
  a.adherent.prenom.localeCompare(b.adherent.prenom);

export const sortByNomAndPrenom = (a: any, b: any) =>
  a.nom.localeCompare(b.nom) || a.prenom.localeCompare(b.prenom);

export const sortBySiteNomAndNom = (a: any, b: any) =>
  a.site.nom.localeCompare(b.site.nom) || a.nom.localeCompare(b.nom);
