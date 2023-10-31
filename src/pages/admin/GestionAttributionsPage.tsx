import { Grid, Typography } from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers";
import moment, { Moment } from "moment";
import { useEffect, useState } from "react";
import { getAttributionParAnnee } from "../../api/attribution";
import { getAllParcelle } from "../../api/parcelle";
import { SiteFilter } from "../../components/SiteFilter";
import { CardGestionParcelle } from "../../components/card/CardParcelle";
import { AddAdherentDialog } from "../../components/dialog/AddAdherentDialog";
import { Attribution } from "../../model/Attribution";
import { Parcelle } from "../../model/Parcelle";
import { sortBySiteNomAndNom } from "../../utils/sort";
import { SearchInput } from "../../components/input/SearchInput";

export const GestionAttributionsPage = () => {
  const [search, setSearch] = useState("");
  const [annee, setAnnee] = useState<Moment | null>(moment());
  const [filter, setFilter] = useState(0);
  const [openModal, setOpenModal] = useState(false);

  const [parcelles, setParcelles] = useState<Array<Parcelle>>([]);
  const [attributions, setAttributions] = useState<Array<Attribution>>([]);
  const [parcelle, setParcelle] = useState<Parcelle | null>(null);

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

  const parcellesFilter = parcelles.filter(
    (parcelle) =>
      (filter === 0 ? true : parcelle.site.id === filter) &&
      parcelle.nom.includes(search)
  );

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
      <Grid item xs={12}>
        <SiteFilter value={filter} onChange={setFilter} />
      </Grid>
      <Grid item xs={12}>
        <SearchInput
          value={search}
          onChange={setSearch}
          placeholder="Chercher une parcelle"
        />
      </Grid>
      {parcellesFilter.sort(sortBySiteNomAndNom).map((parcelle) => (
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
