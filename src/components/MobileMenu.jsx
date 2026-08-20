import React, { useEffect, useState } from "react";
import { Box, Collapse, Stack, Button, Paper, IconButton } from "@mui/material";
import { NavLink, useNavigate } from "react-router-dom";
import { Logout as LogoutIcon, KeyboardArrowDown } from "@mui/icons-material";
import { useTranslation } from "react-i18next";
import { useAuth } from "../hooks/useAuth";

export function MobileMenu({
  isOpen,
  onClose,
  navItems,
  langOptions,
  showLanguageSwitcher = false,
  onLogin,
}) {
  const navigate = useNavigate();
  const { i18n, t } = useTranslation("global");
  const { isAuthenticated, logout } = useAuth();
  const [expandedKey, setExpandedKey] = useState(null);
  const activeLang = String(
    i18n.resolvedLanguage || i18n.language || "cs",
  ).split("-")[0];

  useEffect(() => {
    if (!isOpen) setExpandedKey(null);
  }, [isOpen]);

  const handleLogout = () => {
    logout();
    onClose();
  };

  const toggleExpanded = (key) => {
    setExpandedKey((prev) => (prev === key ? null : key));
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
          maxHeight: "calc(100vh - 64px)",
          overflowY: "auto",
        }}
      >
        {/* Navigation */}
        <Stack spacing={1} sx={{ mb: 3 }}>
          {navItems.map(({ to, label, end, children }) => {
            const hasChildren = !!children?.length;
            const isExpanded = expandedKey === to;

            return (
              <React.Fragment key={to}>
                <Stack direction="row" alignItems="center" spacing={0.5}>
                  <Button
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
                  {hasChildren && (
                    <IconButton
                      onClick={() => toggleExpanded(to)}
                      size="small"
                      aria-label={isExpanded ? "Skrýt podsekce" : "Zobrazit podsekce"}
                      sx={{
                        flexShrink: 0,
                        color: "text.secondary",
                        transform: isExpanded ? "rotate(180deg)" : "none",
                        transition: "transform 150ms ease",
                      }}
                    >
                      <KeyboardArrowDown />
                    </IconButton>
                  )}
                </Stack>
                {hasChildren && (
                  <Collapse in={isExpanded} timeout="auto" unmountOnExit>
                    <Stack spacing={0.5} sx={{ pl: 2, pt: 0.5 }}>
                      {children.map((child) => (
                        <Button
                          key={child.to}
                          component={NavLink}
                          to={child.to}
                          end={child.end}
                          onClick={onClose}
                          fullWidth
                          sx={{
                            justifyContent: "center",
                            textTransform: "none",
                            fontWeight: 400,
                            py: 1,
                            fontSize: "0.9rem",
                            color: "text.secondary",
                            borderRadius: 1.5,
                            "&.active": {
                              fontWeight: 600,
                              bgcolor: "rgba(85,116,143,0.08)",
                              color: "primary.dark",
                            },
                          }}
                        >
                          {child.label}
                        </Button>
                      ))}
                    </Stack>
                  </Collapse>
                )}
              </React.Fragment>
            );
          })}
        </Stack>

        {/* Controls */}
        <Stack spacing={3} alignItems="center">
          {/* Languages */}
          {showLanguageSwitcher && (
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
          )}

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
