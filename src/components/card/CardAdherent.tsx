import {
  Button,
  Card,
  CardActions,
  CardContent,
  Typography,
} from "@mui/material";

import EditIcon from "@mui/icons-material/Edit";
import { Adherent } from "../../model/Adherent";
import { percent } from "csx";
import { getLabelAdherent } from "../../utils/get";

interface Props {
  adherent: Adherent;
  edit: () => void;
}

export const CardAdherent = ({ adherent, edit }: Props) => (
  <Card
    sx={{
      height: percent(100),
      justifyContent: "space-between",
      display: "flex",
      flexDirection: "column",
    }}
  >
    <CardContent>
      <Typography variant="h4" sx={{ textAlign: "center" }}>
        {getLabelAdherent(adherent)}
      </Typography>
      <Typography variant="body1">Téléphone : {adherent.telephone}</Typography>
      <Typography variant="body1">Email : {adherent.mail}</Typography>
      <Typography variant="body1">
        Adresse : {`${adherent.adresse.adresse}`}
      </Typography>
      <Typography variant="body1">
        {`${adherent.adresse.codepostal} ${adherent.adresse.ville}`}
      </Typography>
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
