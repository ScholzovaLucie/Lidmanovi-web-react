import React from "react";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import Link from "@mui/material/Link";
import InfoBlock from "../components/InfoBlock";
import ContactForm from "../components/ContactForm";
import SubpageBanner from "../components/SubpageBanner.jsx";
import SectionIntro from "../components/SectionIntro.jsx";
import EditableTranslationText from "../components/EditableTranslationText.jsx";
import { useTranslation } from "react-i18next";

export default function Kontakt() {
  const { t } = useTranslation(["kontakt", "global"]);
  const asset = (path) =>
    `${import.meta.env.BASE_URL}${path.replace(/^\/+/, "")}`;

  const images = [
    asset("/kontakt/DSCN0464.webp"),
    asset("/kontakt/002_HZ6_3762_Penzion_U_Lidmanu.webp"),
    asset("/kontakt/9c8f78d411bc1f0228e6.webp"),
    asset("/kontakt/95f5c4089c2e069cf161.webp"),
  ];

  const blocks = [
    {
      icon: asset("/position.webp"),
      titleNode: (
        <EditableTranslationText
          ns="kontakt"
          i18nKey="info.address.title"
          sx={{
            fontFamily: '"Cormorant Garamond", Georgia, serif',
            fontSize: { xs: "1.45rem", md: "1.65rem" },
            lineHeight: 1.1,
            color: "text.primary",
          }}
        />
      ),
      content: (
        <>
          <EditableTranslationText ns="kontakt" i18nKey="info.address.lines" />
          <Divider sx={{ my: 1.5 }} />
          <EditableTranslationText ns="kontakt" i18nKey="info.address.coords" variant="body2" sx={{ color: "text.secondary" }} />
        </>
      ),
    },
    {
      icon: asset("/phone-call.webp"),
      titleNode: (
        <EditableTranslationText
          ns="kontakt"
          i18nKey="info.phone.title"
          sx={{
            fontFamily: '"Cormorant Garamond", Georgia, serif',
            fontSize: { xs: "1.45rem", md: "1.65rem" },
            lineHeight: 1.1,
            color: "text.primary",
          }}
        />
      ),
      content: (
        <Link href="tel:+420604341863" underline="hover" color="inherit">
          +420&nbsp;604&nbsp;341&nbsp;863
        </Link>
      ),
    },
    {
      icon: asset("/mail.webp"),
      titleNode: (
        <EditableTranslationText
          ns="kontakt"
          i18nKey="info.email.title"
          sx={{
            fontFamily: '"Cormorant Garamond", Georgia, serif',
            fontSize: { xs: "1.45rem", md: "1.65rem" },
            lineHeight: 1.1,
            color: "text.primary",
          }}
        />
      ),
      content: (
        <Link href="mailto:info@ulidmanu.cz" underline="hover" color="inherit">
          info@ulidmanu.cz
        </Link>
      ),
    },
    {
      icon: asset("/facebook2.webp"),
      titleNode: (
        <EditableTranslationText
          ns="kontakt"
          i18nKey="info.facebook.title"
          sx={{
            fontFamily: '"Cormorant Garamond", Georgia, serif',
            fontSize: { xs: "1.45rem", md: "1.65rem" },
            lineHeight: 1.1,
            color: "text.primary",
          }}
        />
      ),
      content: (
        <Link
          href="https://www.facebook.com/Pension-a-restaurace-U-Lidman%C5%AF-945259918825167"
          underline="hover"
          color="inherit"
        >
          <EditableTranslationText ns="kontakt" i18nKey="info.facebook.label" />
        </Link>
      ),
    },
    {
      titleNode: (
        <EditableTranslationText
          ns="kontakt"
          i18nKey="info.owner.title"
          sx={{
            fontFamily: '"Cormorant Garamond", Georgia, serif',
            fontSize: { xs: "1.45rem", md: "1.65rem" },
            lineHeight: 1.1,
            color: "text.primary",
          }}
        />
      ),
      content: (
        <EditableTranslationText ns="kontakt" i18nKey="info.owner.lines" />
      ),
    },
  ];

  return (
    <Box>
      <SubpageBanner
        eyebrow={t("global:footer.brand")}
        title={t("pageTitle")}
        image="/kontakt/002_HZ6_3762_Penzion_U_Lidmanu.webp"
        slides={[
          "/kontakt/002_HZ6_3762_Penzion_U_Lidmanu.webp",
          "/kontakt/DSCN0464.webp",
          "/kontakt/9c8f78d411bc1f0228e6.webp",
          "/kontakt/95f5c4089c2e069cf161.webp",
        ]}
        galleryImages={images}
      />

      <Container maxWidth="lg" sx={{ py: { xs: 5, md: 7 } }}>
        <Grid
          container
          columns={{ xs: 12, sm: 12, md: 12, lg: 15 }}
          justifyContent="center"
          alignItems="stretch"
          rowSpacing={2.5}
          columnSpacing={2.5}
        >
          {blocks.map((block, i) => (
            <Grid key={i} size={{ xs: 12, sm: 6, md: 4, lg: 3 }} sx={{ display: "flex" }}>
              <InfoBlock
                icon={block.icon}
                title={block.title}
                titleNode={block.titleNode}
                button={block.button}
                onButtonClick={block.onClick}
                sx={{ flex: 1, height: "100%" }}
              >
                {block.content}
              </InfoBlock>
            </Grid>
          ))}
        </Grid>
      </Container>

      <Container maxWidth="lg" sx={{ pb: { xs: 5, md: 7 } }}>
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", md: "minmax(0, 1fr) minmax(0, 1fr)" },
            gap: { xs: 3, md: 4 },
            alignItems: "stretch",
          }}
        >
          <Box>
            <Box
              sx={{
                width: "100%",
                border: "1px solid rgba(85,116,143,0.12)",
                background: "rgba(255,255,255,0.98)",
                minHeight: 560,
                overflow: "hidden",
              }}
            >
              <Box
                sx={{
                  p: { xs: 3, md: 4 },
                  borderBottom: "1px solid rgba(85,116,143,0.08)",
                }}
              >
                <SectionIntro title={t("form.title")} />
              </Box>
              <ContactForm
                title=""
                translationNamespace="kontakt"
                mailto="info@ulidmanu.cz"
                maxWidth={false}
                contentMaxWidth={false}
                sx={{
                  boxShadow: "none",
                  border: 0,
                  p: { xs: 3, md: 4 },
                }}
              />
            </Box>
          </Box>

          <Box>
            <Box
              component="section"
              sx={{
                width: "100%",
                height: "100%",
                border: "1px solid rgba(85,116,143,0.12)",
                background: "rgba(255,255,255,0.98)",
                overflow: "hidden",
              }}
            >
              <Box
                sx={{
                  p: { xs: 3, md: 4 },
                  background: "rgba(221,229,233,0.25)",
                  borderBottom: "1px solid rgba(85,116,143,0.08)",
                }}
              >
                <SectionIntro title={t("map.title")} />
              </Box>
              <Box
                sx={{
                  width: "100%",
                  p: { xs: 3, md: 4 },
                }}
              >
                <Box
                  component="iframe"
                  title={t("map.title")}
                  src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d2537.9674639711725!2d16.2889786!3d50.4975633!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x470e686d9f1caccd%3A0x5443aff885131f52!2sPension%20-%20Restaurace%20U%20Lidman%C5%AF!5e0!3m2!1scs!2scz!4v1662476744005!5m2!1scs!2scz"
                  sx={{
                    display: "block",
                    width: "100%",
                    height: { xs: 420, md: 520 },
                    border: 0,
                  }}
                  allowFullScreen=""
                  loading="eager"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </Box>
            </Box>
          </Box>
        </Box>
      </Container>

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
