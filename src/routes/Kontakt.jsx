import React from "react";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Link from "@mui/material/Link";
import ContactForm from "../components/ContactForm";
import EditableTranslationText from "../components/EditableTranslationText.jsx";
import { useTranslation } from "react-i18next";
import { useGoogleRating } from "../hooks/useGoogleRating.js";
import { formatGoogleRating, GOOGLE_REVIEW_URL } from "../utils/googleRating.js";

export default function Kontakt() {
  const { t } = useTranslation(["kontakt", "global"]);
  const googleRating = useGoogleRating();
  const asset = (path) =>
    `${import.meta.env.BASE_URL}${path.replace(/^\/+/, "")}`;

  const locationItems = [
    {
      labelKey: "info.address.title",
      value: (
        <EditableTranslationText ns="kontakt" i18nKey="info.address.lines" />
      ),
    },
    {
      labelKey: "info.gpsTitle",
      value: (
        <EditableTranslationText ns="kontakt" i18nKey="info.address.coords" />
      ),
    },
    {
      labelKey: "info.ratingTitle",
      value: (
        <Link
          href={GOOGLE_REVIEW_URL}
          target="_blank"
          rel="noopener noreferrer"
          underline="hover"
          color="inherit"
        >
          {formatGoogleRating(googleRating)}
        </Link>
      ),
    },
  ];

  const contactItems = [
    {
      labelKey: "info.phone.title",
      value: (
        <Link href="tel:+420604341863" underline="hover" color="inherit">
          <EditableTranslationText ns="kontakt" i18nKey="info.phone.value" />
        </Link>
      ),
    },
    {
      labelKey: "info.email.title",
      value: (
        <Link href="mailto:info@ulidmanu.cz" underline="hover" color="inherit">
          <EditableTranslationText ns="kontakt" i18nKey="info.email.value" />
        </Link>
      ),
    },
    {
      labelKey: "info.owner.title",
      value: <EditableTranslationText ns="kontakt" i18nKey="info.owner.lines" />,
    },
  ];

  return (
    <Box>
      <Box sx={{ bgcolor: "background.default", borderTop: "1px solid #dfd4c4" }}>
        <Container maxWidth="xl" sx={{ py: { xs: 4, md: 6 } }}>
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
              minHeight: { md: 760 },
              border: "1px solid #dfd4c4",
              bgcolor: "background.paper",
              boxShadow: "0 18px 44px rgba(45,38,30,0.05)",
            }}
          >
            <Box
              sx={{
                px: { xs: 3, sm: 5, md: 7 },
                py: { xs: 4.5, md: 7 },
              }}
            >
              <EditableTranslationText
                ns="kontakt"
                i18nKey="pageTitle"
                variant="h1"
                sx={{ mb: 1 }}
              />
              <EditableTranslationText
                ns="kontakt"
                i18nKey="subtitle"
                variant="body1"
                sx={{
                  color: "text.secondary",
                  fontWeight: 600,
                  mb: { xs: 4, md: 5 },
                }}
              />

              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
                  columnGap: { xs: 3, md: 6 },
                  rowGap: { xs: 3, md: 4.2 },
                }}
              >
                {[locationItems, contactItems].map((column, columnIndex) => (
                  <Box
                    key={columnIndex}
                    sx={{
                      display: "grid",
                      alignContent: "start",
                      gap: { xs: 3, md: 4.2 },
                    }}
                  >
                    {column.map((item, index) => (
                      <Box key={index}>
                        <Box
                          sx={{
                            mb: 0.9,
                            "& .MuiTypography-root": {
                              color: "text.secondary",
                              fontSize: "0.72rem",
                              fontWeight: 800,
                              letterSpacing: "0.22em",
                              textTransform: "uppercase",
                            },
                          }}
                        >
                          <EditableTranslationText
                            ns="kontakt"
                            i18nKey={item.labelKey}
                            multilineRows={1}
                          />
                        </Box>
                        <Typography
                          component="div"
                          sx={{
                            color: "text.primary",
                            fontSize: { xs: "1rem", md: "1.08rem" },
                            fontWeight: 500,
                            lineHeight: 1.55,
                            "& a": { fontWeight: 500 },
                          }}
                        >
                          {item.value}
                        </Typography>
                      </Box>
                    ))}
                  </Box>
                ))}
              </Box>

              <Box
                component="iframe"
                title={t("map.title")}
                src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d2537.9674639711725!2d16.2889786!3d50.4975633!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x470e686d9f1caccd%3A0x5443aff885131f52!2sPension%20-%20Restaurace%20U%20Lidman%C5%AF!5e0!3m2!1scs!2scz!4v1662476744005!5m2!1scs!2scz"
                sx={{
                  display: "block",
                  width: "100%",
                  height: { xs: 260, md: 300 },
                  border: "1px solid #e6ddcf",
                  mt: { xs: 4, md: 5 },
                  filter: "saturate(0.82) contrast(0.95)",
                }}
                allowFullScreen=""
                loading="eager"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </Box>

            <Box
              sx={{
                bgcolor: "primary.main",
                color: "primary.contrastText",
                px: { xs: 3, sm: 5, md: 7 },
                py: { xs: 4.5, md: 7 },
                display: "flex",
                alignItems: "center",
              }}
            >
              <Box sx={{ width: "100%" }}>
                <EditableTranslationText
                  ns="kontakt"
                  i18nKey="form.eyebrow"
                  sx={{
                    fontFamily: '"Cormorant Garamond", Georgia, serif',
                    fontStyle: "italic",
                    fontSize: { xs: "1.35rem", md: "1.6rem" },
                    fontWeight: 700,
                    color: "rgba(255,255,255,0.86)",
                    mb: 1,
                  }}
                />
                <EditableTranslationText
                  ns="kontakt"
                  i18nKey="form.heading"
                  variant="h1"
                  sx={{
                    color: "primary.contrastText",
                    fontSize: { xs: "2.7rem", md: "4rem" },
                    mb: { xs: 3, md: 4 },
                  }}
                />

                <ContactForm
                  title=""
                  translationNamespace="kontakt"
                  mailto="info@ulidmanu.cz"
                  maxWidth={false}
                  contentMaxWidth={false}
                  sx={{
                    boxShadow: "none",
                    border: 0,
                    p: 0,
                    bgcolor: "transparent",
                    color: "primary.contrastText",
                    "& .MuiStack-root": { gap: 2.4 },
                    "& .MuiInputBase-root": {
                      color: "primary.contrastText",
                      bgcolor: "transparent",
                      borderRadius: 0,
                    },
                    "& .MuiInputBase-input, & textarea": {
                      px: 0,
                      color: "primary.contrastText",
                      fontSize: "1.02rem",
                    },
                    "& .MuiInputBase-input::placeholder, & textarea::placeholder": {
                      color: "rgba(255,255,255,0.58)",
                      opacity: 1,
                    },
                    "& .MuiInputLabel-root": {
                      color: "rgba(255,255,255,0.78)",
                      fontSize: "0.72rem",
                      fontWeight: 800,
                      letterSpacing: "0.2em",
                      textTransform: "uppercase",
                    },
                    "& .MuiInputLabel-root.Mui-focused": {
                      color: "primary.contrastText",
                    },
                    "& .MuiOutlinedInput-notchedOutline": {
                      borderWidth: "0 0 2px 0",
                      borderRadius: 0,
                      borderColor: "rgba(255,255,255,0.34)",
                    },
                    "& .MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline": {
                      borderColor: "rgba(255,255,255,0.56)",
                    },
                    "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline": {
                      borderColor: "rgba(255,255,255,0.86)",
                      borderWidth: "0 0 2px 0",
                    },
                    "& .MuiFormControlLabel-label, & .MuiTypography-root, & a": {
                      color: "rgba(255,255,255,0.82)",
                    },
                    "& .MuiCheckbox-root": {
                      color: "rgba(255,255,255,0.82)",
                    },
                    "& .MuiCheckbox-root.Mui-checked": {
                      color: "background.paper",
                    },
                    "& .MuiSvgIcon-root": {
                      filter: "drop-shadow(0 1px 2px rgba(0,0,0,0.25))",
                    },
                    "& .MuiButton-contained": {
                      mt: 1,
                      bgcolor: "background.paper",
                      color: "text.primary",
                      borderRadius: 0,
                      px: 4,
                      py: 1.5,
                      boxShadow: "none",
                      "&:hover": {
                        bgcolor: "#f3ece1",
                        boxShadow: "none",
                      },
                    },
                  }}
                />
              </Box>
            </Box>
          </Box>
        </Container>
      </Box>

      <Box
        component="section"
        sx={{
          borderTop: "1px solid rgba(85,116,143,0.08)",
          py: 3,
        }}
      >
        <Box
          sx={{
            py: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 2,
          }}
        >
          <Box
            component="img"
            src={asset("/logo_colour_pantone.webp")}
            alt={t("credit.alt")}
            sx={{ height: 38 }}
          />
          <Typography
            id="kraj_text"
            sx={{ color: "text.secondary", textAlign: "center" }}
          >
            {t("credit.text")}
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}
