import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, useLocation } from "react-router-dom";
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
import {
  AppContextProvider,
  useAppContext,
} from "./context/AppContextProvider.jsx";
import { SnackbarProvider } from "notistack";
import { EditorialEditorProvider } from "./context/EditorialEditorProvider.jsx";
import { useTranslation } from "react-i18next";

function normalizeLanguage(value) {
  return String(value || "cs").split("-")[0];
}

function LanguageRouteGuard({ children }) {
  const location = useLocation();
  const { i18n } = useTranslation();

  React.useEffect(() => {
    const savedLanguage = normalizeLanguage(
      typeof window !== "undefined" ? window.localStorage.getItem("appLanguage") : "cs",
    );
    const activeLanguage = normalizeLanguage(i18n.resolvedLanguage || i18n.language);
    if (savedLanguage && savedLanguage !== activeLanguage) {
      i18n.changeLanguage(savedLanguage);
    }
  }, [location.pathname, i18n]);

  return children;
}

// Component that provides dynamic theme
function ThemedApp() {
  const { themeMode } = useAppContext();
  const theme = createAppTheme(themeMode);

  return (
    <StyledEngineProvider injectFirst>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <BrowserRouter basename={import.meta.env.BASE_URL}>
          <LanguageRouteGuard>
            <EditorialEditorProvider>
              <App />
            </EditorialEditorProvider>
          </LanguageRouteGuard>
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
