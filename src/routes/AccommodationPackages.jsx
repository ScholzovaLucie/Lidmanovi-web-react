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

const asset = (path) =>
  `${import.meta.env.BASE_URL}${path.replace(/^\/+/, "")}`;

// --- data (můžeš klidně vytáhnout do samostatného JSON) ---
const BALICKY = [
  {
    id: "b1",
    title: "Prodloužený víkend ve Stolových horách",
    image: asset("/pobytoveBalicky/b4387.webp"),
    price: "Cena: 4.190 Kč / 2 osoby / pobyt",
    priceNote:
      "(cena nezahrnuje rekreační a ubytovací poplatek 20 Kč / osoba / noc)",
    description: [
      "(pro 2 osoby, čtvrtek–neděle) v termínu od března do června, od září do listopadu",
      "Vyražte na turistický prodloužený víkend do Stolových hor.",
    ],
    obsah: [
      "3× ubytování",
      "3× bufetová snídaně",
      "1× zapůjčení piknikového batohu s vydatným občerstvením na celý den",
      "1× tříchodová večeře s lahví moravského vína",
    ],
    aktivity:
      "Národní park Stolové hory (Hejšovina, Bílé skály, Bludné skály), Broumovské stěny (Signál, Machovský kříž, Hvězda), stolová hora Ostaš, Adršpašské a Teplické skály, Muzeum Merkur, Muzeum papírových modelů – Police n. Metují, lázně Kudowa Zdrój (PL), poutní místo Vambeřice (PL), zámky Náchod a Nové Město n. M., pevnost Dobrošov, klášter Broumov, Broumovská skupina kostelů, Kłodzko (PL), Wrocław (PL), cykloturistika.",
  },
  {
    id: "b2",
    title: "Pětidenní turisticko-poznávací pobyt na Machovsku",
    image: asset("/pobytoveBalicky/b4460.webp"),
    price: "Cena: 5.390 Kč / 2 osoby / pobyt",
    priceNote:
      "(cena nezahrnuje rekreační a ubytovací poplatek 20 Kč / osoba / noc)",
    description: [
      "(pro 2 osoby, neděle–pátek) v termínu květen, červen, září.",
    ],
    obsah: [
      "5× ubytování",
      "5× bufetová snídaně",
      "3× balíček s občerstvením na cesty",
    ],
    aktivity:
      "Národní park Stolové hory (Hejšovina, Bílé skály, Bludné skály), Broumovské stěny (Signál, Machovský kříž, Hvězda), stolová hora Ostaš, Adršpašské a Teplické skály, Muzeum Merkur, Muzeum papírových modelů – Police n. Metují, lázně Kudowa Zdrój (PL), poutní místo Vambeřice (PL), zámky Náchod a Nové Město n. M., pevnost Dobrošov, klášter Broumov, Broumovská skupina kostelů, Kłodzko (PL), Wrocław (PL), cykloturistika.",
  },
  {
    id: "b3",
    title: "Týdenní dovolená na Broumovsku",
    image: asset("/pobytoveBalicky/b4345.webp"),
    price: [
      "7.390 Kč / 2 osoby / pokoj",
      "10.490 Kč / 3 osoby / pokoj",
      "11.990 Kč / 4 osoby / pokoj",
    ],
    priceNote:
      "(cena nezahrnuje rekreační a ubytovací poplatek 20 Kč / osoba / noc)",
    description: [
      "(pro 2–4 osoby, sobota–sobota) v termínu od července do srpna",
      "(pro 2–4 osoby, neděle–neděle) v termínu od dubna do června a od září do října",
    ],
    obsah: [
      "7× ubytování",
      "7× bufetová snídaně",
      "1× balíček s občerstvením na cesty",
    ],
    aktivity:
      "Národní park Stolové hory (Hejšovina, Bílé skály, Bludné skály), Broumovské stěny (Signál, Machovský kříž, Hvězda), stolová hora Ostaš, Adršpašské a Teplické skály, Muzeum Merkur, Muzeum papírových modelů – Police n. Metují, lázně Kudowa Zdrój (PL), poutní místo Vambeřice (PL), zámky Náchod a Nové Město n. M., pevnost Dobrošov, klášter Broumov, Broumovská skupina kostelů, Kłodzko (PL), Wrocław (PL), cykloturistika.",
  },
];

export default function AccommodationPackages() {
  const [open, setOpen] = React.useState(false);
  const [active, setActive] = React.useState(null);

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
                  bgcolor: "rgba(0,0,0,.4)",
                  color: "#fff",
                  "&:hover": { bgcolor: "rgba(0,0,0,.6)" },
                }}
                aria-label="Zavřít"
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
                  label="Balíček obsahuje"
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
                      label="Doporučené aktivity"
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
