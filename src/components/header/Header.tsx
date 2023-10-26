import {
  AppBar,
  Box,
  Button,
  IconButton,
  Toolbar,
  Typography,
} from "@mui/material";
import { important, px } from "csx";
import { Link, useNavigate } from "react-router-dom";

import { ModeMenu } from "./ModeMenu";

import MovieIcon from "@mui/icons-material/Movie";
import { useAuth } from "../../context/AuthProviderSupabase";
import { AccountMenu } from "./AccountMenu";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";

import logo from "../../assets/logo.png";

export const Header = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static" color="transparent" sx={{ boxShadow: "none" }}>
        <Toolbar id="toolbar" sx={{ p: important(px(0)), gap: px(8) }}>
          <Link to="/">
            <img src={logo} width={150} />
          </Link>
          <Box sx={{ flexGrow: 1 }} />
          <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
            <ModeMenu />
            {user ? (
              <AccountMenu user={user} />
            ) : (
              <>
                <Box sx={{ display: { xs: "none", md: "flex" } }}>
                  <Button
                    variant="outlined"
                    startIcon={<AccountCircleIcon />}
                    onClick={() => navigate("login")}
                  >
                    <Typography variant="body1">Se Connecter</Typography>
                  </Button>
                </Box>
                <Box sx={{ display: { xs: "flex", md: "none" } }}>
                  <IconButton
                    aria-label="connection"
                    color="inherit"
                    onClick={() => navigate("login")}
                  >
                    <AccountCircleIcon
                      color="secondary"
                      sx={{ width: 30, height: 30 }}
                    />
                  </IconButton>
                </Box>
              </>
            )}
          </Box>
        </Toolbar>
      </AppBar>
    </Box>
  );
};
