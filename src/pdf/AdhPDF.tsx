import {
  Document,
  Font,
  Page,
  StyleSheet,
  Text,
  Image,
  View,
} from "@react-pdf/renderer";
import { Moment } from "moment";

import logo from "../assets/logo.png";
import { Adherent } from "../model/Adherent";
import { Attribution } from "../model/Attribution";
import { ADHESION_PRIX, HeaderParcelle } from "../pages/admin/BilanPage";
import { groupBy } from "lodash";

Font.register({
  family: "Open Sans",
  fonts: [
    {
      src: "https://cdn.jsdelivr.net/npm/open-sans-all@0.1.3/fonts/open-sans-regular.ttf",
    },
    {
      src: "https://cdn.jsdelivr.net/npm/open-sans-all@0.1.3/fonts/open-sans-300.ttf",
      fontWeight: 300,
    },
    {
      src: "https://cdn.jsdelivr.net/npm/open-sans-all@0.1.3/fonts/open-sans-700.ttf",
      fontWeight: 700,
    },
    {
      src: "https://cdn.jsdelivr.net/npm/open-sans-all@0.1.3/fonts/open-sans-800.ttf",
      fontWeight: 800,
    },
  ],
});

const styles = StyleSheet.create({
  page: {
    fontFamily: "Open Sans",
    padding: "5%",
    fontSize: 12,
    display: "flex",
    gap: 20,
  },
  title: {
    fontSize: 20,
    padding: 10,
    border: "3px solid black",
    textAlign: "center",
    fontWeight: 800,
  },
  subtitle: {
    fontSize: 16,
    textAlign: "center",
    fontWeight: 700,
  },
  textcenter: {
    textAlign: "center",
  },
  textunderline: {
    fontSize: 12,
    textDecoration: "underline",
  },
  textbold: {
    fontSize: 12,
    fontWeight: 700,
  },
  textsmall: {
    fontSize: 10,
    fontWeight: 300,
  },
  logo: {
    width: 120,
  },
  sectionhorizontal: {
    display: "flex",
    flexDirection: "row",
    gap: 20,
    alignItems: "center",
  },
  tableCell: {
    margin: "auto",
    marginTop: 5,
    fontWeight: 700,
  },
  table: {
    display: "table",
    width: "auto",
  },
  tableRow: {
    margin: "auto",
    flexDirection: "row",
  },
  tableColMinNoBorder: {
    width: 25,
  },
  tableColMin: {
    width: 25,
    borderStyle: "solid",
    borderWidth: 1,
  },
  tableColPrix: {
    width: 60,
    borderStyle: "solid",
    borderWidth: 1,
  },
  tableCol: {
    width: "50%",
    borderStyle: "solid",
    borderWidth: 1,
  },
  tableColSignature: {
    width: "40%",
    borderStyle: "solid",
    borderWidth: 1,
  },
  tableColSignatureHeight: {
    width: "40%",
    borderStyle: "solid",
    borderWidth: 1,
    height: 65,
  },
});

interface Props {
  date: Moment;
  adherent: Adherent;
  attributions: Array<Attribution>;
  headersParcelle: Array<HeaderParcelle>;
}

