import { Grid, IconButton, Tooltip, Typography } from "@mui/material";
import { useEffect, useState } from "react";

import AddCircleIcon from "@mui/icons-material/AddCircle";
import { getAllParcelle } from "../../api/parcelle";
import { CardParcelle } from "../../components/card/CardParcelle";
import { CreateParcelleDialog } from "../../components/dialog/CreateParcelleDialog";
import { Parcelle } from "../../model/Parcelle";

export const PlotAdminPage = () => {
  const [openModal, setOpenModal] = useState(false);
  const [parcelles, setParcelles] = useState<Array<Parcelle>>([]);
  const [editValue, setEditValue] = useState<Parcelle | null>(null);

  const getParcelles = async () => {
    const { data } = await getAllParcelle();
    setParcelles(data as Array<Parcelle>);
  };

  useEffect(() => {
    getParcelles();
  }, []);

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
      {parcelles.map((parcelle) => (
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
