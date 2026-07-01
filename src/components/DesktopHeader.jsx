import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { Box, Button, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";
import { langOptions } from "./headerConfig";

const navLinkSx = {
  position: "relative",
  display: "inline-flex",
  alignItems: "center",
  minHeight: 44,
  px: 1,
  color: "#2d2823",
  textDecoration: "none",
  userSelect: "none",
  transition: "color 180ms ease",
  "&::after": {
    content: '""',
    position: "absolute",
    left: 8, right: 8, bottom: 8,
    height: 2,
    bgcolor: "primary.main",
    transform: "scaleX(0)",
    transformOrigin: "center",
    opacity: 0,
    transition: "transform 180ms ease, opacity 180ms ease",
  },
  "&:hover, &.active": { color: "primary.dark" },
  "&:hover::after, &.active::after": { transform: "scaleX(1)", opacity: 1 },
};

const NavButton = ({ to, label, end }) => (
  <Box
    component={NavLink}
    to={to}
    end={end}
    className={({ isActive }) => (isActive ? "active" : "")}
    sx={navLinkSx}
  >
    <Typography
      component="span"
      sx={{
        fontSize: "0.82rem",
        fontWeight: 400,
        letterSpacing: 0,
        textTransform: "none",
        lineHeight: 1,
        ".active &": { fontWeight: 500 },
      }}
    >
      {label}
    </Typography>
  </Box>
);

export function DesktopHeader({ navItems = [] }) {
  const navigate = useNavigate();
  const { i18n } = useTranslation("global");
  const primaryNavItems = navItems.filter(({ to }) => to !== "/rezervace");
  const reservationItem = navItems.find(({ to }) => to === "/rezervace");
  const activeLang = String(i18n.resolvedLanguage || i18n.language || "cs").split("-")[0];

  return (
    <Box sx={{ display: "none", "@media (min-width:1300px)": { display: "flex" }, width: "100%", alignItems: "center", minHeight: 62 }}>
      <Box
        component="img"
        src="logolidman.webp"
        alt="U Lidmanů"
        onClick={() => navigate("/")}
        sx={{ cursor: "pointer", minWidth: 190, pr: 2, userSelect: "none", height: 48, objectFit: "contain" }}
      />

      <Box sx={{ flexGrow: 1, display: "flex", justifyContent: "center", px: 3 }}>
        <Box component="nav" sx={{ display: "flex", alignItems: "center", gap: 2.4 }}>
          {primaryNavItems.map(({ to, label, end }) => (
            <NavButton key={to} to={to} label={label} end={end} />
          ))}
        </Box>
      </Box>

      <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, minWidth: 260, justifyContent: "flex-end" }}>
        <Box sx={{ display: "flex", gap: 1 }}>
          {langOptions.map(({ code, label }) => (
            <Box
              key={code}
              component="button"
              type="button"
              onClick={() => i18n.changeLanguage(code)}
              sx={{
                border: 0, p: 0, m: 0, background: "none", cursor: "pointer",
                fontFamily: "inherit", fontSize: "0.76rem", letterSpacing: 0,
                textTransform: "uppercase",
                color: activeLang === code ? "text.primary" : "text.secondary",
                "&:hover": { color: "text.primary" },
              }}
            >
              {label.slice(0, 2)}
            </Box>
          ))}
        </Box>

        {reservationItem && (
          <Button
            component={NavLink}
            to={reservationItem.to}
            variant="outlined"
            sx={{
              minWidth: 116,
              borderRadius: 0,
              px: 2.25,
              py: 1,
              bgcolor: "primary.dark",
              borderColor: "primary.dark",
              color: "primary.contrastText",
              "&:hover, &.active": { bgcolor: "primary.main", borderColor: "primary.main" },
            }}
          >
            {reservationItem.label}
          </Button>
        )}
      </Box>
    </Box>
  );
}
