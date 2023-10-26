import { Grid, Typography } from "@mui/material";

export const AccueilPage = () => {
  return (
    <Grid container spacing={1} sx={{ textAlign: "center" }}>
      <Grid item xs={12}>
        <Typography variant="h1">
          Association des Jardiniers de la Coudre - AJC
        </Typography>
      </Grid>
      <Grid item xs={12}>
        <Typography variant="body1">
          Association de Jardins familiaux gérant deux sites de jardinage : Les
          Ferrières & Légéry à Sain
        </Typography>
      </Grid>
    </Grid>
  );
};
