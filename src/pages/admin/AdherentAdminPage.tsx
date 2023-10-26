import { Grid, IconButton, Tooltip, Typography } from "@mui/material";
import { useEffect, useState } from "react";

import AddCircleIcon from "@mui/icons-material/AddCircle";
import { getAllAdherent } from "../../api/adherent";
import { CardAdherent } from "../../components/card/CardAdherent";
import { CreateAdherentDialog } from "../../components/dialog/CreateAdherentDialog";
import { Adherent } from "../../model/Adherent";

export const AdherentAdminPage = () => {
  const [openModal, setOpenModal] = useState(false);
  const [adherents, setAdherents] = useState<Array<Adherent>>([]);
  const [editValue, setEditValue] = useState<Adherent | null>(null);

  const getAdherents = async () => {
    const { data } = await getAllAdherent();
    setAdherents(data as Array<Adherent>);
  };

  useEffect(() => {
    getAdherents();
  }, []);

  return (
    <Grid container spacing={1}>
      <Grid item xs={12}>
        <Grid
          container
          spacing={3}
          justifyContent="flex-end"
          alignItems="center"
        >
          <Grid item xs sx={{ textAlign: "center" }}>
            <Typography variant="h2">Mes Adhérents</Typography>
          </Grid>
          <Grid item>
            <Tooltip title="Ajouter un adhérent" placement="top">
              <IconButton
                type="button"
                aria-label="Ajouter un adhérent"
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
      {adherents.map((adherent) => (
        <Grid item xs={4} key={adherent.id}>
          <CardAdherent
            adherent={adherent}
            edit={() => {
              setEditValue(adherent);
              setOpenModal(true);
            }}
          />
        </Grid>
      ))}
      <CreateAdherentDialog
        open={openModal}
        editValue={editValue}
        close={() => setOpenModal(false)}
        onValid={() => {
          setOpenModal(false);
          getAdherents();
        }}
      />
    </Grid>
  );
};
