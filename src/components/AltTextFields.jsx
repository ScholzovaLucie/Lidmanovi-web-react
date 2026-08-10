import { useState } from "react";
import { Box, Tabs, Tab, TextField } from "@mui/material";
import { SUPPORTED_LANGUAGES } from "../locales/pageRoutes.js";

const LANGUAGE_LABELS = {
  cs: "Čeština",
  en: "English",
  de: "Deutsch",
  pl: "Polski",
};

// value: alt_text_i18n objekt { cs: "...", en: "...", ... }
export default function AltTextFields({ value = {}, onChange, size = "small" }) {
  const [activeTab, setActiveTab] = useState(0);
  const activeLang = SUPPORTED_LANGUAGES[activeTab] || SUPPORTED_LANGUAGES[0];

  const handleFieldChange = (lang, text) => {
    onChange({ ...value, [lang]: text });
  };

  return (
    <Box>
      <Tabs
        value={activeTab}
        onChange={(_, v) => setActiveTab(v)}
        variant="scrollable"
        sx={{ minHeight: 32, mb: 1 }}
      >
        {SUPPORTED_LANGUAGES.map((lang) => (
          <Tab
            key={lang}
            label={LANGUAGE_LABELS[lang] || lang}
            sx={{ minHeight: 32, py: 0.5 }}
          />
        ))}
      </Tabs>
      <TextField
        fullWidth
        size={size}
        label={`Alt text (${LANGUAGE_LABELS[activeLang] || activeLang})`}
        placeholder="Popis obrázku pro čtečky obrazovky a SEO"
        value={value[activeLang] || ""}
        onChange={(e) => handleFieldChange(activeLang, e.target.value)}
      />
    </Box>
  );
}
