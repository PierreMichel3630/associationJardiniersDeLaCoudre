import {
  Button,
  Checkbox,
  Dialog,
  DialogContent,
  FormControlLabel,
  FormGroup,
  Grid,
  Typography,
} from "@mui/material";
import moment, { Moment } from "moment";
import { useEffect, useState } from "react";
import { getAllAdherent } from "../../api/adherent";
import { deleteAttribution, insertAttribution } from "../../api/attribution";
import { Adherent } from "../../model/Adherent";
import { Attribution, AttributionInsert } from "../../model/Attribution";
import { Parcelle } from "../../model/Parcelle";
import { sortByNomAndPrenom } from "../../utils/sort";
import { getLabelAdherent } from "../../utils/get";

interface Props {
  open: boolean;
  close: () => void;
  annee: Moment | null;
  parcelle: Parcelle;
  onValidate: () => void;
  attributions: Array<Attribution>;
}

export const AddAdherentDialog = ({
  annee,
  parcelle,
  open,
  close,
  onValidate,
  attributions,
}: Props) => {
  const [adherents, setAdherents] = useState<Array<Adherent>>([]);
  const [checked, setChecked] = useState<Array<number>>([]);

  const getAdherents = async () => {
    const { data } = await getAllAdherent();
    setAdherents(data as Array<Adherent>);
  };

  useEffect(() => {
    setChecked(attributions.map((el) => el.adherent.id));
  }, [attributions]);

  useEffect(() => {
    getAdherents();
  }, []);

  const handleChecked = (id: number) => {
    setChecked((prev) =>
      prev.includes(id) ? [...prev].filter((el) => el !== id) : [...prev, id]
    );
  };

  const validate = async () => {
    const previousAdherent = attributions.map((el) => el.adherent.id);
    const toInsert = checked.filter((el) => !previousAdherent.includes(el));
    const toDeleteAdherent = previousAdherent.filter(
      (el) => !checked.includes(el)
    );
    const promises: Array<any> = [];
    toInsert.map((el) => {
      const attributionInsert: AttributionInsert = {
        adherent: el,
        parcelle: parcelle.id,
        annee: annee ? annee.year() : moment().year(),
      };
      promises.push(insertAttribution(attributionInsert));
    });
    toDeleteAdherent.map(async (adherentId) => {
      const attribution = attributions.find(
        (el) => el.adherent.id === adherentId
      );
      if (attribution) {
        promises.push(deleteAttribution(attribution.id));
      }
    });
    Promise.all(promises).then((_) => {
      onValidate();
    });
  };

  return (
    <Dialog onClose={close} open={open}>
      <DialogContent>
        <Grid container spacing={2}>
          <Grid item xs={12} sx={{ textAlign: "center" }}>
            <Typography variant="h2">Ajouter un adhérent</Typography>
          </Grid>
          <Grid item xs={12}>
            <FormGroup>
              {adherents.sort(sortByNomAndPrenom).map((adherent) => (
                <FormControlLabel
                  key={adherent.id}
                  control={
                    <Checkbox
                      checked={checked.includes(adherent.id)}
                      onChange={(_: React.ChangeEvent<HTMLInputElement>) =>
                        handleChecked(adherent.id)
                      }
                    />
                  }
                  label={getLabelAdherent(adherent)}
                />
              ))}
            </FormGroup>
          </Grid>
          <Grid item xs={12}>
            <Button
              disableElevation
              fullWidth
              size="large"
              type="submit"
              variant="contained"
              color="secondary"
              onClick={validate}
            >
              Valider
            </Button>
          </Grid>
        </Grid>
      </DialogContent>
    </Dialog>
  );
};
