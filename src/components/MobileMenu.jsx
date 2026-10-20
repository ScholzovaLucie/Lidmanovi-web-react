import React, { useEffect, useState } from "react";
import { Box, Stack, Button, Paper, IconButton } from "@mui/material";
import { NavLink, useNavigate } from "react-router-dom";
import {
  ArrowForward,
  KeyboardArrowDown,
  Language,
  Logout as LogoutIcon,
} from "@mui/icons-material";
import { useTranslation } from "react-i18next";
import { useAuth } from "../hooks/useAuth";

const bookStayFallbacks = {
  cs: "Rezervovat pobyt",
  en: "Book your stay",
  de: "Aufenthalt buchen",
  pl: "Zarezerwuj pobyt",
};

export function MobileMenu({
  isOpen,
  onClose,
  navItems,
  langOptions,
  showLanguageSwitcher = false,
}) {
  const navigate = useNavigate();
  const { i18n, t } = useTranslation("global");
  const { isAuthenticated, logout } = useAuth();
  const [expandedKey, setExpandedKey] = useState(null);
  const [languageMenuOpen, setLanguageMenuOpen] = useState(false);
  const activeLang = String(
    i18n.resolvedLanguage || i18n.language || "cs",
  ).split("-")[0];
  const activeLanguage = langOptions.find(({ code }) => code === activeLang);
  const primaryNavItems = navItems.filter(({ to }) => to !== "/rezervace");
  const reservationItem = navItems.find(({ to }) => to === "/rezervace");

  useEffect(() => {
    if (!isOpen) {
      setExpandedKey(null);
      setLanguageMenuOpen(false);
    }
  }, [isOpen]);

  const handleLogout = () => {
    logout();
    onClose();
  };

  const toggleExpanded = (key) => {
    setExpandedKey((prev) => (prev === key ? null : key));
  };

  return (
    <Paper
      square
      elevation={0}
      aria-hidden={!isOpen}
      sx={{
        position: "fixed",
        inset: "68px 0 0",
        display: "flex",
        flexDirection: "column",
        bgcolor: "background.paper",
        opacity: isOpen ? 1 : 0,
        visibility: isOpen ? "visible" : "hidden",
        transform: isOpen ? "translateY(0)" : "translateY(-8px)",
        transition: "opacity 200ms ease, transform 200ms ease, visibility 200ms",
        pointerEvents: isOpen ? "auto" : "none",
      }}
    >
        <Stack
          component="nav"
          aria-label={t("nav.mainMenu", { defaultValue: "Hlavní navigace" })}
          sx={{
            flex: "1 1 auto",
            minHeight: 0,
            overflowY: "auto",
            px: 3,
            py: 2,
          }}
        >
          {primaryNavItems.map(({ to, label, end, children }) => {
            const hasChildren = !!children?.length;
            const isExpanded = expandedKey === to;

            return (
              <React.Fragment key={to}>
                <Stack direction="row" alignItems="center" minHeight={52}>
                  <Button
                    component={NavLink}
                    to={to}
                    end={end}
                    onClick={onClose}
                    fullWidth
                    sx={{
                      justifyContent: "flex-start",
                      minHeight: 52,
                      px: 0,
                      fontWeight: 500,
                      fontSize: "1rem",
                      color: "text.primary",
                      textAlign: "left",
                      "&.active": {
                        fontWeight: 600,
                        color: "primary.dark",
                      },
                    }}
                  >
                    {label}
                  </Button>
                  {hasChildren && (
                    <IconButton
                      onClick={() => toggleExpanded(to)}
                      aria-label={isExpanded ? "Skrýt podsekce" : "Zobrazit podsekce"}
                      aria-expanded={isExpanded}
                      sx={{
                        flexShrink: 0,
                        width: 44,
                        height: 44,
                        mr: -1.25,
                        color: "text.secondary",
                        transform: isExpanded ? "rotate(180deg)" : "none",
                        transition: "transform 200ms ease",
                      }}
                    >
                      <KeyboardArrowDown />
                    </IconButton>
                  )}
                </Stack>
                {hasChildren && (
                  <Box
                    sx={{
                      display: "grid",
                      gridTemplateRows: isExpanded ? "1fr" : "0fr",
                      transition: "grid-template-rows 200ms ease",
                    }}
                  >
                    <Box sx={{ minHeight: 0, overflow: "hidden" }}>
                      <Stack sx={{ pl: 2, pb: isExpanded ? 1 : 0 }}>
                        {children.map((child) => (
                          <Button
                            key={child.to}
                            component={NavLink}
                            to={child.to}
                            end={child.end}
                            onClick={onClose}
                            tabIndex={isExpanded ? 0 : -1}
                            fullWidth
                            sx={{
                              justifyContent: "flex-start",
                              minHeight: 44,
                              px: 0,
                              fontWeight: 400,
                              fontSize: "0.9rem",
                              color: "text.secondary",
                              "&.active": {
                                fontWeight: 600,
                                color: "primary.dark",
                              },
                            }}
                          >
                            {child.label}
                          </Button>
                        ))}
                      </Stack>
                    </Box>
                  </Box>
                )}
              </React.Fragment>
            );
          })}
        </Stack>

        <Stack
          spacing={1.25}
          sx={{
            flex: "0 0 auto",
            px: 3,
            pt: 2,
            pb: "max(20px, env(safe-area-inset-bottom))",
            borderTop: "1px solid",
            borderColor: "divider",
          }}
        >
          {reservationItem && (
            <Button
              component={NavLink}
              to={reservationItem.to}
              onClick={onClose}
              variant="contained"
              endIcon={<ArrowForward />}
              fullWidth
              sx={{
                minHeight: 52,
                justifyContent: "center",
                bgcolor: "primary.dark",
                fontSize: "1rem",
                fontWeight: 600,
                "&:hover, &.active": { bgcolor: "primary.main" },
              }}
            >
              {t("nav.bookStay", {
                defaultValue: bookStayFallbacks[activeLang] || reservationItem.label,
              })}
            </Button>
          )}

          {showLanguageSwitcher && (
            <Box>
              <Button
                onClick={() => setLanguageMenuOpen((open) => !open)}
                startIcon={<Language />}
                endIcon={<KeyboardArrowDown />}
                aria-expanded={languageMenuOpen}
                fullWidth
                sx={{
                  minHeight: 48,
                  px: 0,
                  justifyContent: "flex-start",
                  color: "text.primary",
                  fontWeight: 500,
                  "& .MuiButton-endIcon": {
                    ml: "auto",
                    transform: languageMenuOpen ? "rotate(180deg)" : "none",
                    transition: "transform 200ms ease",
                  },
                }}
              >
                {activeLanguage?.label || t("language")}
              </Button>
              <Box
                sx={{
                  display: "grid",
                  gridTemplateRows: languageMenuOpen ? "1fr" : "0fr",
                  transition: "grid-template-rows 200ms ease",
                }}
              >
                <Box sx={{ minHeight: 0, overflow: "hidden" }}>
                  <Stack direction="row" flexWrap="wrap" sx={{ pb: 0.5, mx: -1 }}>
                    {langOptions.map(({ code, label }) => (
                      <Button
                        key={code}
                        onClick={() => {
                          i18n.changeLanguage(code);
                          setLanguageMenuOpen(false);
                        }}
                        tabIndex={languageMenuOpen ? 0 : -1}
                        aria-current={activeLang === code ? "true" : undefined}
                        sx={{
                          minHeight: 44,
                          color: activeLang === code ? "primary.dark" : "text.secondary",
                          fontWeight: activeLang === code ? 600 : 400,
                          textDecoration: activeLang === code ? "underline" : "none",
                          textUnderlineOffset: "0.35em",
                        }}
                      >
                        {label}
                      </Button>
                    ))}
                  </Stack>
                </Box>
              </Box>
            </Box>
          )}

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
    </Paper>
  );
}
