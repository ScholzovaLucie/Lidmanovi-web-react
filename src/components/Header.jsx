import React from "react";
import { useNavigate } from "react-router-dom";
import {
  AppBar,
  Box,
  IconButton,
  Stack,
  Toolbar,
} from "@mui/material";
import { Menu as MenuIcon, Close as CloseIcon } from "@mui/icons-material";
import { useModal } from "../hooks/useModal";
import { LoginModal } from "./LoginModal";
import { DesktopHeader } from "./DesktopHeader";
import { MobileMenu } from "./MobileMenu";
import { useTranslation } from "react-i18next";

const navConfig = [
  { to: "/", key: "home", end: true },
  { to: "/restaurace", key: "restaurant" },
  { to: "/svatby", key: "weddings" },
  { to: "/ubytovani", key: "accommodation" },
  { to: "/pobytove_balicky", key: "packages" },
  { to: "/galerie", key: "gallery" },
  { to: "/kontakt", key: "contact" },
  { to: "/cenik", key: "priceList" },
  { to: "/rezervace", key: "reservation" },
];

const langOptions = [
  { code: "cs", label: "Čeština" },
  { code: "en", label: "English" },
  { code: "pl", label: "Polski" },
  { code: "de", label: "Deutsch" },
];

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const navigate = useNavigate();
  const loginModal = useModal();
  const { t } = useTranslation("global");

  const allNavItems = navConfig.map(({ key, ...rest }) => ({
    ...rest,
    label: t(`nav.${key}`),
  }));

  return (
    <AppBar
      position="sticky"
      elevation={0}
      sx={{
        backgroundColor: "background.paper",
        color: "text.primary",
        boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
      }}
    >
      <Box>
        <Toolbar>
          {/* Desktop */}
          <DesktopHeader onLogin={loginModal.openModal} navItems={allNavItems} />

          {/* Mobile */}
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            width="100%"
            sx={{ display: { xs: "flex", md: "none" } }}
          >
            <Box
              component="img"
              src="logolidman.webp"
              alt="U Lidmanů"
              onClick={() => navigate("/")}
              sx={{ height: 40, cursor: "pointer" }}
            />
            <IconButton onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
              {mobileMenuOpen ? <CloseIcon /> : <MenuIcon />}
            </IconButton>
          </Stack>
        </Toolbar>

        {/* Mobile Menu */}
        <Box sx={{ display: { xs: "block", md: "none" } }}>
          <MobileMenu
            isOpen={mobileMenuOpen}
            onClose={() => setMobileMenuOpen(false)}
            navItems={allNavItems}
            langOptions={langOptions}
            onLogin={loginModal.openModal}
          />
        </Box>
      </Box>

      <LoginModal isOpen={loginModal.isOpen} onClose={loginModal.closeModal} />
    </AppBar>
  );
}
