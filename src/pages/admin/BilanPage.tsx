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
import ReactPDF from "@react-pdf/renderer";
import { groupBy } from "lodash";
import moment, { Moment } from "moment";
import { useEffect, useState } from "react";
import { getAttributionParAnnee } from "../../api/attribution";
import { getBilanByAnnee, insertBilan, updateBilan } from "../../api/bilan";
import { getAllParcelle } from "../../api/parcelle";
import { InputListText } from "../../components/InputListText";
import { ApercuPDFDialog } from "../../components/dialog/ApercuPDFDialog";
import { EmailAGText } from "../../email/EmailAG";
import { Adherent } from "../../model/Adherent";
import { Attribution } from "../../model/Attribution";
import { Bilan, BilanInsert, BilanUpdate } from "../../model/Bilan";
import { Parcelle } from "../../model/Parcelle";
import { Site } from "../../model/Site";
import { AdhPDF } from "../../pdf/AdhPDF";
import { InvitationPDF } from "../../pdf/InvitationPDF";
import { PouvoirPDF } from "../../pdf/PouvoirPDF";
import { calculPrixTotal, getPrixParcelleGroup } from "../../utils/bilan";
import { getLabelAdherent } from "../../utils/get";
import { openMail } from "../../utils/navigation";
import { sortByAdherentNomAndPrenom } from "../../utils/sort";
import { saveAs } from "file-saver";
import JSZip from "jszip";

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
    if (data !== null) {
      setBilan(data as Bilan);
    } else {
      const bilanInsert: BilanInsert = {
        ...bilanDefault,
        annee: annee.year(),
      };
      const { data } = await insertBilan(bilanInsert);
      setBilan(data as Bilan);
    }
  };

  const modifierBilan = async (champ: string, value: any) => {
    if (bilan !== null) {
      const bilanUpdate: BilanUpdate = {
        ...bilan,
        annee: annee.year(),
        [champ]: value,
      };
      setBilan(bilanUpdate);
    }
  };

  const enregistrerBilan = async () => {
    if (bilan !== null) {
      await updateBilan(bilan);
    }
  };

  useEffect(() => {
    getBilan();
  }, [annee]);

  useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
      enregistrerBilan();
    }, 1000);

    return () => clearTimeout(delayDebounceFn);
  }, [bilan]);

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

      const isSitePartagee = value.reduce(
        (acc, el) => acc && el.prixpartage,
        true
      );

      return isSitePartagee
        ? [
            ...acc,
            ...headerParcelleSite,
            {
              site: value[0].site,
              surface: null,
              prix: null,
              nom: "Parcelle Partagée",
              partage: true,
            },
          ]
        : [...acc, ...headerParcelleSite];
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
    <Typography variant="h4"></Typography>,
  ];

  const parcellesByAdherent = groupBy(
    attributions,
    (attribution) => attribution.adherent.id
  );
  const rows = Object.entries(parcellesByAdherent)
    .reduce((acc, [_, value]) => {
      const adherent = value[0].adherent;
      const parcelles = value.map((el) => el.parcelle);
      return [...acc, { adherent, parcelles }];
    }, [] as Array<Row>)
    .filter((el) => el.adherent.nom !== "1/2 parcelle")
    .sort(sortByAdherentNomAndPrenom);

  const handleChecked = (id: number) => {
    setAllChecked(false);
    setChecked((prev) =>
      prev.includes(id) ? [...prev].filter((el) => el !== id) : [...prev, id]
    );
  };

  const sendEmail = (id: number) => {
    const row = rows.find((el) => el.adherent.id === id);
    if (row) {
      const date = moment(bilan !== null ? bilan.date : bilanDefault.date);
      const lieu = bilan !== null ? bilan.lieu : bilanDefault.lieu;

      openMail(
        row.adherent.mail,
        `Jardiniers de la Coudre - AG ${annee.year()}`,
        EmailAGText(
          row.adherent,
          annee.year(),
          lieu,
          date.format("dddd DD MMMM YYYY à HH:mm")
        )
      );
    }
  };

  const sendAllEmail = () => {
    checked.forEach(async (idAdherent) => {
      const row = rows.find((el) => el.adherent.id === idAdherent);
      if (row) {
        const date = moment(bilan !== null ? bilan.date : bilanDefault.date);
        const lieu = bilan !== null ? bilan.lieu : bilanDefault.lieu;

        openMail(
          row.adherent.mail,
          `Jardiniers de la Coudre - AG ${annee.year()}`,
          EmailAGText(
            row.adherent,
            annee.year(),
            lieu,
            date.format("dddd DD MMMM YYYY à HH:mm")
          )
        );
      }
    });
    setChecked([]);
  };

  const generatePDF = async () => {
    const zip = new JSZip();
    const date = moment(bilan !== null ? bilan.date : bilanDefault.date);

    await checked.reduce(async (promise, idAdherent) => {
      await promise;
      const row = rows.find((el) => el.adherent.id === idAdherent);
      if (row) {
        const nomPrenom = `${row.adherent.nom.toUpperCase()} ${
          row.adherent.prenom
        }`;
        const ordresdujour =
          bilan !== null ? bilan.ordresdujour : bilanDefault.ordresdujour;
        const resolutions =
          bilan !== null ? bilan.resolutions : bilanDefault.resolutions;
        const president =
          bilan !== null ? bilan.president : bilanDefault.president;
        const lieu = bilan !== null ? bilan.lieu : bilanDefault.lieu;

        const blob1 = await ReactPDF.pdf(
          <PouvoirPDF
            date={date}
            lieu={lieu}
            resolutions={resolutions}
            adherent={row.adherent}
          />
        ).toBlob();

        const blob2 = await ReactPDF.pdf(
          <InvitationPDF
            date={date}
            president={president}
            lieu={lieu}
            ordredujour={ordresdujour}
          />
        ).toBlob();

        const blob3 = await ReactPDF.pdf(
          <AdhPDF
            date={date}
            adherent={row.adherent}
            attributions={attributions}
            headersParcelle={headersParcelle}
          />
        ).toBlob();
        zip.file(`${nomPrenom}/Pouvoir ${date.year()}.pdf`, blob1);
        zip.file(`${nomPrenom}/AG ${date.year()} Invitation.pdf`, blob2);
        zip.file(`${nomPrenom}/ADH ${date.year()}.pdf`, blob3);
      }
    }, Promise.resolve());
    zip.generateAsync({ type: "blob" }).then((content) => {
      saveAs(content, `AG${date.year()}.zip`);
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
                      {getLabelAdherent(row.adherent)}
                    </Typography>
                  </TableCell>
                  <TableCell component="th" scope="row" align="center">
                    {ADHESION_PRIX} €
                  </TableCell>
                  {headersParcelle.map((el, index) => {
                    const prix = getPrixParcelleGroup(
                      el,
                      row.parcelles,
                      attributions
                    );
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
                    <Typography variant="h4" noWrap>
                      {calculPrixTotal(row.parcelles, attributions)} €
                    </Typography>
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
                  <TableCell component="th" scope="row">
                    <Button
                      fullWidth
                      variant="contained"
                      color="secondary"
                      onClick={() => sendEmail(row.adherent.id)}
                    >
                      Envoie email
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Grid>
      <Grid item xs={6}>
        <Button
          fullWidth
          variant="contained"
          color="secondary"
          onClick={() => generatePDF()}
        >
          Générer les PDFS
        </Button>
      </Grid>
      <Grid item xs={6}>
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
