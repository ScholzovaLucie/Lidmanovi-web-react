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
  color: "text.secondary",
  textDecoration: "none",
  userSelect: "none",
  transition: "color 180ms ease",
  "&::after": {
    content: '""',
    position: "absolute",
    left: 8, right: 8, bottom: 8,
    height: 2,
    bgcolor: "#9a8060",
    transform: "scaleX(0)",
    transformOrigin: "center",
    opacity: 0,
    transition: "transform 180ms ease, opacity 180ms ease",
  },
  "&:hover, &.active": { color: "text.primary" },
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
        fontSize: "0.72rem",
        fontWeight: 400,
        letterSpacing: "0.14em",
        textTransform: "uppercase",
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
        sx={{ cursor: "pointer", minWidth: 190, pr: 2, userSelect: "none", height: 46, objectFit: "contain" }}
      />

      <Box sx={{ flexGrow: 1, display: "flex", justifyContent: "center", px: 3 }}>
        <Box component="nav" sx={{ display: "flex", alignItems: "center", gap: 3 }}>
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
                fontFamily: "inherit", fontSize: "0.68rem", letterSpacing: "0.12em",
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
              minWidth: 116, borderRadius: 0, px: 2.25, py: 1,
              borderColor: "rgba(85, 116, 143, 0.72)",
              color: "text.primary",
              "&:hover, &.active": { bgcolor: "transparent", borderColor: "primary.dark" },
            }}
          >
            {reservationItem.label}
          </Button>
        )}
      </Box>
    </Box>
  );
}
