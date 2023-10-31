import { groupBy } from "lodash";
import { Parcelle } from "../model/Parcelle";
import { ADHESION_PRIX, HeaderParcelle } from "../pages/admin/BilanPage";
import { Attribution } from "../model/Attribution";

export const calculPrixTotal = (
  parcelles: Array<Parcelle>,
  attributions: Array<Attribution>
) => {
  const attributionParParcelle = groupBy(
    attributions,
    (attribution) => attribution.parcelle.id
  );

  return (
    ADHESION_PRIX +
    parcelles.reduce((acc, value) => {
      const adherentParcelle = attributionParParcelle[value.id];
      return (
        acc +
        (value.prixpartage ? value.prix / adherentParcelle.length : value.prix)
      );
    }, 0)
  );
};

export const getPrixParcelleGroup = (
  header: HeaderParcelle,
  parcelles: Array<Parcelle>,
  attributions: Array<Attribution>
) => {
  const attributionParParcelle = groupBy(
    attributions,
    (attribution) => attribution.parcelle.id
  );
  const parcellesCorrespondante = parcelles.filter((parcelle) => {
    const isPartagee =
      attributionParParcelle[parcelle.id].length > 1 && parcelle.prixpartage;
    return header.partage
      ? parcelle.site.id === header.site.id &&
          parcelle.prixpartage &&
          isPartagee
      : parcelle.site.id === header.site.id &&
          parcelle.surface === header.surface &&
          parcelle.prix === header.prix &&
          (!isPartagee || !parcelle.prixpartage);
  });

  let prix =
    header.prix !== null ? parcellesCorrespondante.length * header.prix : 0;

  if (header.partage) {
    prix = parcellesCorrespondante.reduce((acc, value) => {
      const adherentParcelle = attributionParParcelle[value.id];
      return acc + value.prix / adherentParcelle.length;
    }, 0);
  }
  return prix;
};
