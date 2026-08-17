import React from "react";
import { createRoot } from "react-dom/client";
import { StyledEngineProvider, CssBaseline } from "@mui/material";
import { ThemeProvider } from "@emotion/react";
import App from "./App.jsx";
import { createAppTheme } from "./theme";
import "./locales";
import { Provider } from "react-redux";
import { store } from "./redux/store.js";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import "dayjs/locale/cs";

import "./fonts.css";
import { AppContextProvider } from "./context/AppContextProvider.jsx";
import { SnackbarProvider } from "notistack";
function ThemedApp() {
  const theme = createAppTheme();

  return (
    <StyledEngineProvider injectFirst>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <App />
      </ThemeProvider>
    </StyledEngineProvider>
  );
}

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="cs">
      <Provider store={store}>
        <AppContextProvider>
          <SnackbarProvider
            maxSnack={5}
            anchorOrigin={{
              vertical: "top",
              horizontal: "right",
            }}
          >
            <ThemedApp />
          </SnackbarProvider>
        </AppContextProvider>
      </Provider>
    </LocalizationProvider>
  </React.StrictMode>,
);
