import { Container, Grid } from "@mui/material";
import { Outlet } from "react-router-dom";
import { Header } from "../components/header/Header";
import { Footer } from "../components/footer/Footer";

export const HomePage = () => {
  return (
    <Grid container>
      <Grid item xs={12}>
        <Container maxWidth="lg">
          <Header />
        </Container>
      </Grid>
      <Grid item xs={12} sx={{ marginTop: 2, marginBottom: 8 }}>
        <Container maxWidth="xl">
          <Outlet />
        </Container>
      </Grid>
      <Footer />
    </Grid>
  );
};
