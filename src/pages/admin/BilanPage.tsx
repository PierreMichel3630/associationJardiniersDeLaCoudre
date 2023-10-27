import {
  Button,
  Checkbox,
  Divider,
  Grid,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import { DatePicker, DateTimeField } from "@mui/x-date-pickers";
import { groupBy } from "lodash";
import moment, { Moment } from "moment";
import { useEffect, useState } from "react";
import { getAttributionParAnnee } from "../../api/attribution";
import { getBilanByAnnee, insertBilan, updateBilan } from "../../api/bilan";
import { getAllParcelle } from "../../api/parcelle";
import { InputListText } from "../../components/InputListText";
import { ApercuPDFDialog } from "../../components/dialog/ApercuPDFDialog";
import { Adherent } from "../../model/Adherent";
import { Attribution } from "../../model/Attribution";
import { Bilan, BilanInsert, BilanUpdate } from "../../model/Bilan";
import { Parcelle } from "../../model/Parcelle";
import { Site } from "../../model/Site";
import emailjs from "@emailjs/browser";
import { PouvoirPDF } from "../../pdf/PouvoirPDF";

interface Row {
  adherent: Adherent;
  parcelles: Array<Parcelle>;
}

export interface HeaderParcelle {
  site: Site;
  surface: number | null;
  prix: number | null;
  nom: string;
  partage: boolean;
}
export const ADHESION_PRIX = 5;
export const BilanPage = () => {
  const [annee, setAnnee] = useState<Moment>(moment());
  const bilanDefault = {
    annee: annee.year(),
    lieu: "Salle des sources 49170 Saint Léger des bois",
    date: new Date(),
    president: "Stéphane Police",
    ordresdujour: [
      "Rapport Moral du Président",
      `Rapport Financier du Trésorier ${annee.year() - 1} et ${annee.year()}`,
      "Election des Membres du Conseil d'Administration",
      "Questions Diverses",
    ],
    resolutions: [
      "Election Président & Secrétaire & Scrutateur de la Séance",
      "Bilan Moral",
      `Validation des Comptes ${annee.year() - 1}`,
      `Validation des Comptes ${annee.year()}`,
      "Démissions et Elections Membres du Bureau",
      "Questions ouvertes sans vote",
    ],
  };
  const [bilan, setBilan] = useState<Bilan | null>(null);
  const [attributions, setAttributions] = useState<Array<Attribution>>([]);
  const [parcelles, setParcelles] = useState<Array<Parcelle>>([]);
  const [checked, setChecked] = useState<Array<number>>([]);
  const [allChecked, setAllChecked] = useState(false);

  const [openModal, setOpenModal] = useState(false);
  const [selectAdherent, setSelectAdherent] = useState<null | Adherent>(null);

  const getBilan = async () => {
    const { data } = await getBilanByAnnee(annee.year());
    setBilan(data as Bilan);
  };

  const modifierBilan = async (champ: string, value: any) => {
    if (bilan !== null) {
      const bilanUpdate: BilanUpdate = {
        ...bilan,
        annee: annee.year(),
        [champ]: value,
      };
      const { data } = await updateBilan(bilanUpdate);
      setBilan(data as Bilan);
    } else {
      const bilanInsert: BilanInsert = {
        ...bilanDefault,
        annee: annee.year(),
        [champ]: value,
      };
      const { data } = await insertBilan(bilanInsert);
      setBilan(data as Bilan);
    }
  };

  useEffect(() => {
    getBilan();
  }, [annee]);

  const getParcelles = async () => {
    const { data } = await getAllParcelle();
    setParcelles(data as Array<Parcelle>);
  };

  useEffect(() => {
    getParcelles();
  }, []);

  const getAttributions = async () => {
    const { data } = await getAttributionParAnnee(
      annee ? annee.year() : moment().year()
    );
    setAttributions(data as Array<Attribution>);
  };

  useEffect(() => {
    getAttributions();
  }, [annee]);

  const selectionnerTout = () => {
    setChecked(allChecked ? [] : [...rows.map((el) => el.adherent.id)]);
    setAllChecked((prev) => !prev);
  };

  const attributionParParcelle = groupBy(
    attributions,
    (attribution) => attribution.parcelle.id
  );

  const parcellesParSite = groupBy(parcelles, (parcelle) => parcelle.site.id);

  const headersParcelle = Object.entries(parcellesParSite).reduce(
    (acc, [_, value]) => {
      const parcelleParSurfacePrix = groupBy(
        value,
        (parcelle) => `${parcelle.surface}-${parcelle.prix}`
      );
      const headerParcelleSite = Object.entries(parcelleParSurfacePrix).reduce(
        (accParcelleSite, [_, valueParcelleSite]) => [
          ...accParcelleSite,
          {
            site: valueParcelleSite[0].site,
            surface: valueParcelleSite[0].surface,
            prix: valueParcelleSite[0].prix,
            nom: valueParcelleSite[0].nom,
            partage: false,
          },
        ],
        [] as Array<HeaderParcelle>
      );
      return [
        ...acc,
        ...headerParcelleSite,
        {
          site: value[0].site,
          surface: null,
          prix: null,
          nom: "Parcelle Partagée",
          partage: true,
        },
      ];
    },
    [] as Array<HeaderParcelle>
  );
  const headers = [
    <Checkbox
      checked={allChecked}
      onChange={(_: React.ChangeEvent<HTMLInputElement>) => selectionnerTout()}
    />,
    <Typography variant="h6"></Typography>,
    <Typography variant="h6">Adhésion</Typography>,
    ...headersParcelle.map((el) => (
      <>
        <Typography variant="h6">{`${el.site.nom} - ${
          el.surface !== null ? `${el.surface}m2` : el.nom
        }`}</Typography>
        {el.prix !== null && (
          <Typography variant="body1">{el.prix} €</Typography>
        )}
      </>
    )),
    <Typography variant="h4">Total</Typography>,
    <Typography variant="h4"></Typography>,
  ];

  const parcellesByAdherent = groupBy(
    attributions,
    (attribution) => attribution.adherent.id
  );
  const rows = Object.entries(parcellesByAdherent).reduce((acc, [_, value]) => {
    const adherent = value[0].adherent;
    const parcelles = value.map((el) => el.parcelle);
    return [...acc, { adherent, parcelles }];
  }, [] as Array<Row>);

  const handleChecked = (id: number) => {
    setAllChecked(false);
    setChecked((prev) =>
      prev.includes(id) ? [...prev].filter((el) => el !== id) : [...prev, id]
    );
  };

  const sendAllEmail = () => {
    checked.forEach((idAdherent) => {
      const row = rows.find((el) => el.adherent.id === idAdherent);
      if (row) {
        const anneeBilan = annee.year();
        const date = moment(bilan !== null ? bilan.date : bilanDefault.date);
        const ordresdujour =
          bilan !== null ? bilan.ordresdujour : bilanDefault.ordresdujour;
        const resolutions =
          bilan !== null ? bilan.resolutions : bilanDefault.resolutions;
        const president =
          bilan !== null ? bilan.president : bilanDefault.president;
        const lieu = bilan !== null ? bilan.lieu : bilanDefault.lieu;

        const pdf1 = (
          <PouvoirPDF
            date={date}
            lieu={lieu}
            resolutions={resolutions}
            adherent={row.adherent}
          />
        );

        emailjs.send("service_ij665ye", "template_xbe0gk4", {
          annee: anneeBilan,
          nom: `${row.adherent.prenom} ${row.adherent.nom}`,
          to: row.adherent.mail,
          lieu: lieu,
          date: date.format("dddd DD MMMM YYYY à HH:mm"),
        });
      }
    });
    setChecked([]);
  };

  return (
    <Grid container spacing={3}>
      <Grid item xs={12} sx={{ textAlign: "center" }}>
        <Typography variant="h2">Bilan</Typography>
      </Grid>
      <Grid item xs={12} sx={{ justifyContent: "center", display: "flex" }}>
        <DatePicker
          value={annee}
          onChange={(newValue) => {
            if (newValue !== null) setAnnee(newValue);
          }}
          label="Année"
          views={["year"]}
        />
      </Grid>
      <Grid item xs={12} sx={{ textAlign: "center" }}>
        <Typography variant="h2">Assemblé Général</Typography>
      </Grid>
      <Grid item xs={6}>
        <TextField
          size="small"
          label="Lieu"
          fullWidth
          value={bilan !== null ? bilan.lieu : bilanDefault.lieu}
          onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
            modifierBilan("lieu", event.target.value);
          }}
        />
      </Grid>
      <Grid item xs={6}>
        <DateTimeField
          label="Date"
          value={moment(bilan !== null ? bilan.date : bilanDefault.date)}
          onChange={(newValue) => {
            if (newValue !== null) modifierBilan("date", newValue.toDate());
          }}
          format="DD/MM/YYYY HH:mm"
          size="small"
          fullWidth
        />
      </Grid>
      <Grid item xs={12}>
        <TextField
          size="small"
          label="Président"
          fullWidth
          value={bilan !== null ? bilan.president : bilanDefault.president}
          onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
            modifierBilan("president", event.target.value);
          }}
        />
      </Grid>
      <Grid item xs={12}>
        <Divider />
      </Grid>
      <Grid item xs={12} sx={{ textAlign: "center" }}>
        <Typography variant="h2">Résolutions</Typography>
      </Grid>
      <Grid item xs={12}>
        <InputListText
          values={bilan !== null ? bilan.resolutions : bilanDefault.resolutions}
          onChange={(value) => modifierBilan("resolutions", value)}
        />
      </Grid>
      <Grid item xs={12}>
        <Divider />
      </Grid>
      <Grid item xs={12} sx={{ textAlign: "center" }}>
        <Typography variant="h2">Ordre du jour</Typography>
      </Grid>
      <Grid item xs={12}>
        <InputListText
          values={
            bilan !== null ? bilan.ordresdujour : bilanDefault.ordresdujour
          }
          onChange={(value) => modifierBilan("ordresdujour", value)}
        />
      </Grid>
      <Grid item xs={12}>
        <Divider />
      </Grid>
      <Grid item xs={12}>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                {headers.map((header, index) => (
                  <TableCell key={index} align="center">
                    {header}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.map((row) => (
                <TableRow key={row.adherent.id}>
                  <TableCell component="th" scope="row">
                    <Checkbox
                      checked={checked.includes(row.adherent.id)}
                      onChange={(_: React.ChangeEvent<HTMLInputElement>) =>
                        handleChecked(row.adherent.id)
                      }
                    />
                  </TableCell>
                  <TableCell component="th" scope="row">
                    <Typography variant="h6">
                      {`${row.adherent.prenom} ${row.adherent.nom} ${
                        row.adherent.conjointnom !== ""
                          ? `et ${row.adherent.conjointprenom} ${row.adherent.conjointnom}`
                          : ""
                      }`}
                    </Typography>
                  </TableCell>
                  <TableCell component="th" scope="row" align="center">
                    {ADHESION_PRIX} €
                  </TableCell>
                  {headersParcelle.map((el, index) => {
                    const parcellesCorrespondante = row.parcelles.filter(
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
                      el.prix !== null
                        ? parcellesCorrespondante.length * el.prix
                        : 0;
                    if (el.partage) {
                      prix = parcellesCorrespondante.reduce((acc, value) => {
                        const adherentParcelle =
                          attributionParParcelle[value.id];
                        return acc + value.prix / adherentParcelle.length;
                      }, 0);
                    }
                    return (
                      <TableCell
                        key={index}
                        component="th"
                        scope="row"
                        align="center"
                      >
                        {prix === 0 ? `X` : `${prix} €`}
                      </TableCell>
                    );
                  })}
                  <TableCell component="th" scope="row" align="center">
                    {ADHESION_PRIX +
                      row.parcelles.reduce((acc, value) => {
                        const adherentParcelle =
                          attributionParParcelle[value.id];
                        return acc + value.prix / adherentParcelle.length;
                      }, 0)}{" "}
                    €
                  </TableCell>
                  <TableCell component="th" scope="row">
                    <Button
                      fullWidth
                      variant="contained"
                      color="secondary"
                      onClick={() => {
                        setSelectAdherent(row.adherent);
                        setOpenModal(true);
                      }}
                    >
                      Aperçu email
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Grid>
      <Grid item xs={12}>
        <Button
          fullWidth
          variant="contained"
          color="secondary"
          onClick={() => sendAllEmail()}
        >
          Envoyer les email
        </Button>
      </Grid>

      {selectAdherent !== null && annee !== null && (
        <ApercuPDFDialog
          open={openModal}
          adherent={selectAdherent}
          close={() => {
            setOpenModal(false);
            setSelectAdherent(null);
          }}
          headersParcelle={headersParcelle}
          attributions={attributions}
          date={moment(bilan !== null ? bilan.date : bilanDefault.date)}
          ordresdujour={
            bilan !== null ? bilan.ordresdujour : bilanDefault.ordresdujour
          }
          resolutions={
            bilan !== null ? bilan.resolutions : bilanDefault.resolutions
          }
          president={bilan !== null ? bilan.president : bilanDefault.president}
          lieu={bilan !== null ? bilan.lieu : bilanDefault.lieu}
        />
      )}
    </Grid>
  );
};
