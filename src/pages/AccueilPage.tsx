import { Grid, Typography } from "@mui/material";
import { SiteList } from "../components/SiteList";
import { ParcelleList } from "../components/ParcelleList";

import logo from "../assets/logo.png";

export const AccueilPage = () => {
  return (
    <Grid container spacing={3} sx={{ textAlign: "center" }}>
      <Grid item xs={12}>
        <img src={logo} width={400} />
        <Typography variant="h1">
          Association des Jardiniers de la Coudre
        </Typography>
        <Typography variant="body1">
          Association de Jardins familiaux gérant plusieurs sites de jardinage à
          Saint Léger de Linières
        </Typography>
        <Typography variant="body1">
          Pour toutes informations, contacter nous à l'adresse mail
          ajc49170@gmail.com
        </Typography>
      </Grid>
      <Grid item xs={12}>
        <SiteList />
      </Grid>
      <Grid item xs={12}>
        <ParcelleList />
      </Grid>
    </Grid>
  );
};
