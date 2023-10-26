import { Grid, IconButton, Tooltip, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { getAllSite } from "../../api/site";
import { CardSite } from "../../components/card/CardSite";
import { CreateSiteDialog } from "../../components/dialog/CreateSiteDialog";
import { Site } from "../../model/Site";

import AddCircleIcon from "@mui/icons-material/AddCircle";
import { sortByNom } from "../../utils/sort";

export const SiteAdminPage = () => {
  const [openModal, setOpenModal] = useState(false);
  const [sites, setSites] = useState<Array<Site>>([]);
  const [editValue, setEditValue] = useState<Site | null>(null);

  const getSites = async () => {
    const { data } = await getAllSite();
    setSites(data as Array<Site>);
  };

  useEffect(() => {
    getSites();
  }, []);

  return (
    <Grid container spacing={1} sx={{ textAlign: "center" }}>
      <Grid item xs={12}>
        <Grid
          container
          spacing={3}
          justifyContent="flex-end"
          alignItems="center"
        >
          <Grid item xs>
            <Typography variant="h2">Mes Sites</Typography>
          </Grid>
          <Grid item>
            <Tooltip title="Ajouter un site" placement="top">
              <IconButton
                type="button"
                aria-label="Ajouter un site"
                onClick={() => {
                  setEditValue(null);
                  setOpenModal(true);
                }}
              >
                <AddCircleIcon fontSize="large" />
              </IconButton>
            </Tooltip>
          </Grid>
        </Grid>
      </Grid>
      {sites.sort(sortByNom).map((site) => (
        <Grid item xs={4} key={site.id}>
          <CardSite
            site={site}
            edit={() => {
              setEditValue(site);
              setOpenModal(true);
            }}
          />
        </Grid>
      ))}
      <CreateSiteDialog
        open={openModal}
        editValue={editValue}
        close={() => setOpenModal(false)}
        onValid={() => {
          setOpenModal(false);
          getSites();
        }}
      />
    </Grid>
  );
};
