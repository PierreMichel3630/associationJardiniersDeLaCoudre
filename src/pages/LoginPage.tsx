import { Card, Container, Grid } from "@mui/material";
import { viewHeight } from "csx";
import { style } from "typestyle";

import { LoginForm } from "../form/LoginForm";

const cardCss = style({
  padding: 16,
});
export const LoginPage = () => {
  return (
    <Container
      maxWidth="sm"
      sx={{ minHeight: viewHeight(100), display: "flex", alignItems: "center" }}
    >
      <Card variant="outlined" className={cardCss}>
        <Grid container spacing={1} sx={{ textAlign: "center" }}>
          <Grid item xs={12}>
            <LoginForm />
          </Grid>
        </Grid>
      </Card>
    </Container>
  );
};
