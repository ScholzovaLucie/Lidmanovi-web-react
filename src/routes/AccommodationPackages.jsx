import React from "react";
import {
  Box,
  Button,
  Container,
  Dialog,
  DialogContent,
  Divider,
  IconButton,
  Paper,
  Chip,
  Typography,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import { useTranslation } from "react-i18next";
import EditableTranslationText from "../components/EditableTranslationText";
import PackageCard from "../components/PackageCard.jsx";
import PhotoLocationEditor from "../components/PhotoLocationEditor.jsx";
import { usePhotoSequence } from "../hooks/usePhotoSequence.js";
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
  const { urls: packageImages } = usePhotoSequence("balicky-obrazky", [
    asset("/pobytoveBalicky/b4387.webp"),
    asset("/pobytoveBalicky/b4460.webp"),
    asset("/pobytoveBalicky/b4345.webp"),
    asset("/pobytoveBalicky/br1560.webp"),
  ]);

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
        return Array.from(new Set(filtered)).sort(
          (a, b) => Number(a.slice(1)) - Number(b.slice(1)),
        );
      })();

  const packages = resolvedPackageIds.map((id, index) => ({
    id,
    image: packageImages[index % packageImages.length],
  }));

  const featuredPackage = packages[0] || null;
  const remainingPackages = featuredPackage ? packages.slice(1) : [];

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
      <Container maxWidth="lg" sx={{ py: { xs: 6, md: 9 } }}>
        <Box sx={{ textAlign: "center", mb: { xs: 4, md: 5 } }}>
          <EditableTranslationText
            ns="balicky"
            i18nKey="pageTitle"
            variant="h1"
          />
        </Box>
        {isAuthenticated && isInlineEditing && (
          <Box sx={{ mb: 3 }}>
            <PhotoLocationEditor
              location="balicky-obrazky"
              label="Fotky balíčků"
              compact
            />
          </Box>
        )}
        {isAuthenticated && isInlineEditing && (
          <Box
            sx={{
              display: "flex",
              justifyContent: "flex-end",
              mb: 3,
            }}
          >
            <Button
              data-inline-edit-allow-action="true"
              variant="contained"
              startIcon={<AddIcon />}
              onClick={handleAddPackage}
              sx={{ textTransform: "none", px: 2.2 }}
            >
              Přidat balíček
            </Button>
          </Box>
        )}

        {false && featuredPackage && (
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
              border: "1px solid rgba(85,116,143,0.12)",
              background: "rgba(255,255,255,0.98)",
              overflow: "hidden",
              mb: { xs: 4, md: 5 },
            }}
          >
            <Box
              sx={{
                minHeight: { xs: 300, md: 460 },
                backgroundImage: `url(${featuredPackage.image})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            />
            <Box
              sx={{
                p: { xs: 3, md: 4.5 },
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
              }}
            >
              <Box sx={{ mb: 1.5 }}>
                <EditableTranslationText
                  ns="balicky"
                  i18nKey={`cards.${featuredPackage.id}.title`}
                  variant="h2"
                  multilineRows={3}
                />
              </Box>
              <EditableTranslationText
                ns="balicky"
                i18nKey={`packages.${featuredPackage.id}.description`}
                variant="body1"
                paragraphs
                multilineRows={5}
                sx={{ color: "text.secondary", mb: 2.5 }}
              />
              <Box
                sx={{
                  py: 2,
                  borderTop: "1px solid rgba(85,116,143,0.12)",
                  borderBottom: "1px solid rgba(85,116,143,0.12)",
                  mb: 2.5,
                }}
              >
                <EditableTranslationText
                  ns="balicky"
                  i18nKey={`packages.${featuredPackage.id}.price`}
                  variant="body1"
                  paragraphs
                  multilineRows={4}
                />
              </Box>
              <Button
                variant="outlined"
                onClick={() => handleOpen(featuredPackage)}
                sx={{ alignSelf: "flex-start" }}
              >
                Detail balíčku
              </Button>
            </Box>
          </Box>
        )}

        <Box
          sx={{
            width: "100%",
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              sm: "repeat(2, minmax(0, 1fr))",
              lg: "repeat(3, minmax(0, 1fr))",
            },
            gap: 3,
          }}
        >
          {packages.map(
            (pkg, index) => (
              <Box
                key={pkg.id}
                sx={{
                  width: "100%",
                  display: "flex",
                  justifyContent: "center",
                }}
              >
                <PackageCard
                  index={index}
                  titleNode={
                    <EditableTranslationText
                      ns="balicky"
                      i18nKey={`cards.${pkg.id}.title`}
                      variant="subtitle1"
                      multilineRows={3}
                      sx={{
                        textAlign: "left",
                        fontFamily: '"Cormorant Garamond", Georgia, serif',
                        fontSize: { xs: "1.5rem", md: "1.7rem" },
                        fontWeight: 400,
                        lineHeight: 1.12,
                        letterSpacing: 0,
                        textTransform: "none",
                      }}
                    />
                  }
                  image={pkg.image}
                  onClick={() => handleOpen(pkg)}
                />
              </Box>
            ),
          )}
        </Box>
      </Container>

      <Dialog
        open={open}
        onClose={handleClose}
        fullWidth
        maxWidth="md"
        PaperProps={{
          sx: {
            overflow: "hidden",
            border: "1px solid rgba(85,116,143,0.14)",
            boxShadow: "0 28px 70px rgba(20,24,30,0.18)",
          },
        }}
      >
        {active && (
          <>
            <Box
              sx={{
                position: "relative",
                height: { xs: 420, md: 560 },
                backgroundImage: `url(${active.image})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            >
              <IconButton
                onClick={handleClose}
                sx={{
                  position: "absolute",
                  top: 12,
                  right: 12,
                  bgcolor: "rgba(18,20,24,0.45)",
                  color: "background.paper",
                  "&:hover": { bgcolor: "rgba(18,20,24,0.68)" },
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
                      data-inline-edit-allow-action="true"
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

              <EditableTranslationText
                ns="balicky"
                i18nKey={`cards.${active.id}.title`}
                variant="h5"
                align="center"
                multilineRows={3}
                sx={{ textAlign: "center", fontWeight: 400, mb: 2 }}
              />

              <Paper
                variant="outlined"
                sx={{
                  p: 2.2,
                  mb: 2,
                  textAlign: "center",
                  borderColor: "rgba(85,116,143,0.12)",
                  background: "rgba(221,229,233,0.18)",
                }}
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

              <Box sx={{ textAlign: "center", mb: 2 }}>
                <Chip
                  label={t("dialog.sections.obsah")}
                  variant="outlined"
                  sx={{
                    mb: 1,
                    borderColor: "rgba(154,128,96,0.4)",
                    color: "#8b7151",
                  }}
                />
                <EditableTranslationText
                  ns="balicky"
                  i18nKey={`packages.${active.id}.obsah`}
                  variant="body1"
                  align="center"
                  paragraphs
                  multilineRows={6}
                />
              </Box>

              <Divider sx={{ my: 2 }} />

              <Box sx={{ textAlign: "center" }}>
                <Chip
                  label={t("dialog.sections.aktivity")}
                  variant="outlined"
                  sx={{
                    mb: 1,
                    borderColor: "rgba(154,128,96,0.4)",
                    color: "#8b7151",
                  }}
                />
                <EditableTranslationText
                  ns="balicky"
                  i18nKey={`packages.${active.id}.aktivity`}
                  variant="body1"
                  align="center"
                  multilineRows={6}
                />
              </Box>
            </DialogContent>
          </>
        )}
      </Dialog>
    </>
  );
}
