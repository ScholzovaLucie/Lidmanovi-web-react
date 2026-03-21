import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { Box, Button, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";
import { langOptions } from "./headerConfig";
import "./DesktopHeader.css";

const NavButton = ({ to, label, end }) => (
  <NavLink to={to} end={end} className={({ isActive }) => `desktop-header__link${isActive ? " active" : ""}`}>
    <Typography component="span" className="desktop-header__link-label">
      {label}
    </Typography>
  </NavLink>
);

export function DesktopHeader({ navItems = [] }) {
  const navigate = useNavigate();
  const { i18n } = useTranslation("global");
  const primaryNavItems = navItems.filter(({ to }) => to !== "/rezervace");
  const reservationItem = navItems.find(({ to }) => to === "/rezervace");
  const activeLang = String(i18n.resolvedLanguage || i18n.language || "cs").split("-")[0];

  return (
    <Box className="desktop-header">
      <Box
        component="img"
        src="logolidman.webp"
        alt="U Lidmanů"
        onClick={() => navigate("/")}
        className="desktop-header__logo"
      />

      <Box className="desktop-header__nav-wrap">
        <Box className="desktop-header__nav">
          {primaryNavItems.map(({ to, label, end }) => (
            <NavButton key={to} to={to} label={label} end={end} />
          ))}
        </Box>
      </Box>

      <Box className="desktop-header__actions">
        <Box className="desktop-header__langs">
          {langOptions.map(({ code, label }) => (
            <Box
              key={code}
              component="button"
              type="button"
              onClick={() => i18n.changeLanguage(code)}
              className={`desktop-header__lang${activeLang === code ? " desktop-header__lang--active" : ""}`}
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
            className="desktop-header__cta"
          >
            {reservationItem.label}
          </Button>
        )}
      </Box>
    </Box>
  );
}
