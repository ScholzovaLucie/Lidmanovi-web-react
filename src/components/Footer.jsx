import React from "react";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { useModal } from "../hooks/useModal";
import { LoginModal } from "./LoginModal";
import { useAuth } from "../hooks/useAuth";
import { useGoogleRating } from "../hooks/useGoogleRating.js";
import { formatGoogleRating } from "../utils/googleRating.js";

export default function Footer() {
  const { t } = useTranslation(["global", "kontakt"]);
  const loginModal = useModal();
  const { isAuthenticated, logout } = useAuth();
  const googleRating = useGoogleRating();
  const navigate = useNavigate();

  return (
    <>
      <Box
        component="footer"
        sx={{
          background: "#292520",
          borderTop: "1px solid #201c18",
          color: "#fffaf0",
        }}
      >
        <Container maxWidth={false} sx={{ px: { xs: 3, md: 5 }, py: { xs: 3, md: 4 }, maxWidth: 1440 }}>
          <Stack
            direction={{ xs: "column", md: "row" }}
            spacing={{ xs: 2.5, md: 6 }}
            alignItems={{ xs: "flex-start", md: "flex-start" }}
            justifyContent="space-between"
          >
            <Box sx={{ minWidth: { md: 260 } }}>
              <Typography
                sx={{
                  fontFamily: '"Cormorant Garamond", Georgia, serif',
                  fontSize: { xs: 24, md: 28 },
                  lineHeight: 1,
                  color: "#fffaf0",
                }}
              >
                {t("footer.brand")}
              </Typography>
              <Typography
                sx={{
                  mt: 1,
                  color: "#c7b89f",
                  fontSize: "0.68rem",
                  letterSpacing: "0.28em",
                  textTransform: "uppercase",
                }}
              >
                {t("footer.tagline")}
              </Typography>
            </Box>

            <Stack spacing={0.35} sx={{ minWidth: { md: 220 } }}>
              <Typography sx={{ color: "#fffaf0" }}>Machovská Lhota 40</Typography>
              <Typography sx={{ color: "#fffaf0" }}>549 31 Machov</Typography>
            </Stack>

            <Stack spacing={0.35} sx={{ minWidth: { md: 220 } }}>
              <Typography sx={{ color: "#fffaf0" }}>+420 604 341 863</Typography>
              <Typography sx={{ color: "#fffaf0" }}>info@ulidmanu.cz</Typography>
            </Stack>

            <Stack spacing={0.35} sx={{ minWidth: { md: 220 } }}>
              <Typography sx={{ color: "#fffaf0" }}>{formatGoogleRating(googleRating)}</Typography>
              <Typography sx={{ color: "#fffaf0" }}>{t("kontakt:info.owner.lines.0")}</Typography>
              {isAuthenticated ? (
                <>
                  <Box
                    component="button"
                    type="button"
                    onClick={() => navigate("/admin")}
                    sx={{
                      mt: 1,
                      color: "#c7b89f",
                      background: "none",
                      border: 0,
                      p: 0,
                      textAlign: "left",
                    }}
                  >
                    {t("auth.admin")}
                  </Box>
                  <Box
                    component="button"
                    type="button"
                    onClick={logout}
                    sx={{
                      color: "#c7b89f",
                      background: "none",
                      border: 0,
                      p: 0,
                      cursor: "pointer",
                      textAlign: "left",
                    }}
                  >
                    {t("auth.logout")}
                  </Box>
                </>
              ) : (
                <Box
                  component="button"
                  type="button"
                  onClick={loginModal.openModal}
                  sx={{
                    mt: 1,
                    color: "#c7b89f",
                    background: "none",
                    border: 0,
                    p: 0,
                    cursor: "pointer",
                    textAlign: "left",
                  }}
                >
                  {t("auth.admin")}
                </Box>
              )}
            </Stack>
          </Stack>
        </Container>
      </Box>

      <LoginModal isOpen={loginModal.isOpen} onClose={loginModal.closeModal} />
    </>
  );
}
