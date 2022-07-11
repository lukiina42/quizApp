import {createTheme} from "@mui/material/styles"

const theme = createTheme({
  spacing: 8,
  palette: {
    primary: {
      main: '#7D93FF',
      darker: '#053e85',
      contrastText: "#fff",
    },
    secondary: {
      main: '#6AE2A4',
      darker: '#52D591',
      contrastText: "#fff",
    },
    neutral: {
      main: '#64748B',
      darker: '#000000',
      contrastText: '#fff',
    },
    backgroundSidePanel: {
      main: '#E0DFF0',
      contrastText: '#fff',
    },
    error: {
      main: '#FF0044',
      darker: '#FF0044',
      contrastText: '#fff',
    },
    black: {
      main: "black"
    }
  },
});

export default theme