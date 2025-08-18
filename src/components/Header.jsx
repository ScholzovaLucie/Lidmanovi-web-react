import React from "react";
import { Link, NavLink } from "react-router-dom";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Container from "@mui/material/Container";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import MenuIcon from "@mui/icons-material/Menu";
import { useTranslation } from "react-i18next";
import { Divider } from "@mui/material";

const nav = [
  { to: "/", label: "Domů", end: true },
  { to: "/kontakt", label: "Kontakt" },
  { to: "/restaurace", label: "Restaurace" },
  { to: "/ubytovani", label: "Ubytování" },
  { to: "/svatby", label: "Svatby" },
  { to: "/pobytove_balicky", label: "Pobytové balíčky" },
  { to: "/cenik", label: "Ceník" },
  { to: "/galerie", label: "Galerie" },
  { to: "/rezervace", label: "Rezervace" },
];

const asset = (path) =>
  `${import.meta.env.BASE_URL}${path.replace(/^\/+/, "")}`;

export default function Header() {
  const [open, setOpen] = React.useState(false);
  const { t, i18n } = useTranslation("global");

  const LangBtn = ({ code, label }) => (
    <Button
      onClick={() => i18n.changeLanguage(code)}
      sx={{ textTransform: "none", mx: 0.5 }}
      size="small"
      variant={i18n.language === code ? "contained" : "text"}
    >
      {label}
    </Button>
  );

  return (
    <AppBar
      position="sticky"
      elevation={0}
      sx={{
        backgroundColor: "background.paper",
        color: "text.primary",
        // ↓↓↓ LEHKÝ STÍN POD NAVIGACÍ
        boxShadow: "0 4px 16px rgba(0,0,0,0.06)",
      }}
    >
      <Container sx={{ height: "100%" }}>
        <Toolbar
          sx={{
            minHeight: 72, // rozumná výška topnav
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 2,
          }}
        >
          {/* Desktop navigace */}
          <Box
            sx={{
              display: { xs: "none", md: "flex" },
              alignItems: "stretch",
              justifyContent: "space-between",
              flexGrow: 1,
              height: "100%",
            }}
          >
            {nav.map(({ to, label, end }) => (
              <NavLink key={to} to={to} end={end} style={{ flexGrow: 1 }}>
                {({ isActive }) => (
                  <Button
                    variant="text"
                    fullWidth
                    sx={{
                      height: "100%",
                      borderRadius: 1,
                      textTransform: "none",
                      fontWeight: isActive ? 700 : 500,
                      color: isActive ? "#fff" : "text.secondary",
                      backgroundColor: isActive
                        ? "primary.main"
                        : "transparent",
                      "&:hover": {
                        backgroundColor: isActive
                          ? "primary.dark"
                          : "action.hover",
                        color: isActive ? "#fff" : "text.primary",
                      },
                    }}
                  >
                    {label}
                  </Button>
                )}
              </NavLink>
            ))}
            <Divider orientation="vertical" flexItem />
            <Box sx={{ display: "flex", alignItems: "center", pl: 1 }}>
              <LangBtn code="cs" label="CZ" />
              <LangBtn code="en" label="EN" />
              <LangBtn code="pl" label="PL" />
              <LangBtn code="de" label="DE" />
            </Box>
          </Box>

          {/* Mobilní menu */}
          <Toolbar
            sx={{
              width: "100vw",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Box
              component="img"
              src={asset("/logolidman.webp")}
              alt="Logo"
              loading="lazy"
              decoding="async"
              draggable={false}
              sx={{
                height: 56, // výška loga (můžeš dát třeba theme.spacing(7))
                width: "auto",
                display: "block",
                flexShrink: 0,
                filter: "drop-shadow(0 0 3px rgba(255,255,255,0.6))",
              }}
            />
            <IconButton
              onClick={() => setOpen(true)}
              aria-label="Menu"
              edge="start"
              size="large"
            >
              <MenuIcon />
            </IconButton>
          </Toolbar>
        </Toolbar>
      </Container>

      <Drawer
        anchor="right"
        open={open}
        onClose={() => setOpen(false)}
        PaperProps={{ sx: { width: 320 } }}
      >
        <List
          sx={{
            p: 0,
            "& .MuiListItemButton-root": {
              borderRadius: 0, // stejně jako na desktopu
            },
          }}
        >
          {nav.map(({ to, label, end }) => (
            <NavLink key={to} to={to} end={end}>
              {({ isActive }) => (
                <Button
                  variant="text"
                  fullWidth
                  sx={{
                    height: "12%",
                    borderRadius: 0,
                    textTransform: "none",
                    fontWeight: isActive ? 700 : 500,
                    color: isActive ? "#fff" : "text.secondary",
                    backgroundColor: isActive ? "primary.main" : "transparent",
                    "&:hover": {
                      backgroundColor: isActive
                        ? "primary.dark"
                        : "action.hover",
                      color: isActive ? "#fff" : "text.primary",
                    },
                  }}
                >
                  {label}
                </Button>
              )}
            </NavLink>
          ))}
          <Divider />
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              flexDirection: "column",
              pl: 1,
            }}
          >
            <LangBtn code="cs" label="CZ" />
            <LangBtn code="en" label="EN" />
            <LangBtn code="pl" label="PL" />
            <LangBtn code="de" label="DE" />
          </Box>
        </List>
      </Drawer>
    </AppBar>
  );
}
