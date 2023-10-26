import { Grid, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { Parcelle } from "../../model/Parcelle";
import { getAllParcelle } from "../../api/parcelle";
import { CardGestionParcelle } from "../../components/card/CardParcelle";
import { DatePicker } from "@mui/x-date-pickers";
import moment, { Moment } from "moment";
import { AddAdherentDialog } from "../../components/dialog/AddAdherentDialog";
import { getAttributionParAnnee } from "../../api/attribution";
import { Attribution } from "../../model/Attribution";

export const GestionAttributionsPage = () => {
  const [annee, setAnnee] = useState<Moment | null>(moment());
  const [parcelles, setParcelles] = useState<Array<Parcelle>>([]);
  const [openModal, setOpenModal] = useState(false);
  const [parcelle, setParcelle] = useState<Parcelle | null>(null);
  const [attributions, setAttributions] = useState<Array<Attribution>>([]);

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

  return (
    <Grid container spacing={2}>
      <Grid item xs={12} sx={{ textAlign: "center" }}>
        <Typography variant="h2">Gestion des attributions</Typography>
      </Grid>
      <Grid item xs={12} sx={{ justifyContent: "center", display: "flex" }}>
        <DatePicker
          value={annee}
          onChange={(newValue) => setAnnee(newValue)}
          label="Année"
          views={["year"]}
        />
      </Grid>
      {parcelles.map((parcelle) => (
        <Grid item xs={12} key={parcelle.id}>
          <CardGestionParcelle
            attributions={attributions.filter(
              (el) => el.parcelle.id === parcelle.id
            )}
            parcelle={parcelle}
            addAdherent={() => {
              setParcelle(parcelle);
              setOpenModal(true);
            }}
            onDelete={() => getAttributions()}
          />
        </Grid>
      ))}
      {parcelle !== null && (
        <AddAdherentDialog
          attributions={attributions.filter(
            (el) => el.parcelle.id === parcelle.id
          )}
          annee={annee}
          parcelle={parcelle}
          open={openModal}
          close={() => {
            setOpenModal(false);
            setParcelle(null);
          }}
          onValidate={() => {
            setOpenModal(false);
            getAttributions();
          }}
        />
      )}
    </Grid>
  );
};
