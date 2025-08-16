import React from "react";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import HeroCarousel from "../components/HeroCarousel.jsx"; // používáme tvůj existující
import Paper from "@mui/material/Paper";

export default function Weddings() {
  return (
    <>
      {/* HERO – můžeš dát 1+ fotek, auto-rotace jako jinde */}
      <HeroCarousel
        slides={[
          { src: "/svatba/svatba3.webp" },
          { src: "/svatba/svatba4.webp" },
          { src: "/svatba/svatba5.webp" },
          { src: "/svatba/svatba6.webp" },
          { src: "/svatba/svatba7.webp" },
          { src: "/svatba/svatba8.webp" },
          { src: "/svatba/svatba9.webp" },
          { src: "/svatba/svatba1.webp" },
        ]}
        interval={4000}
        transition={600}
        gradientTop="#9eb5c9"
      />

      {/* Sekce v boxu */}
      <Container maxWidth="md" sx={{ py: { xs: 4, md: 6 } }}>
        <Paper
          variant="outlined"
          sx={{
            p: { xs: 2, md: 4 },
            position: "relative",
            overflow: "hidden",
          }}
        >
          {/* Úvodní text */}
          <Typography
            variant="h5"
            sx={{
              textAlign: "center",
              fontWeight: 600,
              mb: { xs: 3, md: 4 },
            }}
          >
            Naše restaurace je ideální k uspořádání Vaší svatby – nejen díky
            romantické okolní krajině, ale i díky dispozicím našich prostor.
          </Typography>

          {/* Seznam výhod */}
          <List
            sx={{
              width: "100%",
              maxWidth: 760,
              textAlign: "center",
              mx: "auto",
              "& .MuiListItem-root": { py: 1 },
            }}
          >
            <ListItem disableGutters>
              <ListItemText primary="Velký společenský sál – svatební tabule až pro 70 osob" />
            </ListItem>
            <ListItem disableGutters>
              <ListItemText primary="Celková kapacita svatby až 90 osob" />
            </ListItem>
            <ListItem disableGutters>
              <ListItemText primary="Svatební menu a raut dle Vašich představ a požadavků" />
            </ListItem>
            <ListItem disableGutters>
              <ListItemText primary="Pro menší svatby salónek restaurace s kapacitou 20 osob" />
            </ListItem>
          </List>

          {/* Dekorativní srdce uvnitř boxu */}
          <Box
            component="img"
            src="/two-hearts_roh_hnedy.webp"
            alt=""
            sx={{
              position: "absolute",
              right: { xs: 0, md: 0 },
              bottom: { xs: 0, md: 0 },
              width: { xs: "20vw", md: "16vw" },
              opacity: 0.85,
              pointerEvents: "none",
              userSelect: "none",
            }}
          />
        </Paper>
      </Container>
    </>
  );
}
