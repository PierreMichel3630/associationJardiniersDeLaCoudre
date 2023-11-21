import { Html } from "@react-email/html";
import { Text } from "@react-email/text";

import { Adherent } from "../model/Adherent";

interface Props {
  adherent: Adherent;
  lieu: string;
  date: string;
  annee: number;
}

export const EmailAG = ({ adherent, lieu, date, annee }: Props) => (
  <Html lang="fr">
    <Text>
      Cher {adherent.prenom} {adherent.nom},
    </Text>
    <Text>
      Nous vous invitons par la présente à notre Assemblée Générale {annee} qui
      se tiendra {lieu} le {date}.
    </Text>
    <Text>
      Vous trouverez en pièces attachées tous les éléments nécessaires à notre
      réunion. Nous vous attendons impatiemment et espérons vous rencontrez à
      notre rendez-vous annuel.
    </Text>
    <Text>Cordialement, Le Bureau de l'AJC</Text>
  </Html>
);

export const EmailAGText = (
  adherent: Adherent,
  annee: number,
  lieu: string,
  date: string
) =>
  `Cher ${adherent.prenom} ${adherent.nom},%0D%0A %0D%0A Nous vous invitons par la présente à notre Assemblée Générale ${annee} qui se tiendra ${lieu} le ${date}.%0D%0A Vous trouverez en pièces attachées tous les éléments nécessaires à notre réunion. Nous vous attendons impatiemment et espérons vous rencontrez à notre rendez-vous annuel.%0D%0A %0D%0A Cordialement, Le Bureau de l'AJC`;
