import React from "react";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import Paper from "@mui/material/Paper";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import EditableTranslationText from "../components/EditableTranslationText";
import SubpageBanner from "../components/SubpageBanner.jsx";
import { selectIsAuthenticated } from "../redux/slices/app/appSlice";

export default function Weddings() {
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const { t } = useTranslation("svatby");
  const asset = (path) =>
    `${import.meta.env.BASE_URL}${path.replace(/^\/+/, "")}`;

  return (
    <>
      <SubpageBanner
        eyebrow={t("pageTitle")}
        title={t("heading")}
        image="/svatba/svatba3.webp"
        slides={[
          "/svatba/svatba3.webp",
          "/svatba/svatba4.webp",
          "/svatba/svatba6.webp",
          "/svatba/svatba8.webp",
        ]}
      />
      <Container maxWidth="md" sx={{ pt: { xs: 4, md: 5 }, pb: { xs: 5, md: 7 } }}>
        <Paper
          sx={{
            position: "relative",
            p: { xs: 3, md: 4 },
            overflow: "hidden",
            border: "1px solid",
            borderColor: isAuthenticated ? "secondary.main" : "rgba(85,116,143,0.12)",
            background: "rgba(255,255,255,0.96)",
            outline: isAuthenticated ? "1px dashed" : "none",
            outlineColor: isAuthenticated ? "secondary.main" : "transparent",
          }}
        >
          {isAuthenticated && (
            <Box
              sx={{
                position: "absolute",
                top: 8,
                right: 8,
                px: 1,
                py: 0.25,
                borderRadius: 1,
                bgcolor: "secondary.main",
                color: "secondary.contrastText",
                fontSize: 11,
                fontWeight: 700,
              }}
            >
              Editovatelný blok
            </Box>
          )}

          <EditableTranslationText
            ns="svatby"
            i18nKey="intro"
            variant="h5"
            sx={{
              position: "relative",
              zIndex: 1,
              textAlign: "center",
              fontWeight: 400,
              mb: { xs: 3, md: 4 },
            }}
            align="center"
            multilineRows={4}
          />

          <List
            sx={{
              position: "relative",
              zIndex: 1,
              width: "100%",
              maxWidth: 760,
              textAlign: "center",
              mx: "auto",
              "& .MuiListItem-root": {
                py: 1.6,
                borderTop: "1px solid rgba(85,116,143,0.08)",
              },
              "& .MuiListItem-root:first-of-type": {
                borderTop: 0,
              },
            }}
          >
            <ListItem disableGutters>
              <ListItemText
                primary={
                  <>
                    <EditableTranslationText ns="svatby" i18nKey="ceremonyTitle" align="center" />
                    <EditableTranslationText ns="svatby" i18nKey="ceremonyText" align="center" />
                  </>
                }
              />
            </ListItem>
            <ListItem disableGutters>
              <ListItemText
                primary={
                  <>
                    <EditableTranslationText ns="svatby" i18nKey="cateringTitle" align="center" />
                    <EditableTranslationText ns="svatby" i18nKey="cateringText" align="center" />
                  </>
                }
              />
            </ListItem>
            <ListItem disableGutters>
              <ListItemText
                primary={
                  <>
                    <EditableTranslationText ns="svatby" i18nKey="accommodationTitle" align="center" />
                    <EditableTranslationText ns="svatby" i18nKey="accommodationText" align="center" />
                  </>
                }
              />
            </ListItem>
          </List>

          <Box
            component="img"
            src={asset("/two-hearts_roh_hnedy.webp")}
            alt=""
            sx={{
              position: "absolute",
              right: 0,
              bottom: 0,
              width: { xs: "20vw", md: "16vw" },
              maxWidth: 220,
              opacity: 0.26,
              zIndex: 0,
              pointerEvents: "none",
              userSelect: "none",
            }}
          />
        </Paper>
      </Container>
    </>
  );
}
