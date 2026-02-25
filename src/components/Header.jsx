import React from "react";
import { useNavigate } from "react-router-dom";
import {
  AppBar,
  Box,
  Container,
  IconButton,
  Stack,
  Toolbar,
} from "@mui/material";
import { Menu as MenuIcon, Close as CloseIcon } from "@mui/icons-material";
import { useModal } from "../hooks/useModal";
import { LoginModal } from "./LoginModal";
import { DesktopHeader } from "./DesktopHeader";
import { MobileMenu } from "./MobileMenu";

const allNavItems = [
  { to: "/", label: "Domů", end: true },
  { to: "/rezervace", label: "Rezervace" },
  { to: "/restaurace", label: "Restaurace" },
  { to: "/svatby", label: "Svatby" },
  { to: "/ubytovani", label: "Ubytování" },
  { to: "/pobytove_balicky", label: "Pobytové balíčky" },
  { to: "/galerie", label: "Galerie" },
  { to: "/kontakt", label: "Kontakt" },
  { to: "/cenik", label: "Ceník" },
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
          <DesktopHeader onLogin={loginModal.openModal} />

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
