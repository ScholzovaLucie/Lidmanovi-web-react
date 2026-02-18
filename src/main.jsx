import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { StyledEngineProvider, CssBaseline } from "@mui/material";
import { ThemeProvider } from "@emotion/react";
import App from "./App.jsx";
import theme from "./theme";
import "./locales";
import { Provider } from "react-redux";
import { store } from "./redux/store.js";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

import "./fonts.css";
import { AppContextProvider } from "./context/appContextProvider.jsx";

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Provider store={store}>
        <AppContextProvider>
          <StyledEngineProvider injectFirst>
            <ThemeProvider theme={theme}>
              <CssBaseline />
              <BrowserRouter basename={import.meta.env.BASE_URL}>
                <App />
              </BrowserRouter>
            </ThemeProvider>
          </StyledEngineProvider>
        </AppContextProvider>
      </Provider>
    </LocalizationProvider>
  </React.StrictMode>,
);
