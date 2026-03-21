import React from "react";
import {
  Box,
  Button,
  Container,
  Paper,
  Dialog,
  DialogContent,
  IconButton,
  Divider,
  Chip,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import PackageCard from "../components/PackageCard.jsx";
import { useTranslation } from "react-i18next";
import EditableTranslationText from "../components/EditableTranslationText";
import { useEditorialEditor } from "../context/editorialEditorContext";

const asset = (path) =>
  `${import.meta.env.BASE_URL}${path.replace(/^\/+/, "")}`;

export default function AccommodationPackages() {
  const { t } = useTranslation("balicky");
  const {
    isAuthenticated,
    isInlineEditing,
    getInlineValue,
    listContentKeys,
    setInlineValue,
  } = useEditorialEditor();
  const [open, setOpen] = React.useState(false);
  const [active, setActive] = React.useState(null);
  const packageImages = [
    asset("/pobytoveBalicky/b4387.webp"),
    asset("/pobytoveBalicky/b4460.webp"),
    asset("/pobytoveBalicky/b4345.webp"),
    asset("/pobytoveBalicky/br1560.webp"),
  ];

  const rawOrder = getInlineValue(
    "balicky.packagesOrder",
    t("packagesOrder", { returnObjects: true }),
  );
  const packageIds = Array.isArray(rawOrder)
    ? rawOrder
        .map((id) => String(id).trim())
        .filter((id) => /^b\d+$/.test(id))
    : [];

  const resolvedPackageIds = packageIds.length
    ? packageIds
    : (() => {
        const keys = listContentKeys("balicky.cards.")
          .map((key) => key.match(/^balicky\.cards\.(b\d+)\./)?.[1])
          .filter(Boolean);
        const filtered = keys.filter((id) => /^b\d+$/.test(id));
        if (!filtered.length) return ["b1", "b2", "b3"];
        return Array.from(new Set(filtered)).sort((a, b) => Number(a.slice(1)) - Number(b.slice(1)));
      })();

  const BALICKY = resolvedPackageIds.map((id, index) => ({
    id,
    image: packageImages[index % packageImages.length],
  }));

  const handleAddPackage = () => {
    const nextNumber = resolvedPackageIds.reduce((max, id) => {
      const num = Number(id.slice(1));
      return Number.isNaN(num) ? max : Math.max(max, num);
    }, 0) + 1;
    const nextId = `b${nextNumber}`;

    setInlineValue(`balicky.cards.${nextId}.title`, "Nový pobytový balíček");
    setInlineValue(`balicky.cards.${nextId}.imageAlt`, "Nový pobytový balíček");
    setInlineValue(`balicky.packages.${nextId}.price`, "Cena: doplnit");
    setInlineValue(`balicky.packages.${nextId}.description`, ["Doplňte popis balíčku."]);
    setInlineValue(`balicky.packages.${nextId}.obsah`, ["Doplňte obsah balíčku."]);
    setInlineValue(`balicky.packages.${nextId}.aktivity`, "Doplňte doporučené aktivity.");
    setInlineValue("balicky.packagesOrder", [...resolvedPackageIds, nextId]);

    setActive({
      id: nextId,
      image: packageImages[(nextNumber - 1) % packageImages.length],
    });
    setOpen(true);
  };

  const handleDeletePackage = (id) => {
    const nextOrder = resolvedPackageIds.filter((pkgId) => pkgId !== id);
    setInlineValue("balicky.packagesOrder", nextOrder);
    setActive(null);
    setOpen(false);
  };

  const handleOpen = (pkg) => {
    setActive(pkg);
    setOpen(true);
  };
  const handleClose = () => setOpen(false);

  return (
    <>
      {/* Přehled balíčků */}
      <Container
        maxWidth="lg"
        sx={{
          position: "relative",
          minHeight: "90vh",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          py: { xs: 4, md: 6 },
        }}
      >
        {isAuthenticated && isInlineEditing && (
          <Box
            sx={{
              position: "absolute",
              top: { xs: 12, md: 16 },
              right: { xs: 12, md: 16 },
              zIndex: 2,
            }}
          >
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={handleAddPackage}
              sx={{ textTransform: "none" }}
            >
              Přidat balíček
            </Button>
          </Box>
        )}

        <Box
          sx={{
            width: "100%",
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "center",
            alignItems: "stretch",
            gap: 3,
          }}
        >
          {BALICKY.map((b) => (
            <Box
              key={b.id}
              sx={{
                width: "100%",
                maxWidth: 320,
                flex: "0 1 320px",
              }}
            >
              <PackageCard
                titleNode={
                  <EditableTranslationText
                    ns="balicky"
                    i18nKey={`cards.${b.id}.title`}
                    variant="subtitle1"
                    align="center"
                    multilineRows={2}
                  />
                }
                image={b.image}
                onClick={() => handleOpen(b)}
              />
            </Box>
          ))}
        </Box>
      </Container>

      {/* DETAIL balíčku (Dialog) */}
      <Dialog
        open={open}
        onClose={handleClose}
        fullWidth
        maxWidth="md"
        PaperProps={{
          sx: { borderRadius: 2, overflow: "hidden" },
        }}
      >
        {active && (
          <>
            {/* Obrázek nahoře */}
            <Box
              sx={{
                position: "relative",
                height: { xs: 520, md: 620 },
                backgroundImage: `url(${active.image})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            >
              <IconButton
                onClick={handleClose}
                sx={{
                  position: "absolute",
                  top: 8,
                  right: 8,
                  bgcolor: (theme) => theme.palette.mode === 'light' ? "rgba(0,0,0,0.3)" : "rgba(255,255,255,0.1)",
                  color: "background.paper",
                  "&:hover": { bgcolor: (theme) => theme.palette.mode === 'light' ? "rgba(0,0,0,.6)" : "rgba(255,255,255,.2)" },
                }}
                aria-label={t("dialog.closeAria")}
              >
                <CloseIcon />
              </IconButton>
            </Box>

            <DialogContent sx={{ p: { xs: 2, md: 3 } }}>
              {isAuthenticated && (
                <Box
                  sx={{
                    mb: 2,
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    gap: 1,
                  }}
                >
                  <Box
                    sx={{
                      px: 1.25,
                      py: 0.5,
                      borderRadius: 1,
                      bgcolor: "secondary.main",
                      color: "secondary.contrastText",
                      fontSize: 11,
                      fontWeight: 700,
                    }}
                  >
                    Editovatelný blok
                  </Box>
                  {isInlineEditing && (
                    <Button
                      variant="outlined"
                      size="small"
                      color="error"
                      startIcon={<DeleteIcon />}
                      onClick={() => handleDeletePackage(active.id)}
                      sx={{ textTransform: "none" }}
                    >
                      Odstranit balíček
                    </Button>
                  )}
                </Box>
              )}
              {/* Název */}
              <EditableTranslationText
                ns="balicky"
                i18nKey={`cards.${active.id}.title`}
                variant="h5"
                align="center"
                multilineRows={3}
                sx={{ textAlign: "center", fontWeight: 700, mb: 2 }}
              />

              {/* Cena */}
              <Paper
                variant="outlined"
                sx={{ p: 2, mb: 2, textAlign: "center" }}
              >
                <EditableTranslationText
                  ns="balicky"
                  i18nKey={`packages.${active.id}.price`}
                  variant="body1"
                  align="center"
                  paragraphs
                  multilineRows={4}
                />
                <EditableTranslationText
                  ns="balicky"
                  i18nKey="dialog.priceNoteSuffix"
                  variant="body2"
                  align="center"
                  sx={{ mt: 0.5, color: "text.secondary" }}
                />
              </Paper>

              {/* Popis (termíny atd.) */}
              <Box sx={{ textAlign: "center", mb: 2 }}>
                <EditableTranslationText
                  ns="balicky"
                  i18nKey={`packages.${active.id}.description`}
                  variant="body1"
                  align="center"
                  paragraphs
                  multilineRows={5}
                />
              </Box>

              <Divider sx={{ my: 2 }} />

              {/* Obsah balíčku */}
              <Box sx={{ textAlign: "center", mb: 2 }}>
                <Chip
                  label={t("dialog.sections.obsah")}
                  color="primary"
                  variant="outlined"
                  sx={{ mb: 1 }}
                />
                <Box
                  sx={{ display: "flex", flexDirection: "column", gap: 0.5 }}
                >
                  <EditableTranslationText
                    ns="balicky"
                    i18nKey={`packages.${active.id}.obsah`}
                    variant="body1"
                    align="center"
                    paragraphs
                    multilineRows={6}
                  />
                </Box>
              </Box>

              {/* Doporučené aktivity */}
              <>
                <Divider sx={{ my: 2 }} />
                <Box sx={{ textAlign: "center" }}>
                  <Chip
                    label={t("dialog.sections.aktivity")}
                    color="primary"
                    variant="outlined"
                    sx={{ mb: 1 }}
                  />
                  <EditableTranslationText
                    ns="balicky"
                    i18nKey={`packages.${active.id}.aktivity`}
                    variant="body1"
                    align="center"
                    multilineRows={6}
                  />
                </Box>
              </>
            </DialogContent>
          </>
        )}
      </Dialog>
    </>
  );
}
