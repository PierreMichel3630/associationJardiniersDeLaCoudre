import {
  Grid,
  ImageList,
  ImageListItem,
  ImageListItemBar,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import { getAllSite } from "../api/site";
import { Site } from "../model/Site";

import { getUrlImage } from "../api/storage";
import imageSite from "../assets/site.jpg";

export const SiteList = () => {
  const [sites, setSites] = useState<Array<Site>>([]);

  const getSites = async () => {
    const { data } = await getAllSite();
    setSites(data as Array<Site>);
  };

  useEffect(() => {
    getSites();
  }, []);

  return (
    <Grid container>
      <Grid item xs={12}>
        <Typography variant="h2">Nos Sites</Typography>
        <ImageList
          sx={{
            gridAutoFlow: "column",
            gridTemplateColumns:
              "repeat(auto-fill,minmax(350px,1fr)) !important",
            gridAutoColumns: "minmax(350px, 1fr)",
          }}
        >
          {sites.map((site) => (
            <ImageListItem key={site.id}>
              <img
                src={site.image !== null ? getUrlImage(site.image) : imageSite}
                alt={site.nom}
                loading="lazy"
              />
              <ImageListItemBar
                title={site.nom}
                subtitle={`${site.adresse.adresse} - ${site.adresse.codepostal} ${site.adresse.ville}`}
              />
            </ImageListItem>
          ))}
        </ImageList>
      </Grid>
    </Grid>
  );
};
