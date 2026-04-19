import React from "react";
import { Link as RouterLink } from "react-router-dom";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Link from "@mui/material/Link";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { useTranslation } from "react-i18next";
import { langOptions, navConfig } from "./headerConfig";
import { useModal } from "../hooks/useModal";
import { LoginModal } from "./LoginModal";
import { useAuth } from "../hooks/useAuth";

export default function Footer() {
  const { t, i18n } = useTranslation(["global", "kontakt"]);
  const loginModal = useModal();
  const { isAuthenticated, logout } = useAuth();
  const activeLanguage = String(i18n.resolvedLanguage || i18n.language || "cs").split("-")[0];

  return (
    <>
      <Box
        component="footer"
        sx={{
          background: "linear-gradient(135deg, #202228 0%, #181a1f 100%)",
          borderTopColor: "primary.dark",
        }}
      >
        <Container maxWidth="lg" sx={{ py: { xs: 2.5, md: 3 } }}>
          <Stack
            direction={{ xs: "column", md: "row" }}
            spacing={{ xs: 2, md: 3 }}
            alignItems={{ xs: "flex-start", md: "center" }}
            justifyContent="space-between"
          >
            <Box
              component="img"
              src="logolidman.webp"
              alt="U Lidmanů"
              sx={{
                height: { xs: 34, md: 38 },
                width: "auto",
                objectFit: "contain",
                minWidth: { md: 180 },
                filter: "brightness(0) invert(1) opacity(0.92)",
              }}
            />

            <Stack
              direction={{ xs: "column", sm: "row" }}
              spacing={{ xs: 0.75, sm: 2.2, md: 2.8 }}
              sx={{
                flex: 1,
                minWidth: 0,
                justifyContent: "center",
              }}
            >
              {navConfig.map(({ to, key }) => (
                <Link
                  key={to}
                  component={RouterLink}
                  to={to}
                  color="rgba(223,232,241,0.58)"
                  underline="none"
                  sx={{
                    fontSize: "0.68rem",
                    letterSpacing: "0.16em",
                    textTransform: "uppercase",
                    transition: "color 180ms ease",
                    "&:hover": {
                      color: "common.white",
                    },
                  }}
                >
                  {t(`nav.${key}`)}
                </Link>
              ))}
            </Stack>

            <Typography
              variant="body2"
              sx={{
                color: "rgba(223,232,241,0.52)",
                fontSize: "0.72rem",
                letterSpacing: "0.04em",
                minWidth: { md: 220 },
                textAlign: { xs: "left", md: "right" },
              }}
            >
              {t("footer.copyright", { year: new Date().getFullYear() })} •{" "}
              {t("kontakt:info.owner.lines.0")}
            </Typography>
          </Stack>

          <Stack
            direction="row"
            spacing={2}
            sx={{
              mt: 1.5,
              justifyContent: { xs: "flex-start", md: "space-between" },
              alignItems: "center",
              flexWrap: "wrap",
            }}
          >
            <Stack
              direction="row"
              spacing={1.25}
              alignItems="center"
              flexWrap="wrap"
            >
              {langOptions.map(({ code, label }) => (
                <Link
                  key={code}
                  component="button"
                  type="button"
                  onClick={() => i18n.changeLanguage(code)}
                  color={
                    activeLanguage === code
                      ? "rgba(255,255,255,0.9)"
                      : "rgba(223,232,241,0.44)"
                  }
                  underline="none"
                  sx={{
                    fontSize: "0.62rem",
                    letterSpacing: "0.14em",
                    textTransform: "uppercase",
                    background: "none",
                    border: 0,
                    p: 0,
                    cursor: "pointer",
                  }}
                >
                  {label}
                </Link>
              ))}
            </Stack>

            <Stack direction="row" spacing={1.5} alignItems="center">
              <Link
                component={RouterLink}
                to="/gdpr"
                color="rgba(223,232,241,0.38)"
                underline="none"
                sx={{
                  fontSize: "0.62rem",
                  letterSpacing: "0.14em",
                  textTransform: "uppercase",
                }}
              >
                GDPR
              </Link>
              {isAuthenticated ? (
                <>
                  <Link
                    component={RouterLink}
                    to="/admin"
                    color="rgba(223,232,241,0.44)"
                    underline="none"
                    sx={{
                      fontSize: "0.62rem",
                      letterSpacing: "0.14em",
                      textTransform: "uppercase",
                    }}
                  >
                    {t("auth.admin")}
                  </Link>
                  <Link
                    component="button"
                    type="button"
                    onClick={logout}
                    color="rgba(223,232,241,0.44)"
                    underline="none"
                    sx={{
                      fontSize: "0.62rem",
                      letterSpacing: "0.14em",
                      textTransform: "uppercase",
                      background: "none",
                      border: 0,
                      p: 0,
                      cursor: "pointer",
                    }}
                  >
                    {t("auth.logout")}
                  </Link>
                </>
              ) : (
                <Link
                  component="button"
                  type="button"
                  onClick={loginModal.openModal}
                  color="rgba(223,232,241,0.38)"
                  underline="none"
                  sx={{
                    fontSize: "0.62rem",
                    letterSpacing: "0.14em",
                    textTransform: "uppercase",
                    background: "none",
                    border: 0,
                    p: 0,
                    cursor: "pointer",
                  }}
                >
                  {t("auth.admin")}
                </Link>
              )}
            </Stack>
          </Stack>
        </Container>
      </Box>

      <LoginModal isOpen={loginModal.isOpen} onClose={loginModal.closeModal} />
    </>
  );
}
