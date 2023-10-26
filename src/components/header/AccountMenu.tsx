import {
  Box,
  Divider,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Typography,
} from "@mui/material";
import { useState } from "react";

import LogoutIcon from "@mui/icons-material/Logout";
import { User } from "@supabase/supabase-js";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthProviderSupabase";
import { style } from "typestyle";
import { border } from "csx";
import { Colors } from "../../style/Colors";

const divCss = style({
  display: "flex",
  borderRadius: 30,
  border: border({ width: 1, style: "solid", color: Colors.grey3 }),
  padding: 5,
  alignItems: "center",
  cursor: "pointer",
  $nest: {
    "&:hover": {
      backgroundColor: Colors.lightgrey,
    },
  },
});

interface Setting {
  name: string;
  url: string;
}

interface Props {
  user: User;
}

export const AccountMenu = ({ user }: Props) => {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const settings: Array<Setting> = [
    {
      name: "Mes sites",
      url: "/admin-sites",
    },
    {
      name: "Mes parcelles",
      url: "/admin-parcelles",
    },
    {
      name: "Mes adhérants",
      url: "/admin-adherants",
    },
    {
      name: "Gestion des attributions",
      url: "/gestion-attributions",
    },
  ];

  const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(null);

  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const disconnect = async () => {
    handleCloseUserMenu();
    await logout();
    navigate("/");
  };

  const goTo = (url: string) => {
    handleCloseUserMenu();
    navigate(url);
  };

  return (
    <Box sx={{ flexGrow: 0 }}>
      <div onClick={handleOpenUserMenu} className={divCss}>
        <Typography
          component="small"
          variant="caption"
          sx={{ display: { xs: "none", md: "flex" }, fontWeight: 700 }}
          ml={0.5}
          mr={1}
          color="secondary"
        >
          {user.email}
        </Typography>
      </div>

      <Menu
        sx={{ mt: "45px" }}
        id="menu-appbar"
        anchorEl={anchorElUser}
        anchorOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        keepMounted
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        open={Boolean(anchorElUser)}
        onClose={handleCloseUserMenu}
      >
        {settings.map((setting, index) => (
          <MenuItem key={index} onClick={() => goTo(setting.url)}>
            <ListItemText>{setting.name}</ListItemText>
          </MenuItem>
        ))}
        <Divider />
        <MenuItem onClick={disconnect}>
          <ListItemIcon>
            <LogoutIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Déconnexion</ListItemText>
        </MenuItem>
      </Menu>
    </Box>
  );
};
