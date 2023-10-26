import { Dialog, DialogContent, Grid, Typography } from "@mui/material";
import { SiteForm } from "../../form/SiteForm";
import { Site } from "../../model/Site";

interface Props {
  open: boolean;
  close: () => void;
  onValid: () => void;
  editValue: null | Site;
}

export const CreateSiteDialog = ({
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
              {editValue ? "Modifier un site" : "Ajouter un site"}
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <SiteForm editValue={editValue} onValid={onValid} />
          </Grid>
        </Grid>
      </DialogContent>
    </Dialog>
  );
};
