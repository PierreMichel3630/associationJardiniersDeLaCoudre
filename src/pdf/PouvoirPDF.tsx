import {
  Document,
  Text,
  Page,
  View,
  StyleSheet,
  Font,
} from "@react-pdf/renderer";
import { Moment } from "moment";
import { Adherent } from "../model/Adherent";

Font.register({
  family: "Open Sans",
  fonts: [
    {
      src: "https://cdn.jsdelivr.net/npm/open-sans-all@0.1.3/fonts/open-sans-regular.ttf",
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
    padding: 5,
    fontSize: 12,
    display: "flex",
    gap: 15,
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
  section: {
    display: "flex",
    gap: 10,
  },
  sectionresolution: {
    display: "flex",
    marginTop: 15,
  },
  sectionhorizontal: {
    display: "flex",
    flexDirection: "row",
    gap: 10,
    marginLeft: "20%",
  },
  titleresolution: {
    fontWeight: 700,
    padding: 10,
    border: "3px solid black",
  },
  titlemadataire: {
    fontWeight: 700,
    padding: 10,
    border: "3px solid black",
    marginLeft: "10%",
    marginRight: "10%",
  },
  titletable: {
    fontSize: 16,
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
  tableColMin: {
    width: 25,
    borderStyle: "solid",
    borderWidth: 1,
  },
  tableCol: {
    width: "25%",
    borderStyle: "solid",
    borderWidth: 1,
  },
  tableCell: {
    margin: "auto",
    marginTop: 5,
  },
  tableResolution: {
    display: "table",
    width: "auto",
  },
  tableRowResolution: {
    margin: "auto",
    flexDirection: "row",
  },
  tableColMinResolution: {
    width: 25,
    borderStyle: "solid",
    borderWidth: 1,
  },
  tableColResolution: {
    width: "80%",
    borderStyle: "solid",
    borderWidth: 1,
  },
  tableCellResolution: {
    margin: "auto",
    marginTop: 5,
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
  resolutions: Array<string>;
  lieu: string;
  adherent: Adherent;
}
export const PouvoirPDF = ({ resolutions, adherent, date, lieu }: Props) => {
  return (
    <Document
      title={`Pouvoir ${date.year()} - ${adherent.nom} ${adherent.prenom}`}
    >
      <Page size="A4" style={styles.page}>
        <View>
          <Text style={styles.title}>Pouvoir</Text>
        </View>
        <View style={styles.section}>
          <View>
            <Text style={styles.subtitle}>ORDRE DU JOUR</Text>
            <Text style={styles.subtitle}>DE L'ASSEMBLEE GENERALE</Text>
            <Text style={styles.subtitle}>
              DES JARDINIERS DE LA COUDRE (AJC)
            </Text>
          </View>
          <View>
            <Text style={styles.textcenter}>
              {date.format("dddd DD MMMM YYYY à HH:mm")}
            </Text>
            <Text style={styles.textcenter}>{lieu}</Text>
          </View>
          <View>
            <View style={styles.sectionhorizontal}>
              <Text style={styles.textunderline}>Membre :</Text>
              <Text style={styles.textbold}>
                {adherent.nom} {adherent.prenom}
              </Text>
            </View>
            <View style={styles.sectionhorizontal}>
              <Text style={styles.textunderline}>Adresse :</Text>
              <Text style={styles.textbold}>
                {adherent.adresse.adresse} {adherent.adresse.codepostal}{" "}
                {adherent.adresse.ville}
              </Text>
            </View>
          </View>
        </View>
        <View style={styles.tableResolution}>
          <View style={styles.tableRowResolution}>
            <View style={styles.tableColMinResolution}>
              <View style={styles.tableCellResolution}>
                <Text style={styles.titletable}>N°</Text>
              </View>
            </View>
            <View style={styles.tableColResolution}>
              <View style={styles.tableCellResolution}>
                <Text style={styles.titletable}>Résolutions</Text>
              </View>
            </View>
          </View>
          {resolutions.map((resolution, index) => (
            <View key={index} style={styles.tableRowResolution}>
              <View style={styles.tableColMinResolution}>
                <Text style={styles.tableCellResolution}>{index}</Text>
              </View>
              <View style={styles.tableColResolution}>
                <Text style={styles.tableCellResolution}>{resolution}</Text>
              </View>
            </View>
          ))}
        </View>
        <View>
          <Text style={styles.titlemadataire}>Mandataire:</Text>
        </View>
        <View>
          <Text style={styles.subtitle}>DELEGATION DE VOTE</Text>
        </View>

        <View style={styles.table}>
          <View style={styles.tableRow}>
            <View style={styles.tableColMin}></View>
            <View style={styles.tableCol}>
              <Text style={styles.tableCell}>POUR</Text>
            </View>
            <View style={styles.tableCol}>
              <Text style={styles.tableCell}>CONTRE</Text>
            </View>
            <View style={styles.tableCol}>
              <Text style={styles.tableCell}>ABSTENTION</Text>
            </View>
          </View>
          {resolutions.map((_, index) => (
            <View key={index} style={styles.tableRow}>
              <View style={styles.tableColMin}>
                <Text style={styles.tableCell}>{index}</Text>
              </View>
              <View style={styles.tableCol}></View>
              <View style={styles.tableCol}></View>
              <View style={styles.tableCol}></View>
            </View>
          ))}
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
      </Page>
    </Document>
  );
};
