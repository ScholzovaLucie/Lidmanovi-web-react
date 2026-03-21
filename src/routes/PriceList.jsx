import React from "react";
import {
  Box,
  Button,
  Container,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableRow,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { useTranslation } from "react-i18next";
import EditableTranslationText from "../components/EditableTranslationText";
import ImageTextBand from "../components/ImageTextBand";
import SubpageBanner from "../components/SubpageBanner.jsx";
import { useEditorialEditor } from "../context/editorialEditorContext";

export default function PriceList() {
  const { t } = useTranslation("cenik");
  const {
    isAuthenticated,
    isInlineEditing,
    getInlineValue,
    setInlineValue,
  } = useEditorialEditor();
  const asset = (path) =>
    `${import.meta.env.BASE_URL}${path.replace(/^\/+/, "")}`;

  const roomsItems = getInlineValue(
    "cenik.rooms.items",
    t("rooms.items", { returnObjects: true }),
  ) || [];
  const resolvedRoomsItems = Array.isArray(roomsItems) ? roomsItems : [];

  const surchargeItems = getInlineValue(
    "cenik.surcharges.rows",
    t("surcharges.rows", { returnObjects: true }),
  ) || [];
  const resolvedSurchargeItems = Array.isArray(surchargeItems)
    ? surchargeItems
    : [];

  const addRoomVariant = () => {
    const next = [
      ...resolvedRoomsItems,
      { name: "Nová varianta pokoje", price: "Doplňte cenu" },
    ];
    setInlineValue("cenik.rooms.items", next);
  };

  const addSurchargeVariant = () => {
    const next = [
      ...resolvedSurchargeItems,
      { label: "Nový příplatek", price: "Doplňte cenu" },
    ];
    setInlineValue("cenik.surcharges.rows", next);
  };

  return (
    <>
      <SubpageBanner
        eyebrow={t("pageTitle")}
        title={t("pageTitle")}
        image="/galerie/pokoje/039_HZ6_3852_Penzion_U_Lidmanu.webp"
        slides={[
          "/galerie/pokoje/039_HZ6_3852_Penzion_U_Lidmanu.webp",
          "/galerie/pokoje/058_HZ6_3886_Penzion_U_Lidmanu.webp",
          "/galerie/pokoje/081_HZ6_3941_Penzion_U_Lidmanu.webp",
        ]}
      />
      <Container maxWidth="lg" sx={{ py: { xs: 5, md: 7 } }}>
        <ImageTextBand
          image={asset("/galerie/pokoje/039_HZ6_3852_Penzion_U_Lidmanu.webp")}
          titleNode={
            <EditableTranslationText
              ns="cenik"
              i18nKey="rooms.lead"
              variant="h5"
              multilineRows={3}
            />
          }
          imageLeft
        >
          <Box sx={{ display: "grid", gap: 1.2 }}>
            {resolvedRoomsItems.map((_, index) => (
              <Box key={`room-item-${index}`}>
                <EditableTranslationText
                  ns="cenik"
                  i18nKey={`rooms.items.${index}.name`}
                  variant="subtitle1"
                  sx={{ fontWeight: 700 }}
                />
                <EditableTranslationText
                  ns="cenik"
                  i18nKey={`rooms.items.${index}.price`}
                  variant="body1"
                />
              </Box>
            ))}

            {isAuthenticated && isInlineEditing && (
              <Box sx={{ display: "flex", justifyContent: "flex-start" }}>
                <Button
                  variant="outlined"
                  startIcon={<AddIcon />}
                  onClick={addRoomVariant}
                  sx={{ textTransform: "none" }}
                >
                  Přidat variantu pokoje
                </Button>
              </Box>
            )}

            <Divider sx={{ my: 1.5 }} />

            <EditableTranslationText ns="cenik" i18nKey="rooms.notes.0" variant="body2" sx={{ color: "text.secondary" }} multilineRows={3} />
            <EditableTranslationText ns="cenik" i18nKey="rooms.notes.1" variant="body2" sx={{ color: "text.secondary" }} multilineRows={3} />
          </Box>
        </ImageTextBand>

        <ImageTextBand
          image={asset("/galerie/pokoje/058_HZ6_3886_Penzion_U_Lidmanu.webp")}
          titleNode={
            <EditableTranslationText
              ns="cenik"
              i18nKey="children.title"
              variant="h5"
              multilineRows={2}
            />
          }
          imageLeft={false}
        >
          <EditableTranslationText ns="cenik" i18nKey="children.text" sx={{ mb: 1.5 }} multilineRows={3} />
          <EditableTranslationText ns="cenik" i18nKey="children.labelAge" variant="subtitle1" sx={{ fontWeight: 700 }} />
          <EditableTranslationText ns="cenik" i18nKey="children.price" variant="body1" />
        </ImageTextBand>

        <ImageTextBand
          image={asset("/galerie/pokoje/081_HZ6_3941_Penzion_U_Lidmanu.webp")}
          titleNode={
            <EditableTranslationText
              ns="cenik"
              i18nKey="surcharges.title"
              variant="h5"
              multilineRows={2}
            />
          }
          imageLeft
        >
          <Table
            size="small"
            sx={{
              maxWidth: 760,
              "& th, & td": { border: 0, py: 0.75, px: 0 },
            }}
          >
            <TableBody>
              {resolvedSurchargeItems.map((_, index) => (
                <TableRow key={`surcharge-${index}`}>
                  <TableCell component="th" sx={{ fontWeight: 500, pr: 2 }}>
                    <EditableTranslationText
                      ns="cenik"
                      i18nKey={`surcharges.rows.${index}.label`}
                      multilineRows={2}
                    />
                  </TableCell>
                  <TableCell sx={{ fontWeight: 700, whiteSpace: "nowrap" }}>
                    <EditableTranslationText
                      ns="cenik"
                      i18nKey={`surcharges.rows.${index}.price`}
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {isAuthenticated && isInlineEditing && (
            <Box sx={{ display: "flex", justifyContent: "flex-start", mt: 1.5 }}>
              <Button
                variant="outlined"
                startIcon={<AddIcon />}
                onClick={addSurchargeVariant}
                sx={{ textTransform: "none" }}
              >
                Přidat variantu příplatku
              </Button>
            </Box>
          )}
        </ImageTextBand>

        <ImageTextBand
          image={asset("/galerie/interier/106_HZ6_3993_Penzion_U_Lidmanu.webp")}
          titleNode={
            <EditableTranslationText
              ns="cenik"
              i18nKey="moreInfo.title"
              variant="h5"
              multilineRows={2}
            />
          }
          imageLeft={false}
        >
          <Box sx={{ display: "grid", gap: 0.75 }}>
            <EditableTranslationText ns="cenik" i18nKey="moreInfo.items.0" />
            <EditableTranslationText ns="cenik" i18nKey="moreInfo.items.1" />
            <EditableTranslationText ns="cenik" i18nKey="moreInfo.items.2" />
          </Box>
        </ImageTextBand>
      </Container>
    </>
  );
}