export const AdhPDF = ({
  date,
  adherent,
  attributions,
  headersParcelle,
}: Props) => {
  const parcellesAdherent = attributions
    .filter((attribution) => attribution.adherent.id === adherent.id)
    .map((el) => el.parcelle);

  const attributionParParcelle = groupBy(
    attributions,
    (attribution) => attribution.parcelle.id
  );

  return (
    <Document title={`AG ${date.year()} Invitation`}>
      <Page size="A4" style={styles.page}>
        <View style={styles.sectionhorizontal}>
          <Image src={logo} style={styles.logo} />
          <Text style={styles.subtitle}>
            Association des Jardiniers de la Coudre
          </Text>
        </View>
        <View>
          <Text style={styles.title}>
            Fiche d'Adhésion Saison {date.year()} - {date.year() + 1}
          </Text>
        </View>
        <View>
          <View style={styles.sectionhorizontal}>
            <Text style={styles.textunderline}>Adhérent :</Text>
            <Text style={styles.textbold}>
              {adherent.prenom} {adherent.nom}
            </Text>
          </View>
          {adherent.conjointprenom !== "" ||
            (adherent.conjointnom !== "" && (
              <View style={styles.sectionhorizontal}>
                <Text style={styles.textunderline}>Conjoint :</Text>
                <Text style={styles.textbold}>
                  {adherent.conjointprenom} {adherent.conjointnom}
                </Text>
              </View>
            ))}
          <View style={styles.sectionhorizontal}>
            <Text style={styles.textunderline}>Adresse :</Text>
            <Text style={styles.textbold}>
              {adherent.adresse.adresse} {adherent.adresse.codepostal}{" "}
              {adherent.adresse.ville}
            </Text>
          </View>
          <View style={styles.sectionhorizontal}>
            <Text style={styles.textunderline}>Téléphone :</Text>
            <Text style={styles.textbold}>{adherent.telephone}</Text>
          </View>
          <View style={styles.sectionhorizontal}>
            <Text style={styles.textunderline}>Adresse mail :</Text>
            <Text style={styles.textbold}>{adherent.mail}</Text>
          </View>
          <View style={styles.sectionhorizontal}>
            <Text style={styles.textunderline}>Parcelle :</Text>
            <Text style={styles.textbold}>
              {parcellesAdherent.map((el) => el.nom).join(",")}
            </Text>
          </View>
        </View>
        <View style={styles.textcenter}>
          <Text>Cochez, la ou les cases correspondant à vos activités</Text>
        </View>
        <View style={styles.table}>
          <View style={styles.tableRow}>
            <View style={styles.tableColMin}>
              <Text style={styles.tableCell}>X</Text>
            </View>
            <View style={styles.tableCol}>
              <Text style={styles.tableCell}>Adhésion</Text>
            </View>
            <View style={styles.tableColPrix}>
              <Text style={styles.tableCell}> {ADHESION_PRIX} €</Text>
            </View>
          </View>
          {headersParcelle.map((el, index) => {
            const parcellesCorrespondante = parcellesAdherent.filter(
              (parcelle) => {
                const isPartagee =
                  attributionParParcelle[parcelle.id].length > 1;
                return el.partage
                  ? parcelle.site.id === el.site.id && isPartagee
                  : parcelle.site.id === el.site.id &&
                      parcelle.surface === el.surface &&
                      parcelle.prix === el.prix &&
                      !isPartagee;
              }
            );
            let prix =
              el.prix !== null ? parcellesCorrespondante.length * el.prix : 0;
            if (el.partage) {
              prix = parcellesCorrespondante.reduce((acc, value) => {
                const adherentParcelle = attributionParParcelle[value.id];
                return acc + value.prix / adherentParcelle.length;
              }, 0);
            }
            return (
              <View style={styles.tableRow} key={index}>
                <View style={styles.tableColMin}>
                  <Text style={styles.tableCell}>{prix === 0 ? "" : "X"}</Text>
                </View>
                <View style={styles.tableCol}>
                  <View style={styles.tableCell}>
                    <View style={styles.sectionhorizontal}>
                      <Text>{`${el.site.nom} - ${
                        el.surface !== null ? `${el.surface}m2` : el.nom
                      }`}</Text>
                      {el.prix !== null && (
                        <Text style={styles.textsmall}>{`(${el.prix} €)`}</Text>
                      )}
                    </View>
                  </View>
                </View>
                <View style={styles.tableColPrix}>
                  <Text style={styles.tableCell}>
                    {prix === 0 ? "" : `${prix}€`}
                  </Text>
                </View>
              </View>
            );
          })}
          <View style={styles.tableRow}>
            <View style={styles.tableColMinNoBorder}></View>
            <View style={styles.tableCol}>
              <Text style={styles.tableCell}>Total</Text>
            </View>

            <View style={styles.tableColPrix}>
              <Text style={styles.tableCell}>
                {ADHESION_PRIX +
                  parcellesAdherent.reduce((acc, value) => {
                    const adherentParcelle = attributionParParcelle[value.id];
                    return acc + value.prix / adherentParcelle.length;
                  }, 0)}{" "}
                €
              </Text>
            </View>
          </View>
        </View>
        <View style={styles.table}>
          <View style={styles.tableRow}>
            <View style={styles.tableColSignature}>
              <Text style={styles.tableCell}>Date</Text>
            </View>
            <View style={styles.tableColSignature}>
              <Text style={styles.tableCell}>Signature</Text>
            </View>
          </View>
          <View style={styles.tableRow}>
            <View style={styles.tableColSignatureHeight}>
              <Text style={styles.tableCell}></Text>
            </View>
            <View style={styles.tableColSignatureHeight}>
              <Text style={styles.tableCell}></Text>
            </View>
          </View>
        </View>
        <View style={styles.textcenter}>
          <Text style={styles.textbold}>
            Règlement par chèque bancaire à l’ordre d’ « AJC »
          </Text>
          <Text style={styles.textbold}>
            Pour la collocation prendre l’autre formulaire
          </Text>
        </View>
      </Page>
    </Document>
  );
};
