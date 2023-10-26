import { Dialog, DialogContent, Grid, Typography } from "@mui/material";
import { Adherent } from "../../model/Adherent";
import { AdherentForm } from "../../form/AdherentForm";

interface Props {
  open: boolean;
  close: () => void;
  onValid: () => void;
  editValue: null | Adherent;
}

export const CreateAdherentDialog = ({
  open,
  close,
  onValid,
  editValue,
}: Props) => {
  return (
    <Dialog onClose={close} open={open}>
      <DialogContent>
        <Grid container spacing={2}>
          <Grid item xs={12} sx={{ textAlign: "center" }}>
            <Typography variant="h2">
              {editValue ? "Modifier un adhérent" : "Ajouter un adhérent"}
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <AdherentForm editValue={editValue} onValid={onValid} />
          </Grid>
        </Grid>
      </DialogContent>
    </Dialog>
  );
};
