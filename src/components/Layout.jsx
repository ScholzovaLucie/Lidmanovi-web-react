// Layout.jsx
import React from "react";
import { Outlet } from "react-router-dom";
import Box from "@mui/material/Box";
import Header from "./Header";
import { useTranslation } from "react-i18next";

export default function Layout() {
  const { t } = useTranslation("global");

  return (
    <Box>
      <Header />
      {/* žádný Container kolem Outletu! */}
      <Box component="main">
        <Outlet />
      </Box>

      <Box
        component="footer"
        sx={{
          borderTop: (theme) => `1px solid ${theme.palette.divider}`,
          py: 2,
          textAlign: "center",
          color: "text.secondary",
        }}
      >
        {t("footer.copyright", { year: new Date().getFullYear() })}
      </Box>
    </Box>
  );
}
