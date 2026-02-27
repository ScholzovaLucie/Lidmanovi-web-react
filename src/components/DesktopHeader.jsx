import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { Box, Button, IconButton, Stack } from "@mui/material";
import {
  LightMode as LightModeIcon,
  DarkMode as DarkModeIcon,
  Logout as LogoutIcon,
} from "@mui/icons-material";
import { MenuButton } from "./controls/MenuButton";
import { useTranslation } from "react-i18next";
import { useAppContext } from "../context/AppContextProvider";
import { useAuth } from "../hooks/useAuth";

const langOptions = [
  { code: "cs", label: "Čeština" },
  { code: "en", label: "English" },
  { code: "pl", label: "Polski" },
  { code: "de", label: "Deutsch" },
];

const NavButton = ({ to, label, end }) => (
  <Button
    component={NavLink}
    to={to}
    end={end}
    sx={{
      textTransform: "none",
      fontWeight: 500,
      px: 2,
      py: 1,
      color: "text.primary",
      "&.active": {
        fontWeight: 600,
        bgcolor: "primary.main",
        color: "primary.contrastText",
        "&:hover": {
          bgcolor: "primary.dark",
        },
      },
    }}
  >
    {label}
  </Button>
);

export function DesktopHeader({ onLogin, navItems }) {
  const navigate = useNavigate();
  const { i18n, t } = useTranslation("global");
  const { themeMode, toggleTheme } = useAppContext();
  const { isAuthenticated, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const activeLang = String(i18n.resolvedLanguage || i18n.language || "cs").split(
    "-",
  )[0];
  const currentLang =
    langOptions.find((lang) => lang.code === activeLang) || langOptions[0];
  const primaryNavItems = navItems.filter(({ to }) => to !== "/");

  return (
    <Box
      sx={{
        display: { xs: "none", md: "flex" },
        width: "100%",
        alignItems: "center",
      }}
    >
      {/* Left side */}
      <Stack direction="row" alignItems="center" spacing={1.5}>
        <Box
          component="img"
          src="logolidman.webp"
          alt="U Lidmanů"
          onClick={() => navigate("/")}
          sx={{ height: 40, cursor: "pointer", mr: 1 }}
        />

        {primaryNavItems.map(({ to, label, end }) => (
          <NavButton key={to} to={to} label={label} end={end} />
        ))}
      </Stack>

      {/* Spacer */}
      <Box sx={{ flexGrow: 1 }} />

      {/* Right side */}
      <Stack direction="row" spacing={2} alignItems="center">
        <MenuButton
          label={currentLang.label}
          options={langOptions.map((lang) => ({
            ...lang,
            onClick: () => i18n.changeLanguage(lang.code),
            isActive: activeLang === lang.code,
          }))}
        />

        <IconButton
          onClick={toggleTheme}
          size="small"
          sx={{ p: 1, border: 1, borderColor: "divider" }}
        >
          {themeMode === "dark" ? (
            <LightModeIcon fontSize="small" />
          ) : (
            <DarkModeIcon fontSize="small" />
          )}
        </IconButton>

        {isAuthenticated ? (
          <>
            <Button
              onClick={() => navigate("/admin")}
              variant="outlined"
              sx={{ textTransform: "none" }}
            >
              {t("auth.admin")}
            </Button>
            <Button
              onClick={handleLogout}
              startIcon={<LogoutIcon />}
              color="error"
              sx={{ textTransform: "none" }}
            >
              {t("auth.logout")}
            </Button>
          </>
        ) : (
          <Button
            onClick={onLogin}
            variant="outlined"
            sx={{ textTransform: "none" }}
          >
            {t("auth.login")}
          </Button>
        )}
      </Stack>
    </Box>
  );
}
