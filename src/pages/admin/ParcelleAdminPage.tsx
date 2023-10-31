import { Chip, Grid, IconButton, Tooltip, Typography } from "@mui/material";
import { useEffect, useState } from "react";

import AddCircleIcon from "@mui/icons-material/AddCircle";
import { getAllParcelle } from "../../api/parcelle";
import { getAllSite } from "../../api/site";
import { CardParcelle } from "../../components/card/CardParcelle";
import { CreateParcelleDialog } from "../../components/dialog/CreateParcelleDialog";
import { Parcelle } from "../../model/Parcelle";
import { Site } from "../../model/Site";
import { sortBySiteNomAndNom } from "../../utils/sort";
import { SearchInput } from "../../components/input/SearchInput";

export const ParcelleAdminPage = () => {
  const [search, setSearch] = useState("");
  const [openModal, setOpenModal] = useState(false);
  const [parcelles, setParcelles] = useState<Array<Parcelle>>([]);
  const [sites, setSites] = useState<Array<Site>>([]);
  const [editValue, setEditValue] = useState<Parcelle | null>(null);
  const [filter, setFilter] = useState(0);

  const getParcelles = async () => {
    const { data } = await getAllParcelle();
    setParcelles(data as Array<Parcelle>);
  };

  useEffect(() => {
    getParcelles();
  }, []);

  const getSites = async () => {
    const { data } = await getAllSite();
    setSites(data as Array<Site>);
  };

  useEffect(() => {
    getSites();
  }, []);

  const parcellesFilter = parcelles.filter(
    (parcelle) =>
      (filter === 0 ? true : parcelle.site.id === filter) &&
      parcelle.nom.includes(search)
  );

  return (
    <Grid container spacing={1} sx={{ textAlign: "center" }}>
      <Grid item xs={12}>
        <Grid
          container
          spacing={3}
          justifyContent="flex-end"
          alignItems="center"
        >
          <Grid item xs>
            <Typography variant="h2">Mes Parcelles</Typography>
          </Grid>
          <Grid item>
            <Tooltip title="Ajouter une parcelle" placement="top">
              <IconButton
                type="button"
                aria-label="Ajouter une parcelle"
                onClick={() => {
                  setEditValue(null);
                  setOpenModal(true);
                }}
              >
                <AddCircleIcon fontSize="large" />
              </IconButton>
            </Tooltip>
          </Grid>
        </Grid>
      </Grid>
      <Grid item xs={12}>
        <Grid container spacing={1} justifyContent="center">
          <Grid item>
            <Chip
              label="Tous"
              variant={filter === 0 ? "filled" : "outlined"}
              onClick={() => setFilter(0)}
            />
          </Grid>
          {sites.map((site) => (
            <Grid item>
              <Chip
                label={site.nom}
                variant={filter === site.id ? "filled" : "outlined"}
                onClick={() => setFilter(site.id)}
              />
            </Grid>
          ))}
        </Grid>
      </Grid>
      <Grid item xs={12}>
        <SearchInput
          value={search}
          onChange={setSearch}
          placeholder="Chercher une parcelle"
        />
      </Grid>
      {parcellesFilter.sort(sortBySiteNomAndNom).map((parcelle) => (
        <Grid item xs={4} key={parcelle.id}>
          <CardParcelle
            parcelle={parcelle}
            edit={() => {
              setEditValue(parcelle);
              setOpenModal(true);
            }}
          />
        </Grid>
      ))}
      <CreateParcelleDialog
        open={openModal}
        editValue={editValue}
        close={() => setOpenModal(false)}
        onValid={() => {
          setOpenModal(false);
          getParcelles();
        }}
      />
    </Grid>
  );
};
