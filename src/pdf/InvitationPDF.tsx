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
    padding: "5%",
    fontSize: 12,
    display: "flex",
    gap: 15,
  },
  logo: {
    width: 120,
  },
});

interface Props {
  date: Moment;
  president: string;
  lieu: string;
  ordredujour: Array<string>;
}

export const InvitationPDF = ({
  date,
  president,
  lieu,
  ordredujour,
}: Props) => {
  return (
    <Document title={`AG ${date.year()} Invitation`}>
      <Page size="A4" style={styles.page}>
        <View>
          <Text>Chers Adhérents</Text>
        </View>
        <View>
          <Text>
            Le Président de l'AJC à le plaisir de vous inviter à notre assemblée
            générale annuelle qui se tiendra {lieu} le{" "}
            {date.format("dddd DD MMMM YYYY à HH:mm")}.
          </Text>
        </View>
        <View>
          <Text>L'ordre du jour sera le suivant :</Text>
        </View>
        <View>
          {ordredujour.map((el) => (
            <Text>- {el}</Text>
          ))}
        </View>
        <View>
          <Text>
            Nous vous demandons de bien vouloir vérifier et compléter le nouveau
            bulletin d’adhésion et de nous le remettre avec votre règlement.
            Nous en ferons la collecte en fin de réunion. En cas d'oubli il vous
            faudra les déposer en mairie ou faire un virement avec les
            coordonnées du RIB joint.
          </Text>
        </View>
        <View>
          <Text>
            Vous trouverez ci joints les différents documents nécessaires au bon
            déroulement de cette réunion. Par ailleurs, nous vous rappelons que
            si vous êtes dans l'impossibilité de participer à cette Assemblée
            Générale, vous pouvez vous faire représenter par un autre membre de
            l'association muni d'un pouvoir régulier.
          </Text>
        </View>
        <View>
          <Text>
            Cette année nous souhaiterions qu’un plus grand nombre d’adhérents
            puisse nous rejoindre dans le bureau pour participer aux décisions
            et orientations de l’association. N’hésitez donc pas à faire preuve
            de candidature lors de notre AG ou avant, vous serez les bienvenus.
          </Text>
        </View>
        <View>
          <Text>
            Nous espérons de tout cœur vous rencontrer et échanger lors de cette
            réunion autour du verre de l'amitié qui sera servi pour clore
            agréablement cette soirée.
          </Text>
        </View>
        <View>
          <Text>Cordialement.</Text>
        </View>
        <View>
          <Text>{president}, Président de l'AJC</Text>
        </View>
        <View>
          <Image src={logo} style={styles.logo} />
        </View>
        <View>
          <Text>Pièces jointes :</Text>
          <Text>- ODJ/Pouvoir</Text>
          <Text>- RIB</Text>
          <Text>- Bulletin d’adhésion</Text>
        </View>
      </Page>
    </Document>
  );
};
