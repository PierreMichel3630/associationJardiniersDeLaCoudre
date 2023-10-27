import { Button, Grid, TextField } from "@mui/material";

import DeleteIcon from "@mui/icons-material/Delete";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import { Fragment } from "react";

interface Props {
  values: Array<string>;
  onChange: (value: Array<string>) => void;
}

export const InputListText = ({ values, onChange }: Props) => {
  const modifier = (index: number, value: string) => {
    const newValues = [...values];
    newValues[index] = value;
    onChange(newValues);
  };

  const supprimer = (index: number) => {
    const newValues = [...values];
    newValues.splice(index, 1);
    onChange(newValues);
  };

  const ajouter = () => {
    onChange([...values, ""]);
  };

  return (
    <Grid container spacing={1}>
      {values.map((value, index) => (
        <Fragment key={index}>
          <Grid item xs={9}>
            <TextField
              size="small"
              fullWidth
              key={index}
              value={value}
              onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                modifier(index, event.target.value);
              }}
            />
          </Grid>
          <Grid item xs={3}>
            <Button
              fullWidth
              variant="contained"
              color="error"
              onClick={() => supprimer(index)}
              startIcon={<DeleteIcon />}
            >
              Supprimer
            </Button>
          </Grid>
        </Fragment>
      ))}
      <Grid item xs={12}>
        <Button
          fullWidth
          variant="contained"
          color="success"
          onClick={() => ajouter()}
          startIcon={<AddCircleIcon />}
        >
          Ajouter
        </Button>
      </Grid>
    </Grid>
  );
};
