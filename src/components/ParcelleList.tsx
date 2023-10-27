import {
  Grid,
  ImageList,
  ImageListItem,
  ImageListItemBar,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";

import { getAllParcelle } from "../api/parcelle";
import { getUrlImage } from "../api/storage";
import imageSite from "../assets/site.jpg";
import { Parcelle } from "../model/Parcelle";

export const ParcelleList = () => {
  const [parcelles, setParcelles] = useState<Array<Parcelle>>([]);

  const getParcelles = async () => {
    const { data } = await getAllParcelle();
    setParcelles(data as Array<Parcelle>);
  };

  useEffect(() => {
    getParcelles();
  }, []);

  return (
    <Grid container>
      <Grid item xs={12}>
        <Typography variant="h2">Nos Parcelles</Typography>
        <ImageList
          sx={{
            gridAutoFlow: "column",
            gridTemplateColumns:
              "repeat(auto-fill,minmax(350px,1fr)) !important",
            gridAutoColumns: "minmax(350px, 1fr)",
          }}
        >
          {parcelles.map((parcelle) => (
            <ImageListItem key={parcelle.id}>
              <img
                src={
                  parcelle.image !== null
                    ? getUrlImage(parcelle.image)
                    : imageSite
                }
                alt={parcelle.nom}
                loading="lazy"
              />
              <ImageListItemBar
                title={`${parcelle.site.nom} - ${parcelle.nom}`}
                subtitle={`${parcelle.prix}€ ${
                  parcelle.surface !== null ? `- ${parcelle.surface}m2` : ""
                }`}
              />
            </ImageListItem>
          ))}
        </ImageList>
      </Grid>
    </Grid>
  );
};
