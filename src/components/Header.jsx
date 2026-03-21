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
import { DesktopHeader } from "./DesktopHeader";
import { MobileMenu } from "./MobileMenu";
import { useTranslation } from "react-i18next";
import { langOptions, navConfig } from "./headerConfig";

export default function Header({ onLogin }) {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const navigate = useNavigate();
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
        zIndex: (theme) => theme.zIndex.appBar + 20,
        backgroundColor: "rgba(255,255,255,0.96)",
        boxShadow: "0 10px 30px rgba(17,25,35,0.06)",
      }}
    >
      <Box sx={{ px: { xs: 0.5, md: 2 } }}>
        <Toolbar>
          {/* Desktop */}
          <DesktopHeader onLogin={onLogin} navItems={allNavItems} />

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
              sx={{ height: 48, cursor: "pointer" }}
            />
            <IconButton
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              sx={{
                border: "1px solid",
                borderColor: "divider",
                borderRadius: 1.5,
              }}
            >
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
            onLogin={onLogin}
          />
        </Box>
      </Box>
    </AppBar>
  );
}
