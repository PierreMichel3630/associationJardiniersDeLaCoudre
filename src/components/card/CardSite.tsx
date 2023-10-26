import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Typography,
} from "@mui/material";
import { percent, px } from "csx";
import { Site } from "../../model/Site";

import EditIcon from "@mui/icons-material/Edit";
import { getUrlImage } from "../../api/storage";
import imageSite from "../../assets/site.jpg";

interface Props {
  site: Site;
  edit: () => void;
}

export const CardSite = ({ site, edit }: Props) => (
  <Card>
    <CardMedia
      sx={{
        width: percent(100),
        aspectRatio: "auto",
        minHeight: px(200),
      }}
      image={site.image ? getUrlImage(site.image) : imageSite}
      title={site.nom}
    />
    <CardContent>
      <Typography variant="h4">{site.nom}</Typography>
      <Typography variant="body1">{site.adresse.adresse}</Typography>
      <Typography variant="body1">
        {site.adresse.codepostal} - {site.adresse.ville}
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
