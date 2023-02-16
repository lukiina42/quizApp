import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter as Router } from "react-router-dom";
import "./index.css";
import App from "./pages/App";
import { ThemeProvider } from "@mui/material/styles";
import theme from "./common/theme";
import { store } from "./redux/configureStore";
import { Provider as ReduxProvider } from "react-redux";

//The root of the app
ReactDOM.render(
  <ReduxProvider store={store}>
    <Router>
      <ThemeProvider theme={theme}>
        <App />
      </ThemeProvider>
    </Router>
  </ReduxProvider>,
  document.getElementById("root")
);
