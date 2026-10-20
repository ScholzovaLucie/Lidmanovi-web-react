import React from "react";
import { useNavigate } from "react-router-dom";
import {
  AppBar,
  Box,
  IconButton,
  Stack,
  Toolbar,
  useMediaQuery,
} from "@mui/material";
import { Menu as MenuIcon, Close as CloseIcon } from "@mui/icons-material";
import { DesktopHeader } from "./DesktopHeader";
import { MobileMenu } from "./MobileMenu";
import { useTranslation } from "react-i18next";
import { langOptions, navConfig } from "./headerConfig";
import { useGetAppSettingsQuery } from "../redux/api/appSettingsApi";

export default function Header({ onLogin }) {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const isDesktop = useMediaQuery("(min-width:1300px)");
  const navigate = useNavigate();
  const { t } = useTranslation("global");
  const { data: appSettings, isSuccess: areAppSettingsLoaded } =
    useGetAppSettingsQuery();
  const showLanguageSwitcher =
    areAppSettingsLoaded && appSettings?.["languageSwitcher.enabled"] === true;

  React.useEffect(() => {
    if (!mobileMenuOpen || isDesktop) return undefined;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isDesktop, mobileMenuOpen]);

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
      <Box sx={{ width: "100%" }}>
        <Toolbar
          disableGutters
          sx={{
            minHeight: 68,
            maxHeight: 68,
            px: { xs: 1.5, md: 2 },
            "@media (min-width:1300px)": {
              minHeight: 64,
              maxHeight: 64,
            },
          }}
        >
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
              onClick={() => {
                navigate("/");
                setMobileMenuOpen(false);
              }}
              sx={{
                height: 44,
                maxWidth: "calc(100% - 56px)",
                objectFit: "contain",
                cursor: "pointer",
              }}
            />
            <IconButton
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label={
                mobileMenuOpen
                  ? t("buttons.close", { defaultValue: "Zavřít" })
                  : t("nav.openMenu", { defaultValue: "Otevřít menu" })
              }
              aria-expanded={mobileMenuOpen}
              sx={{
                width: 44,
                height: 44,
                color: "text.primary",
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
          />
        </Box>
      </Box>
    </AppBar>
  );
}
