import React from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { Box, Button, IconButton, Stack } from "@mui/material";
import { LightMode as LightModeIcon, DarkMode as DarkModeIcon, Logout as LogoutIcon } from "@mui/icons-material";
import { MenuButton } from "./controls/MenuButton";
import { useTranslation } from "react-i18next";
import { useAppContext } from "../context/AppContextProvider";
import { useAuth } from "../hooks/useAuth";

const nav = [
  { to: "/rezervace", label: "Rezervace" },
  { to: "/restaurace", label: "Restaurace" },
  { to: "/svatby", label: "Svatby" },
  { to: "/ubytovani", label: "Ubytování" },
  { to: "/pobytove_balicky", label: "Pobytové balíčky" }
];

const aboutNav = [
  { to: "/galerie", label: "Galerie" },
  { to: "/kontakt", label: "Kontakt" },
  { to: "/cenik", label: "Ceník" }
];

const langOptions = [
  { code: "cs", label: "Čeština" },
  { code: "en", label: "English" },
  { code: "pl", label: "Polski" },
  { code: "de", label: "Deutsch" }
];

const NavButton = ({ to, label, end }) => (
  <NavLink to={to} end={end}>
    {({ isActive }) => (
      <Button
        variant={isActive ? "contained" : "text"}
        sx={{
          textTransform: "none",
          fontWeight: isActive ? 600 : 500,
          px: 2,
          py: 1
        }}
      >
        {label}
      </Button>
    )}
  </NavLink>
);

export function DesktopHeader({ onLogin }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { i18n } = useTranslation("global");
  const { themeMode, toggleTheme } = useAppContext();
  const { isAuthenticated, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const currentLang = langOptions.find(lang => lang.code === i18n.language) || langOptions[0];

  return (
    <Box sx={{ display: { xs: "none", md: "flex" }, width: "100%", alignItems: "center" }}>
      {/* Left side */}
      <Stack direction="row" alignItems="center" spacing={1.5}>
        <Box
          component="img"
          src="logolidman.webp"
          alt="U Lidmanů"
          onClick={() => navigate("/")}
          sx={{ height: 40, cursor: "pointer", mr: 1 }}
        />
        
        {nav.map(({ to, label, end }) => (
          <NavButton key={to} to={to} label={label} end={end} />
        ))}
        
        <MenuButton
          label="O&nbsp;Nás"
          options={aboutNav.map(item => ({
            ...item,
            onClick: () => navigate(item.to),
            isActive: location.pathname === item.to
          }))}
          isActive={aboutNav.some(item => item.to === location.pathname)}
        />
      </Stack>

      {/* Spacer */}
      <Box sx={{ flexGrow: 1 }} />

      {/* Right side */}
      <Stack direction="row" spacing={2} alignItems="center">
        <MenuButton
          label={currentLang.label}
          options={langOptions.map(lang => ({
            ...lang,
            onClick: () => i18n.changeLanguage(lang.code),
            isActive: i18n.language === lang.code
          }))}
        />
        
        <IconButton 
          onClick={toggleTheme} 
          size="small"
          sx={{ p: 1, border: 1, borderColor: "divider" }}
        >
          {themeMode === 'dark' ? <LightModeIcon fontSize="small" /> : <DarkModeIcon fontSize="small" />}
        </IconButton>

        {isAuthenticated ? (
          <Button 
            onClick={handleLogout}
            startIcon={<LogoutIcon />}
            color="error"
            sx={{ textTransform: "none" }}
          >
            Odhlásit
          </Button>
        ) : (
          <Button 
            onClick={onLogin}
            variant="outlined"
            sx={{ textTransform: "none" }}
          >
            Login
          </Button>
        )}
      </Stack>
    </Box>
  );
}