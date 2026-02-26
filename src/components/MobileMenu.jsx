import React from "react";
import { Box, Collapse, Stack, Button, Switch } from "@mui/material";
import { NavLink, useNavigate } from "react-router-dom";
import { LightMode as LightModeIcon, DarkMode as DarkModeIcon, Logout as LogoutIcon } from "@mui/icons-material";
import { useTranslation } from "react-i18next";
import { useAppContext } from "../context/AppContextProvider";
import { useAuth } from "../hooks/useAuth";

export function MobileMenu({ isOpen, onClose, navItems, langOptions, onLogin }) {
  const navigate = useNavigate();
  const { i18n, t } = useTranslation("global");
  const { themeMode, toggleTheme } = useAppContext();
  const { isAuthenticated, logout } = useAuth();
  const activeLang = String(i18n.resolvedLanguage || i18n.language || "cs").split(
    "-",
  )[0];

  const handleLogout = () => {
    logout();
    onClose();
  };

  return (
    <Collapse in={isOpen} timeout="auto" unmountOnExit>
      <Box sx={{ px: 2, py: 3 }}>
        {/* Navigation */}
        <Stack spacing={1} sx={{ mb: 3 }}>
          {navItems.map(({ to, label, end }) => (
            <NavLink key={to} to={to} end={end} onClick={onClose}>
              {({ isActive }) => (
                <Button
                  variant={isActive ? "contained" : "text"}
                  fullWidth
                  sx={{
                    justifyContent: "center",
                    textTransform: "none",
                    fontWeight: isActive ? 600 : 400,
                    py: 1.5,
                    fontSize: "1rem"
                  }}
                >
                  {label}
                </Button>
              )}
            </NavLink>
          ))}
        </Stack>

        {/* Controls */}
        <Stack spacing={3} alignItems="center">
          {/* Languages */}
          <Box sx={{ textAlign: "center", width: "100%" }}>
            <Box sx={{ color: "text.secondary", fontSize: "0.875rem", mb: 1.5 }}>
              {t("language")}
            </Box>
            <Stack direction="row" spacing={1} justifyContent="center" flexWrap="wrap">
              {langOptions.map(({ code, label }) => (
                <Button
                  key={code}
                  onClick={() => i18n.changeLanguage(code)}
                  variant={activeLang === code ? "contained" : "text"}
                  size="small"
                  sx={{ 
                    textTransform: "none",
                    fontWeight: activeLang === code ? 600 : 400,
                    minWidth: "auto"
                  }}
                >
                  {label}
                </Button>
              ))}
            </Stack>
          </Box>

          {/* Theme */}
          <Stack direction="row" spacing={2} alignItems="center">
            <LightModeIcon 
              fontSize="small" 
              sx={{ color: themeMode === 'light' ? 'primary.main' : 'text.disabled' }} 
            />
            <Switch
              checked={themeMode === 'dark'}
              onChange={toggleTheme}
              color="primary"
            />
            <DarkModeIcon 
              fontSize="small" 
              sx={{ color: themeMode === 'dark' ? 'primary.main' : 'text.disabled' }} 
            />
          </Stack>

          {/* Login/Logout */}
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
                  fontWeight: 500
                }}
                >
                {t("auth.logout")}
              </Button>
            </Stack>
          ) : (
            <Button 
              onClick={() => {
                onLogin();
                onClose();
              }}
              variant="outlined"
              sx={{ 
                textTransform: "none",
                fontWeight: 500
              }}
              >
              {t("auth.login")}
            </Button>
          )}
        </Stack>
      </Box>
    </Collapse>
  );
}
