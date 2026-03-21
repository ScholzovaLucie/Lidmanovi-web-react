import React from "react";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";

const toAsset = (path) =>
  path ? `${import.meta.env.BASE_URL}${String(path).replace(/^\/+/, "")}` : null;

export default function SubpageBanner({
  eyebrow,
  title,
  subtitle,
  image,
  slides = [],
  galleryImages = [],
  minHeight = { xs: 300, md: 380 },
}) {
  const backgroundSlides = (slides.length ? slides : [image])
    .filter(Boolean)
    .map((src) => toAsset(src))
    .filter(Boolean);
  const hasGalleryStrip = galleryImages.length > 0;
  const [activeSlide, setActiveSlide] = React.useState(0);

  React.useEffect(() => {
    if (backgroundSlides.length <= 1) return;
    const id = setInterval(() => {
      setActiveSlide((current) => (current + 1) % backgroundSlides.length);
    }, 3500);
    return () => clearInterval(id);
  }, [backgroundSlides.length]);

  return (
    <Box
      component="section"
      sx={{
        position: "relative",
        minHeight: hasGalleryStrip
          ? { xs: 320, md: 460 }
          : minHeight,
        pt: { xs: "84px", md: "90px" },
        display: "flex",
        alignItems: "flex-end",
        overflow: "hidden",
        backgroundColor: "#30363e",
      }}
    >
      {backgroundSlides.length > 0 &&
        backgroundSlides.map((src, index) => (
          <Box
            key={`${src}-${index}`}
            sx={{
              position: "absolute",
              inset: 0,
              backgroundImage: `url(${src})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              opacity: index === activeSlide ? 0.3 : 0,
              transition: "opacity 900ms ease",
              mixBlendMode: "screen",
              transform: "scale(1.02)",
            }}
          />
        ))}

      <Box
        sx={{
          position: "absolute",
          inset: 0,
          background:
            hasGalleryStrip
              ? "linear-gradient(180deg, rgba(22,26,32,0.72) 0%, rgba(22,26,32,0.46) 34%, rgba(22,26,32,0.88) 100%)"
              : "linear-gradient(180deg, rgba(30,35,42,0.52) 0%, rgba(30,35,42,0.22) 35%, rgba(30,35,42,0.72) 100%)",
        }}
      />

      <Container
        maxWidth="lg"
        sx={{
          position: "relative",
          zIndex: 3,
          width: "100%",
          pb: hasGalleryStrip ? { xs: 12, md: 15 } : { xs: 4.5, md: 6.5 },
        }}
      >
        {eyebrow && (
          <Typography
            sx={{
              mb: 1.5,
              color: "rgba(196,170,136,0.92)",
              fontSize: "0.66rem",
              letterSpacing: "0.28em",
              textTransform: "uppercase",
              display: "flex",
              alignItems: "center",
              gap: 1.2,
              "&::before": {
                content: '""',
                width: 28,
                height: 1,
                backgroundColor: "rgba(196,170,136,0.85)",
              },
            }}
          >
            {eyebrow}
          </Typography>
        )}

        <Typography
          variant="h1"
          sx={{
            maxWidth: "12ch",
            color: "#fdfefe",
            textShadow: "0 8px 32px rgba(0,0,0,0.18)",
          }}
        >
          {title}
        </Typography>

        {subtitle && (
          <Typography
            variant="body1"
            sx={{
              mt: 1.5,
              maxWidth: "48ch",
              color: "rgba(238,243,247,0.72)",
            }}
          >
            {subtitle}
          </Typography>
        )}
      </Container>

      {hasGalleryStrip && (
        <Box
          sx={{
            position: "absolute",
            inset: 0,
            zIndex: 1,
            display: "grid",
            gridTemplateColumns: { xs: "repeat(2, minmax(0, 1fr))", md: "repeat(4, minmax(0, 1fr))" },
            gap: "1px",
            backgroundColor: "rgba(255,255,255,0.06)",
          }}
        >
          {galleryImages.map((src, index) => (
            <Box
              key={`${src}-${index}`}
              sx={{
                position: "relative",
                minHeight: "100%",
                overflow: "hidden",
              }}
            >
              <Box
                component="img"
                src={src}
                alt=""
                sx={{
                  display: "block",
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                }}
              />
              <Box
                sx={{
                  position: "absolute",
                  inset: 0,
                  background:
                    "linear-gradient(180deg, rgba(22,26,32,0.32), rgba(22,26,32,0.58))",
                }}
              />
            </Box>
          ))}
        </Box>
      )}
    </Box>
  );
}
