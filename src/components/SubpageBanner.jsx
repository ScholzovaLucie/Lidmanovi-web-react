import React from "react";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";

const toAsset = (path) => {
  if (!path) return null;
  if (/^https?:\/\//.test(path)) return path;
  return `${import.meta.env.BASE_URL}${String(path).replace(/^\/+/, "")}`;
};

export default function SubpageBanner({
  eyebrow,
  eyebrowNode,
  title,
  titleNode,
  subtitle,
  subtitleNode,
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
          ? { xs: 300, md: 430 }
          : { xs: 340, md: 520 },
        pt: 0,
        display: "flex",
        alignItems: "flex-end",
        justifyContent: "center",
        overflow: "hidden",
        backgroundColor: "#2d2823",
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
              opacity: index === activeSlide ? 0.72 : 0,
              transition: "opacity 900ms ease",
              mixBlendMode: "normal",
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
              ? "linear-gradient(180deg, rgba(45,40,35,0.56) 0%, rgba(45,40,35,0.32) 40%, rgba(45,40,35,0.68) 100%)"
              : "linear-gradient(180deg, rgba(45,40,35,0.32) 0%, rgba(45,40,35,0.18) 35%, rgba(45,40,35,0.62) 100%)",
        }}
      />

      <Container
        maxWidth="lg"
        sx={{
          position: "relative",
          zIndex: 3,
          width: "100%",
          pb: hasGalleryStrip ? { xs: 8, md: 10 } : { xs: 5, md: 7 },
          textAlign: "center",
        }}
      >
        {eyebrowNode ? (
          eyebrowNode
        ) : (
          eyebrow && (
            <Typography
              sx={{
                mb: 1.2,
                color: "rgba(255,250,240,0.86)",
                fontSize: "0.72rem",
                fontWeight: 600,
                letterSpacing: "0.35em",
                textTransform: "uppercase",
              }}
            >
              {eyebrow}
            </Typography>
          )
        )}

        {titleNode || (
          <Typography
            variant="h1"
            sx={{
              maxWidth: "16ch",
              mx: "auto",
              color: "#fdfefe",
              textShadow: "0 10px 34px rgba(0,0,0,0.24)",
            }}
          >
            {title}
          </Typography>
        )}

        {subtitleNode ? (
          subtitleNode
        ) : (
          subtitle && (
            <Typography
              variant="body1"
              sx={{
                mt: 1.5,
                maxWidth: "48ch",
                mx: "auto",
                color: "rgba(238,243,247,0.72)",
              }}
            >
              {subtitle}
            </Typography>
          )
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
