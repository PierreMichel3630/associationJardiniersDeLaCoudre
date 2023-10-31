import { IconButton, InputBase, Paper } from "@mui/material";

import SearchIcon from "@mui/icons-material/Search";
import { percent } from "csx";

interface Props {
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
}

export const SearchInput = ({ placeholder, value, onChange }: Props) => (
  <Paper
    component="form"
    sx={{
      p: "2px 4px",
      display: "flex",
      alignItems: "center",
      width: percent(100),
    }}
  >
    <InputBase
      sx={{ ml: 1, flex: 1 }}
      placeholder={placeholder}
      inputProps={{ "aria-label": "search google maps" }}
      value={value}
      onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
        onChange(event.target.value);
      }}
    />
    <IconButton type="button" sx={{ p: "10px" }} aria-label="search">
      <SearchIcon />
    </IconButton>
  </Paper>
);
