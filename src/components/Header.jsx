import React from "react";
import { useNavigate } from "react-router-dom";
import { AppBar, Box, IconButton, Stack, Toolbar } from "@mui/material";
import { Menu as MenuIcon, Close as CloseIcon } from "@mui/icons-material";
import { DesktopHeader } from "./DesktopHeader";
import { MobileMenu } from "./MobileMenu";
import { useTranslation } from "react-i18next";
import { langOptions, navConfig } from "./headerConfig";
import { useGetAppSettingsQuery } from "../redux/api/appSettingsApi";

export default function Header({ onLogin }) {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const navigate = useNavigate();
  const { t } = useTranslation("global");
  const { data: appSettings, isSuccess: areAppSettingsLoaded } =
    useGetAppSettingsQuery();
  const showLanguageSwitcher =
    areAppSettingsLoaded && appSettings?.["languageSwitcher.enabled"] === true;

  const allNavItems = navConfig.map(({ key, fallback, children, ...rest }) => ({
    ...rest,
    label: t(`nav.${key}`, { defaultValue: fallback }),
    children: children?.map(({ key: childKey, fallback: childFallback, ...childRest }) => ({
      ...childRest,
      label: t(`nav.${childKey}`, { defaultValue: childFallback }),
    })),
  }));

  return (
    <AppBar
      position="sticky"
      alignItems="center"
      justifyContent="center"
      display="flex"
      flexGrow={1}
      sx={{
        top: 0,
        zIndex: (theme) => theme.zIndex.appBar + 20,
        backgroundColor: "#fffaf0",
        boxShadow: "none",
        borderBottom: "1px solid #dfd4c4",
      }}
    >
      <Box sx={{ px: { xs: 0.5, md: 2 }, py: 0 }}>
        <Toolbar sx={{ minHeight: "64px", maxHeight: "64px" }}>
          {/* Desktop */}
          <DesktopHeader
            onLogin={onLogin}
            navItems={allNavItems}
            showLanguageSwitcher={showLanguageSwitcher}
          />

          {/* Mobile */}
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            width="100%"
            sx={{
              display: "flex",
              "@media (min-width:1300px)": { display: "none" },
            }}
          >
            <Box
              component="img"
              src="logolidman.webp"
              alt="U Lidmanů"
              onClick={() => navigate("/")}
              sx={{
                height: window.innerWidth >= 1300 ? "48px" : "40px",
                cursor: "pointer",
              }}
            />
            <IconButton
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              size={window.innerWidth >= 1300 ? "medium" : "small"}
              sx={{
                border: "1px solid",
                borderColor: "#d8cbb8",
                borderRadius: 0,
              }}
            >
              {mobileMenuOpen ? <CloseIcon /> : <MenuIcon />}
            </IconButton>
          </Stack>
        </Toolbar>

        {/* Mobile Menu */}
        <Box
          sx={{
            display: "block",
            "@media (min-width:1300px)": { display: "none" },
          }}
        >
          <MobileMenu
            isOpen={mobileMenuOpen}
            onClose={() => setMobileMenuOpen(false)}
            navItems={allNavItems}
            langOptions={langOptions}
            showLanguageSwitcher={showLanguageSwitcher}
            onLogin={onLogin}
          />
        </Box>
      </Box>
    </AppBar>
  );
}
