import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { Box, Button, Typography } from "@mui/material";
import { KeyboardArrowDown } from "@mui/icons-material";
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

const navLabelSx = {
  fontSize: "0.82rem",
  fontWeight: 400,
  letterSpacing: 0,
  textTransform: "none",
  lineHeight: 1,
  ".active &": { fontWeight: 500 },
};

const NavButton = ({ to, label, end }) => (
  <Box
    component={NavLink}
    to={to}
    end={end}
    className={({ isActive }) => (isActive ? "active" : "")}
    sx={navLinkSx}
  >
    <Typography component="span" sx={navLabelSx}>
      {label}
    </Typography>
  </Box>
);

const NavButtonWithChildren = ({ to, label, end, items }) => (
  <Box
    sx={{
      position: "relative",
      "&:hover > .dropdown-menu, &:focus-within > .dropdown-menu": {
        opacity: 1,
        visibility: "visible",
        transform: "translate(-50%, 0)",
      },
      "&:hover .chevron": { transform: "rotate(180deg)" },
    }}
  >
    <Box
      component={NavLink}
      to={to}
      end={end}
      className={({ isActive }) => (isActive ? "active" : "")}
      sx={{ ...navLinkSx, gap: 0.3 }}
    >
      <Typography component="span" sx={navLabelSx}>
        {label}
      </Typography>
      <KeyboardArrowDown
        className="chevron"
        sx={{ fontSize: 17, opacity: 0.55, transition: "transform 200ms ease" }}
      />
    </Box>

    <Box
      className="dropdown-menu"
      sx={{
        position: "absolute",
        top: "100%",
        left: "50%",
        pt: 1.25,
        minWidth: 190,
        opacity: 0,
        visibility: "hidden",
        transform: "translate(-50%, -6px)",
        transition: "opacity 180ms ease, transform 180ms ease, visibility 180ms",
        zIndex: 5,
      }}
    >
      <Box
        sx={{
          bgcolor: "#fffaf0",
          borderRadius: 2,
          border: "1px solid #ecdfc9",
          boxShadow: "0 20px 45px rgba(45,40,35,0.16)",
          overflow: "hidden",
          py: 0.75,
        }}
      >
        {items.map((item) => (
          <Box
            key={item.to}
            component={NavLink}
            to={item.to}
            className={({ isActive }) => (isActive ? "active" : "")}
            sx={{
              display: "block",
              mx: 0.75,
              my: 0.25,
              px: 1.5,
              py: 1,
              borderRadius: 1.25,
              fontSize: "0.82rem",
              color: "#2d2823",
              textDecoration: "none",
              transition: "background-color 140ms ease, color 140ms ease",
              "&:hover, &.active": {
                bgcolor: "primary.light",
                color: "primary.dark",
              },
            }}
          >
            {item.label}
          </Box>
        ))}
      </Box>
    </Box>
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
          {primaryNavItems.map(({ to, label, end, children }) =>
            children?.length ? (
              <NavButtonWithChildren key={to} to={to} label={label} end={end} items={children} />
            ) : (
              <NavButton key={to} to={to} label={label} end={end} />
            ),
          )}
        </Box>
      </Box>

      <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, minWidth: 260, justifyContent: "flex-end" }}>
        <Box sx={{ display: "flex", gap: 1 }}>
          {langOptions.map(({ code, label }) => (
            <Box
              key={code}
              component="button"
              type="button"
              title={label}
              onClick={() => i18n.changeLanguage(code)}
              sx={{
                border: 0, p: 0, m: 0, background: "none", cursor: "pointer",
                fontFamily: "inherit", fontSize: "0.76rem", letterSpacing: 0,
                textTransform: "uppercase",
                color: activeLang === code ? "text.primary" : "text.secondary",
                "&:hover": { color: "text.primary" },
              }}
            >
              {code}
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
