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
import { useTranslation } from "react-i18next";
import ImageTextBand from "../components/ImageTextBand";

export default function PriceList() {
  const { t } = useTranslation(["cenik"]);

  const asset = (path) =>
    `${import.meta.env.BASE_URL}${path.replace(/^\/+/, "")}`;

  return (
    <Container maxWidth="lg" sx={{ py: { xs: 4, md: 6 } }}>
      {/* 1) Ceny pokojů */}
      <ImageTextBand
        image={asset("/galerie/pokoje/039_HZ6_3852_Penzion_U_Lidmanu.webp")}
        title={t("rooms.lead")}
        imageLeft={true}
      >
        <Box sx={{ display: "grid", gap: 1.2 }}>
          <Box>
            <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
              {t("rooms.items.0.name")}
            </Typography>
            <Typography variant="body1">{t("rooms.items.0.price")}</Typography>
          </Box>
          <Box>
            <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
              {t("rooms.items.1.name")}
            </Typography>
            <Typography variant="body1">{t("rooms.items.1.price")}</Typography>
          </Box>
          <Box>
            <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
              {t("rooms.items.2.name")}
            </Typography>
            <Typography variant="body1">{t("rooms.items.2.price")}</Typography>
          </Box>

          <Divider sx={{ my: 1.5 }} />

          <Typography variant="body2" color="text.secondary">
            {t("rooms.notes.0")}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {t("rooms.notes.1")}
          </Typography>
        </Box>
      </ImageTextBand>

      {/* 2) Ubytování dětí */}
      <ImageTextBand
        image={asset("/galerie/pokoje/058_HZ6_3886_Penzion_U_Lidmanu.webp")}
        title={t("children.title")}
        imageLeft={false}
      >
        <Typography sx={{ mb: 1.5 }}>{t("children.text")}</Typography>
        <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
          {t("children.labelAge")}
        </Typography>
        <Typography variant="body1">{t("children.price")}</Typography>
      </ImageTextBand>

      {/* 3) Příplatky – tabulka, obrázek vpravo */}
      <ImageTextBand
        image={asset("/galerie/pokoje/081_HZ6_3941_Penzion_U_Lidmanu.webp")}
        title={t("surcharges.title")}
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
                {t("surcharges.rows.0.label")}
              </TableCell>
              <TableCell sx={{ fontWeight: 700 }}>
                {t("surcharges.rows.0.price")}
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell component="th" sx={{ fontWeight: 500 }}>
                {t("surcharges.rows.1.label")}
              </TableCell>
              <TableCell sx={{ fontWeight: 700 }}>
                {t("surcharges.rows.1.price")}
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell component="th" sx={{ fontWeight: 500 }}>
                {t("surcharges.rows.2.label")}
              </TableCell>
              <TableCell sx={{ fontWeight: 700 }}>
                {t("surcharges.rows.2.price")}
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell component="th" sx={{ fontWeight: 500 }}>
                {t("surcharges.rows.3.label")}
              </TableCell>
              <TableCell sx={{ fontWeight: 700 }}>
                {t("surcharges.rows.3.price")}
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell component="th" sx={{ fontWeight: 500 }}>
                {t("surcharges.rows.4.label")}
              </TableCell>
              <TableCell sx={{ fontWeight: 700 }}>
                {t("surcharges.rows.4.price")}
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </ImageTextBand>

      {/* 4) Další informace */}
      <ImageTextBand
        image={asset("/galerie/interier/106_HZ6_3993_Penzion_U_Lidmanu.webp")}
        title={t("moreInfo.title")}
        imageLeft={false}
      >
        <Box sx={{ display: "grid", gap: 0.75 }}>
          <Typography>{t("moreInfo.items.0")}</Typography>
          <Typography>{t("moreInfo.items.1")}</Typography>
          <Typography>{t("moreInfo.items.2")}</Typography>
        </Box>
      </ImageTextBand>
    </Container>
  );
}
