//@ts-nocheck

import { createTheme } from "@mui/material/styles";
import { Theme } from "@mui/material/styles";

declare module "@mui/styles/defaultTheme" {
  interface DefaultTheme extends Theme {}
}

//defines colors used in the app. Those are then used using theme.palette.*
const theme = createTheme({
  spacing: 8,
  palette: {
    primary: {
      main: "#7D93FF",
      dark: "#053e85",
      contrastText: "#fff",
    },
    secondary: {
      main: "#6AE2A4",
      dark: "#52D591",
      contrastText: "#fff",
    },
    info: {
      main: "#64748B",
      dark: "#000000",
      contrastText: "#fff",
    },
    //@ts-ignore
    backgroundSidePanel: {
      main: "#E0DFF0",
      contrastText: "#fff",
    },
    error: {
      main: "#FF0044",
      dark: "#FF0044",
      contrastText: "#fff",
    },
    black: {
      main: "black",
    },
  },
});

export default theme;
