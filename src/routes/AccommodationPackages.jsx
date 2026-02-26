import React from "react";
import {
  Box,
  Container,
  Grid,
  Paper,
  Typography,
  Dialog,
  DialogContent,
  IconButton,
  Divider,
  Chip,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import PackageCard from "../components/PackageCard.jsx";
import { useTranslation } from "react-i18next";

const asset = (path) =>
  `${import.meta.env.BASE_URL}${path.replace(/^\/+/, "")}`;

export default function AccommodationPackages() {
  const { t } = useTranslation("balicky");
  const [open, setOpen] = React.useState(false);
  const [active, setActive] = React.useState(null);
  const BALICKY = [
    { id: "b1", image: asset("/pobytoveBalicky/b4387.webp") },
    { id: "b2", image: asset("/pobytoveBalicky/b4460.webp") },
    { id: "b3", image: asset("/pobytoveBalicky/b4345.webp") },
  ].map((pkg) => ({
    ...pkg,
    title: t(`cards.${pkg.id}.title`),
    price: t(`packages.${pkg.id}.price`, { returnObjects: true }),
    priceNote: t("dialog.priceNoteSuffix"),
    description: t(`packages.${pkg.id}.description`, { returnObjects: true }),
    obsah: t(`packages.${pkg.id}.obsah`, { returnObjects: true }),
    aktivity: t(`packages.${pkg.id}.aktivity`),
  }));

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
          minHeight: "90vh",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          py: { xs: 4, md: 6 },
        }}
      >
        <Box
          sx={{
            width: "100%",
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: 3,
            justifyItems: "center", // vycentruje karty v buňkách
          }}
        >
          {BALICKY.map((b) => (
            <PackageCard
              key={b.id}
              title={b.title}
              image={b.image}
              onClick={() => handleOpen(b)}
            />
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
              {/* Název */}
              <Typography
                variant="h5"
                sx={{ textAlign: "center", fontWeight: 700, mb: 2 }}
              >
                {active.title}
              </Typography>

              {/* Cena */}
              <Paper
                variant="outlined"
                sx={{ p: 2, mb: 2, textAlign: "center" }}
              >
                {Array.isArray(active.price) ? (
                  <Box
                    sx={{ display: "flex", flexDirection: "column", gap: 0.5 }}
                  >
                    {active.price.map((line, i) => (
                      <Typography
                        key={i}
                        sx={{ fontWeight: i === 0 ? 700 : 500 }}
                      >
                        {line}
                      </Typography>
                    ))}
                  </Box>
                ) : (
                  <Typography sx={{ fontWeight: 700 }}>
                    {active.price}
                  </Typography>
                )}
                {active.priceNote && (
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mt: 0.5 }}
                  >
                    {active.priceNote}
                  </Typography>
                )}
              </Paper>

              {/* Popis (termíny atd.) */}
              {active.description?.length > 0 && (
                <Box sx={{ textAlign: "center", mb: 2 }}>
                  {active.description.map((p, i) => (
                    <Typography
                      key={i}
                      sx={{ mb: i === active.description.length - 1 ? 0 : 0.5 }}
                    >
                      {p}
                    </Typography>
                  ))}
                </Box>
              )}

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
                  {active.obsah.map((line, i) => (
                    <Typography key={i}>{line}</Typography>
                  ))}
                </Box>
              </Box>

              {/* Doporučené aktivity */}
              {active.aktivity && (
                <>
                  <Divider sx={{ my: 2 }} />
                  <Box sx={{ textAlign: "center" }}>
                    <Chip
                      label={t("dialog.sections.aktivity")}
                      color="primary"
                      variant="outlined"
                      sx={{ mb: 1 }}
                    />
                    <Typography>{active.aktivity}</Typography>
                  </Box>
                </>
              )}
            </DialogContent>
          </>
        )}
      </Dialog>
    </>
  );
}
