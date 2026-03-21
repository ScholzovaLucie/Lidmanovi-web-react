// Layout.jsx
import React from "react";
import { Link as RouterLink, Outlet } from "react-router-dom";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import Divider from "@mui/material/Divider";
import Link from "@mui/material/Link";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Header from "./Header";
import { useTranslation } from "react-i18next";
import { Seo } from "./Seo";
import { navConfig } from "./headerConfig";

export default function Layout() {
  const { t } = useTranslation(["global", "kontakt"]);
  const footerNavItems = navConfig.filter(({ to }) => to !== "/rezervace");

  return (
    <Box>
      <Seo />
      <Header />
      {/* žádný Container kolem Outletu! */}
      <Box component="main">
        <Outlet />
      </Box>

      <Box
        component="footer"
        sx={{
          borderTop: (theme) => `1px solid ${theme.palette.divider}`,
          mt: 8,
          background:
            "linear-gradient(180deg, transparent 0%, rgba(75,107,133,0.08) 100%)",
        }}
      >
        <Container maxWidth="lg" sx={{ py: { xs: 5, md: 7 } }}>
          <Stack
            direction={{ xs: "column", md: "row" }}
            spacing={{ xs: 4, md: 6 }}
            alignItems={{ xs: "flex-start", md: "stretch" }}
            justifyContent="space-between"
          >
            <Stack spacing={1.5} sx={{ flex: 1, minWidth: 0 }}>
              <Typography variant="h6" sx={{ mb: 0.5 }}>
                {t("footer.brand")}
              </Typography>
              <Typography color="text.secondary">
                {t("footer.tagline")}
              </Typography>
              <Stack spacing={0.75}>
                <Typography color="text.primary">
                  {t("kontakt:info.address.lines.0")}
                </Typography>
                <Typography color="text.secondary">
                  {t("kontakt:info.address.lines.1")}
                </Typography>
              </Stack>
            </Stack>

            <Stack spacing={1.25} sx={{ flex: 1, minWidth: 0 }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                {t("footer.contactTitle")}
              </Typography>
              <Link href="tel:+420604341863" color="inherit" underline="hover">
                {t("kontakt:info.phone.value")}
              </Link>
              <Link href="mailto:info@ulidmanu.cz" color="inherit" underline="hover">
                {t("kontakt:info.email.value")}
              </Link>
              <Link
                href="https://maps.google.com/?q=Machovska%20Lhota%2040%2C%20Machov%20549%2031"
                target="_blank"
                rel="noreferrer"
                color="inherit"
                underline="hover"
              >
                {t("footer.mapCta")}
              </Link>
              <Link
                href="https://www.facebook.com/Pension-a-restaurace-U-Lidman%C5%AF-945259918825167"
                target="_blank"
                rel="noreferrer"
                color="inherit"
                underline="hover"
              >
                {t("footer.facebookCta")}
              </Link>
            </Stack>

            <Stack spacing={1.25} sx={{ flex: 1, minWidth: 0 }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                {t("footer.navigationTitle")}
              </Typography>
              {footerNavItems.map(({ to, key }) => (
                <Link
                  key={to}
                  component={RouterLink}
                  to={to}
                  color="inherit"
                  underline="hover"
                >
                  {t(`nav.${key}`)}
                </Link>
              ))}
            </Stack>

            <Stack
              spacing={1.5}
              sx={{
                flex: 1.1,
                minWidth: 0,
                p: 2.5,
                borderRadius: 3,
                bgcolor: "background.paper",
                boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
              }}
            >
              <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                {t("footer.reservationTitle")}
              </Typography>
              <Typography color="text.secondary">
                {t("footer.reservationText")}
              </Typography>
              <Button
                component={RouterLink}
                to="/rezervace"
                variant="contained"
                sx={{ alignSelf: "flex-start" }}
              >
                {t("footer.reservationCta")}
              </Button>
            </Stack>
          </Stack>

          <Divider sx={{ my: 3 }} />

          <Stack
            direction={{ xs: "column", sm: "row" }}
            spacing={1}
            justifyContent="space-between"
            alignItems={{ xs: "flex-start", sm: "center" }}
          >
            <Typography color="text.secondary">
              {t("footer.copyright", { year: new Date().getFullYear() })}
            </Typography>
            <Typography color="text.secondary" variant="body2">
              {t("kontakt:info.owner.lines.0")} • {t("kontakt:info.owner.lines.1")}
            </Typography>
          </Stack>
        </Container>
      </Box>
    </Box>
  );
}
