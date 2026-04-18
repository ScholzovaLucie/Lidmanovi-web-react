import { Box, Container, Divider, Paper, Typography } from "@mui/material";
import { useSelector } from "react-redux";
import EditableTranslationText from "../components/EditableTranslationText";
import { selectIsAuthenticated } from "../redux/slices/app/appSlice";

const NS = "gdpr";

function SectionTitle({ i18nKey }) {
  return (
    <EditableTranslationText
      ns={NS}
      i18nKey={i18nKey}
      variant="h6"
      sx={{ fontWeight: 700, mb: 1.5 }}
    />
  );
}

function SectionText({ i18nKey }) {
  return (
    <EditableTranslationText
      ns={NS}
      i18nKey={i18nKey}
      variant="body1"
      sx={{ color: "text.secondary", lineHeight: 1.8, mb: 1.5 }}
    />
  );
}

function SectionList({ i18nKey }) {
  return (
    <Box component="ul" sx={{ pl: 3, mb: 1.5 }}>
      <EditableTranslationText
        ns={NS}
        i18nKey={i18nKey}
        variant="body1"
        sx={{ color: "text.secondary", mb: 0.5 }}
      />
    </Box>
  );
}

function Section({ titleKey, children }) {
  return (
    <Box sx={{ mb: 4 }}>
      <SectionTitle i18nKey={titleKey} />
      {children}
    </Box>
  );
}

export default function Gdpr() {
  const isAuthenticated = useSelector(selectIsAuthenticated);

  return (
    <Container maxWidth="md" sx={{ py: { xs: 6, md: 8 } }}>
      <Paper
        sx={{
          position: "relative",
          p: { xs: 3, md: 4 },
          overflow: "hidden",
          border: "1px solid",
          borderColor: isAuthenticated ? "secondary.main" : "rgba(85,116,143,0.12)",
          background: "rgba(255,255,255,0.96)",
          outline: isAuthenticated ? "1px dashed" : "none",
          outlineColor: isAuthenticated ? "secondary.main" : "transparent",
        }}
      >
        {isAuthenticated && (
          <Box
            sx={{
              position: "absolute",
              top: 8,
              right: 8,
              px: 1,
              py: 0.25,
              borderRadius: 1,
              bgcolor: "secondary.main",
              color: "secondary.contrastText",
              fontSize: 11,
              fontWeight: 700,
            }}
          >
            Editovatelný blok
          </Box>
        )}

        <EditableTranslationText
          ns={NS}
          i18nKey="pageTitle"
          variant="h4"
          sx={{ fontWeight: 700, fontFamily: '"Cormorant Garamond", Georgia, serif', mb: 0.5 }}
        />
        <EditableTranslationText
          ns={NS}
          i18nKey="lastUpdated"
          variant="body2"
          sx={{ color: "text.secondary", mb: 4 }}
        />

        <Divider sx={{ mb: 4 }} />

        <Section titleKey="section1.title">
          <SectionText i18nKey="section1.text" />
        </Section>

        <Section titleKey="section2.title">
          <SectionText i18nKey="section2.intro" />
          <SectionList i18nKey="section2.items" />
        </Section>

        <Section titleKey="section3.title">
          <SectionText i18nKey="section3.reservation" />
          <SectionText i18nKey="section3.contact" />
          <SectionText i18nKey="section3.legal" />
        </Section>

        <Section titleKey="section4.title">
          <SectionText i18nKey="section4.intro" />
          <SectionList i18nKey="section4.items" />
        </Section>

        <Section titleKey="section5.title">
          <SectionText i18nKey="section5.intro" />
          <SectionList i18nKey="section5.items" />
        </Section>

        <Section titleKey="section6.title">
          <SectionText i18nKey="section6.intro" />
          <SectionList i18nKey="section6.items" />
          <SectionText i18nKey="section6.contact" />
        </Section>

        <Section titleKey="section7.title">
          <SectionText i18nKey="section7.text" />
        </Section>

        <Section titleKey="section8.title">
          <SectionText i18nKey="section8.text" />
        </Section>

        <Divider sx={{ mt: 2, mb: 3 }} />
        <EditableTranslationText
          ns={NS}
          i18nKey="footerNote"
          variant="body2"
          sx={{ color: "text.disabled" }}
        />
      </Paper>
    </Container>
  );
}
