import { createContext, useMemo, useState } from "react";
import { BrowserRouter } from "react-router-dom";
import "./App.css";
import { CssBaseline, ThemeProvider, createTheme } from "@mui/material";
import { Colors } from "./style/Colors";

import Routes from "./routes";
import { AuthProviderSupabase } from "./context/AuthProviderSupabase";
import "moment/dist/locale/fr";

export const UserContext = createContext<{
  mode: "light" | "dark";
  setMode: (mode: "light" | "dark") => void;
}>({
  mode: "light",
  setMode: (mode: "light" | "dark") => {},
});

function App() {
  const [mode, setMode] = useState<"light" | "dark">(
    localStorage.getItem("mode") !== null
      ? (localStorage.getItem("mode")! as "light" | "dark")
      : "light"
  );

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode,
          ...(mode === "light"
            ? {
                secondary: {
                  main: Colors.greyLightMode,
                },
                text: {
                  primary: Colors.black,
                  secondary: Colors.grey2,
                },
                background: {
                  default: Colors.lightgrey,
                },
              }
            : {
                secondary: {
                  main: Colors.grey,
                },
                background: {
                  default: "#171c24",
                },
                text: {
                  primary: Colors.white,
                  secondary: Colors.white,
                },
              }),
        },
        typography: {
          fontFamily: ["Montserrat", "sans-serif"].join(","),
          h1: {
            fontSize: 50,
            fontWeight: 700,
            "@media (max-width:600px)": {
              fontSize: 30,
            },
          },
          caption: {
            fontSize: 13,
            fontWeight: 500,
            "@media (max-width:600px)": {
              fontSize: 12,
            },
          },
          body1: {
            fontSize: 13,
            fontWeight: 500,
            "@media (max-width:600px)": {
              fontSize: 12,
            },
          },
          body2: {
            fontSize: 11,
            fontWeight: 700,
            "@media (max-width:600px)": {
              fontSize: 11,
            },
          },
          h2: {
            fontSize: 22,
            fontWeight: 700,
            "@media (max-width:600px)": {
              fontSize: 20,
            },
          },
          h3: {
            fontSize: 18,
            fontWeight: 700,
            "@media (max-width:600px)": {
              fontSize: 15,
            },
          },
          h4: {
            fontSize: 16,
            fontWeight: 700,
            "@media (max-width:600px)": {
              fontSize: 14,
            },
          },
          h6: {
            fontSize: 13,
            fontWeight: 600,
            "@media (max-width:600px)": {
              fontSize: 12,
            },
          },
        },
      }),
    [mode]
  );

  return (
    <AuthProviderSupabase>
      <UserContext.Provider value={{ mode, setMode }}>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <BrowserRouter>
            <Routes />
          </BrowserRouter>
        </ThemeProvider>
      </UserContext.Provider>
    </AuthProviderSupabase>
  );
}

export default App;
