import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
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
import { AppContextProvider, useAppContext } from "./context/AppContextProvider.jsx";

// Component that provides dynamic theme
function ThemedApp() {
  const { themeMode } = useAppContext();
  const theme = createAppTheme(themeMode);
  
  return (
    <StyledEngineProvider injectFirst>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <BrowserRouter basename={import.meta.env.BASE_URL}>
          <App />
        </BrowserRouter>
      </ThemeProvider>
    </StyledEngineProvider>
  );
}

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="cs">
      <Provider store={store}>
        <AppContextProvider>
          <ThemedApp />
        </AppContextProvider>
      </Provider>
    </LocalizationProvider>
  </React.StrictMode>,
);
