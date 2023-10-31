import { Chip, Grid } from "@mui/material";
import { useEffect, useState } from "react";
import { getAllSite } from "../api/site";
import { Site } from "../model/Site";

interface Props {
  value: number;
  onChange: (value: number) => void;
}

export const SiteFilter = ({ value, onChange }: Props) => {
  const [sites, setSites] = useState<Array<Site>>([]);

  const getSites = async () => {
    const { data } = await getAllSite();
    setSites(data as Array<Site>);
  };

  useEffect(() => {
    getSites();
  }, []);

  return (
    <Grid container spacing={1} justifyContent="center">
      <Grid item>
        <Chip
          label="Tous"
          variant={value === 0 ? "filled" : "outlined"}
          onClick={() => onChange(0)}
        />
      </Grid>
      {sites.map((site) => (
        <Grid item>
          <Chip
            label={site.nom}
            variant={value === site.id ? "filled" : "outlined"}
            onClick={() => onChange(site.id)}
          />
        </Grid>
      ))}
    </Grid>
  );
};
