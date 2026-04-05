import React from "react";
import { Box, Collapse, Stack, Button, Paper } from "@mui/material";
import { NavLink, useNavigate } from "react-router-dom";
import { Logout as LogoutIcon } from "@mui/icons-material";
import { useTranslation } from "react-i18next";
import { useAuth } from "../hooks/useAuth";

export function MobileMenu({
  isOpen,
  onClose,
  navItems,
  langOptions,
  onLogin,
}) {
  const navigate = useNavigate();
  const { i18n, t } = useTranslation("global");
  const { isAuthenticated, logout } = useAuth();
  const activeLang = String(
    i18n.resolvedLanguage || i18n.language || "cs",
  ).split("-")[0];

  const handleLogout = () => {
    logout();
    onClose();
  };

  return (
    <Collapse in={isOpen} timeout="auto" unmountOnExit>
      <Box
        component={Paper}
        sx={{
          px: 2,
          py: 3,
          borderTopLeftRadius: 0,
          borderTopRightRadius: 0,
        }}
      >
        {/* Navigation */}
        <Stack spacing={1} sx={{ mb: 3 }}>
          {navItems.map(({ to, label, end }) => (
            <Button
              key={to}
              component={NavLink}
              to={to}
              end={end}
              onClick={onClose}
              fullWidth
              sx={{
                justifyContent: "center",
                textTransform: "none",
                fontWeight: 500,
                py: 1.5,
                fontSize: "1rem",
                color: "text.primary",
                borderRadius: 1.5,
                "&.active": {
                  fontWeight: 700,
                  bgcolor: "rgba(85,116,143,0.08)",
                  color: "primary.dark",
                  "&:hover": {
                    bgcolor: "rgba(85,116,143,0.12)",
                  },
                },
              }}
            >
              {label}
            </Button>
          ))}
        </Stack>

        {/* Controls */}
        <Stack spacing={3} alignItems="center">
          {/* Languages */}
          <Box sx={{ textAlign: "center", width: "100%" }}>
            <Box
              sx={{
                color: "text.secondary",
                fontSize: "0.8rem",
                mb: 1.5,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
              }}
            >
              {t("language")}
            </Box>
            <Stack
              direction="row"
              spacing={1}
              justifyContent="center"
              flexWrap="wrap"
            >
              {langOptions.map(({ code, label }) => (
                <Button
                  key={code}
                  onClick={() => {
                    if (typeof window !== "undefined") {
                      window.localStorage.setItem("appLanguage", code);
                    }
                    i18n.changeLanguage(code);
                  }}
                  variant={activeLang === code ? "contained" : "text"}
                  size="small"
                  sx={{
                    textTransform: "none",
                    fontWeight: activeLang === code ? 600 : 400,
                    minWidth: "auto",
                  }}
                >
                  {label}
                </Button>
              ))}
            </Stack>
          </Box>

          {/* Admin */}
          {isAuthenticated ? (
            <Stack direction="row" spacing={1.5}>
              <Button
                onClick={() => {
                  navigate("/admin");
                  onClose();
                }}
                variant="outlined"
                sx={{
                  textTransform: "none",
                  fontWeight: 500,
                }}
              >
                {t("auth.admin")}
              </Button>
              <Button
                onClick={handleLogout}
                startIcon={<LogoutIcon />}
                color="error"
                sx={{
                  textTransform: "none",
                  fontWeight: 500,
                }}
              >
                {t("auth.logout")}
              </Button>
            </Stack>
          ) : null}
        </Stack>
      </Box>
    </Collapse>
  );
}
