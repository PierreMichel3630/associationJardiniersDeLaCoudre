import { Dialog, DialogContent, Grid, Typography } from "@mui/material";
import { ParcelleForm } from "../../form/ParcelleForm";
import { Parcelle } from "../../model/Parcelle";

interface Props {
  open: boolean;
  close: () => void;
  onValid: () => void;
  editValue: null | Parcelle;
}

export const CreateParcelleDialog = ({
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
              {editValue ? "Modifier une parcelle" : "Ajouter une parcelle"}
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <ParcelleForm editValue={editValue} onValid={onValid} />
          </Grid>
        </Grid>
      </DialogContent>
    </Dialog>
  );
};
