import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Grid,
  IconButton,
  Paper,
  Typography,
} from "@mui/material";
import { percent, px } from "csx";

import AddCircleIcon from "@mui/icons-material/AddCircle";
import EditIcon from "@mui/icons-material/Edit";
import { style } from "typestyle";
import { getUrlImage } from "../../api/storage";
import imageSite from "../../assets/site.jpg";
import { Parcelle } from "../../model/Parcelle";
import { Attribution } from "../../model/Attribution";
import { Fragment } from "react";
import DeleteIcon from "@mui/icons-material/Delete";
import { deleteAttribution } from "../../api/attribution";

interface Props {
  parcelle: Parcelle;
  edit: () => void;
}

export const CardParcelle = ({ parcelle, edit }: Props) => (
  <Card
    sx={{
      height: percent(100),
      justifyContent: "space-between",
      display: "flex",
      flexDirection: "column",
    }}
  >
    <CardMedia
      sx={{
        width: percent(100),
        aspectRatio: "auto",
        minHeight: px(200),
      }}
      image={parcelle.image ? getUrlImage(parcelle.image) : imageSite}
      title={parcelle.nom}
    />
    <CardContent>
      <Typography variant="h4">
        {parcelle.site.nom} - {parcelle.nom}
      </Typography>
      {parcelle.surface !== null && (
        <Typography variant="body1">{parcelle.surface} m2</Typography>
      )}
      <Typography variant="body1">{parcelle.prix}€</Typography>
    </CardContent>
    <CardActions>
      <Button
        fullWidth
        variant="contained"
        color="secondary"
        startIcon={<EditIcon />}
        onClick={edit}
      >
        Modifier
      </Button>
    </CardActions>
  </Card>
);

const imageCss = style({
  width: percent(100),
  maxHeight: px(250),
  objectFit: "cover",
});

interface PropsCardGestionParcelle {
  parcelle: Parcelle;
  addAdherent: () => void;
  attributions: Array<Attribution>;
  onDelete: () => void;
}

export const CardGestionParcelle = ({
  parcelle,
  addAdherent,
  attributions,
  onDelete,
}: PropsCardGestionParcelle) => {
  const supprimer = async (id: number) => {
    await deleteAttribution(id);
    onDelete();
  };

  return (
    <Paper elevation={3}>
      <Grid container>
        <Grid item xs={6}>
          <img
            className={imageCss}
            src={parcelle.image ? getUrlImage(parcelle.image) : imageSite}
          />
          <Box sx={{ textAlign: "center" }}>
            <Typography variant="h4">
              {parcelle.site.nom} - {parcelle.nom}
            </Typography>
            <Typography variant="body1">{parcelle.surface} m2</Typography>
            <Typography variant="body1">{parcelle.prix}€</Typography>
          </Box>
        </Grid>
        <Grid item xs={6} sx={{ p: 2 }}>
          <Grid container spacing={1} alignItems="center">
            <Grid item xs={12}>
              <Button
                fullWidth
                variant="contained"
                color="secondary"
                startIcon={<AddCircleIcon />}
                onClick={addAdherent}
              >
                Ajouter un adhérent
              </Button>
            </Grid>
            {attributions.map((attribution) => (
              <Fragment key={attribution.id}>
                <Grid item xs={9}>
                  <Typography variant="h4" sx={{ textAlign: "center" }}>
                    {`${attribution.adherent.prenom} ${
                      attribution.adherent.nom
                    } ${
                      attribution.adherent.conjointnom !== ""
                        ? `et ${attribution.adherent.conjointprenom} ${attribution.adherent.conjointnom}`
                        : ""
                    }`}
                  </Typography>
                </Grid>
                <Grid item xs={3}>
                  <IconButton
                    aria-label="delete"
                    onClick={() => supprimer(attribution.id)}
                  >
                    <DeleteIcon />
                  </IconButton>
                </Grid>
              </Fragment>
            ))}
          </Grid>
        </Grid>
      </Grid>
    </Paper>
  );
};
