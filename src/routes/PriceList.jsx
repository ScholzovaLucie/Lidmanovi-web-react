import React from "react";
import {
  Box,
  Container,
  Paper,
  Typography,
  Table,
  TableBody,
  TableRow,
  TableCell,
  Divider,
} from "@mui/material";

/** Pomocný „pás“: obrázek jako background + text, střídání L/R, 90% šířky, centrované */
function ImageTextBand({
  image,
  title,
  children,
  imageLeft = true,
  minHeight = { xs: 360, md: 440 },
}) {
  const imgUrl = image?.startsWith("/") ? image : `/${image || ""}`;
  return (
    <Paper
      variant="outlined"
      sx={{
        width: { xs: "100%", md: "90%" },
        mx: "auto",
        mb: 3,
        borderRadius: 2,
        overflow: "hidden",
        display: "flex",
        flexDirection: { xs: "column", md: imageLeft ? "row" : "row-reverse" },
        minHeight,
        boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
      }}
    >
      {/* Obrázek jako background */}
      <Box
        sx={{
          flexBasis: { xs: "100%", md: "50%" },
          minHeight,
          backgroundImage: `url(${imgUrl})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          position: "relative",
          "&::after": {
            content: '""',
            position: "absolute",
            inset: 0,
            background: "rgba(0,0,0,.18)", // lehké ztmavení jako jinde
          },
        }}
      />
      {/* Text */}
      <Box
        sx={{
          flexBasis: { xs: "100%", md: "50%" },
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          px: { xs: 2, md: 4 },
          py: { xs: 3, md: 5 },
          textAlign: "center",
        }}
      >
        <Box sx={{ maxWidth: 720, width: "100%" }}>
          {title && (
            <Typography variant="h5" sx={{ fontWeight: 700, mb: 1.5 }}>
              {title}
            </Typography>
          )}
          {children}
        </Box>
      </Box>
    </Paper>
  );
}

export default function PriceList() {
  return (
    <Container maxWidth="lg" sx={{ py: { xs: 4, md: 6 } }}>
      {/* 1) Ceny pokojů */}
      <ImageTextBand
        image="/galerie/pokoje/039_HZ6_3852_Penzion_U_Lidmanu.webp"
        title="Uvedené ceny jsou za osobu a noc na pokojích včetně bufetové snídaně."
        imageLeft={true}
      >
        <Box sx={{ display: "grid", gap: 1.2 }}>
          <Box>
            <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
              Dvoulůžkový pokoj
            </Typography>
            <Typography variant="body1">550–750 Kč za osobu a noc*</Typography>
          </Box>
          <Box>
            <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
              Třílůžkový pokoj
            </Typography>
            <Typography variant="body1">520–680 Kč za osobu a noc*</Typography>
          </Box>
          <Box>
            <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
              Čtyřlůžkový pokoj
            </Typography>
            <Typography variant="body1">490–590 Kč za osobu a noc*</Typography>
          </Box>

          <Divider sx={{ my: 1.5 }} />

          <Typography variant="body2" color="text.secondary">
            cena nezahrnuje rekreační a ubytovací poplatek obci 20 Kč / noc /
            osoba (18–70 let)
          </Typography>
          <Typography variant="body2" color="text.secondary">
            *cena v závislosti na délce pobytu, typu pokoje, státních
            svátcích/prázdninách a aktuální obsazenosti penzionu
          </Typography>
        </Box>
      </ImageTextBand>

      {/* 2) Ubytování dětí */}
      <ImageTextBand
        image="/galerie/pokoje/058_HZ6_3886_Penzion_U_Lidmanu.webp"
        title="Ubytování dětí"
        imageLeft={false}
      >
        <Typography sx={{ mb: 1.5 }}>
          Uvedené ceny jsou za dítě a noc na pokoji včetně snídaně
          v&nbsp;doprovodu dvou dospělých osob. Děti do 2 let mají pobyt zdarma
          bez nároku na služby.
        </Typography>
        <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
          Děti od 2 do 10 let
        </Typography>
        <Typography variant="body1">450 Kč</Typography>
      </ImageTextBand>

      {/* 3) Příplatky – tabulka, obrázek vpravo */}
      <ImageTextBand
        image="/galerie/pokoje/081_HZ6_3941_Penzion_U_Lidmanu.webp"
        title="Příplatky"
        imageLeft={true}
      >
        <Table
          size="small"
          sx={{
            maxWidth: 760,
            mx: "auto",
            "& th, & td": { border: 0, py: 0.75 },
            textAlign: "center",
          }}
        >
          <TableBody>
            <TableRow>
              <TableCell component="th" sx={{ fontWeight: 500 }}>
                Jednolůžkový pokoj (pouze 1 osoba na dvoulůžkovém pokoji)
              </TableCell>
              <TableCell sx={{ fontWeight: 700 }}>790–990 Kč</TableCell>
            </TableRow>
            <TableRow>
              <TableCell component="th" sx={{ fontWeight: 500 }}>
                Večeře (menu o 2 chodech)
              </TableCell>
              <TableCell sx={{ fontWeight: 700 }}>199 Kč</TableCell>
            </TableRow>
            <TableRow>
              <TableCell component="th" sx={{ fontWeight: 500 }}>
                Večeře děti 3–10 let
              </TableCell>
              <TableCell sx={{ fontWeight: 700 }}>139 Kč</TableCell>
            </TableRow>
            <TableRow>
              <TableCell component="th" sx={{ fontWeight: 500 }}>
                Pobyt psa
              </TableCell>
              <TableCell sx={{ fontWeight: 700 }}>
                90 Kč / noc nebo 400 Kč / pobyt
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell component="th" sx={{ fontWeight: 500 }}>
                Příplatek za pobyt na jednu noc
              </TableCell>
              <TableCell sx={{ fontWeight: 700 }}>120 Kč / osoba</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </ImageTextBand>

      {/* 4) Další informace */}
      <ImageTextBand
        image="/galerie/interier/106_HZ6_3993_Penzion_U_Lidmanu.webp"
        title="Další informace"
        imageLeft={false}
      >
        <Box sx={{ display: "grid", gap: 0.75 }}>
          <Typography>
            V hlavní sezóně upřednostňujeme{" "}
            <b>TÝDENNÍ POBYTY (sobota–sobota)</b>.
          </Typography>
          <Typography>
            Pobyt je možné objednat i <b>BEZ SNÍDANĚ</b>. 460–560 Kč / osoba.
          </Typography>
          <Typography>Na přání Vám vytvoříme dárkový poukaz.</Typography>
        </Box>
      </ImageTextBand>
    </Container>
  );
}
