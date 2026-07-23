import { Stack, Typography, TextField, Button, Box } from "@mui/material";
import { Save } from "@mui/icons-material";
import { useTranslation } from "react-i18next";
import { useSnackbar } from "notistack";
import { useEditorialEditor } from "../../../../context/editorialEditorContext";
import { navConfig, langOptions } from "../../../../components/headerConfig";

const NS = "global";

function flattenNavKeys(items) {
  const result = [];
  items.forEach((item) => {
    result.push({ i18nKey: `nav.${item.key}`, fallback: item.fallback, indent: false });
    (item.children || []).forEach((child) => {
      result.push({ i18nKey: `nav.${child.key}`, fallback: child.fallback, indent: true });
    });
  });
  return result;
}

export default function MenuSection() {
  const { enqueueSnackbar } = useSnackbar();
  const { t, i18n } = useTranslation("global");
  const { getInlineValue, setInlineValue, saveInlineChanges, isSaving } =
    useEditorialEditor();
  const activeLang = String(i18n.resolvedLanguage || i18n.language || "cs").split("-")[0];

  const items = flattenNavKeys(navConfig);

  const handleSave = async () => {
    try {
      await saveInlineChanges();
      enqueueSnackbar("Menu bylo uloženo", {
        variant: "success",
        autoHideDuration: 3000,
      });
    } catch (err) {
      console.error("Chyba při ukládání menu:", err);
      enqueueSnackbar("Chyba při ukládání menu", {
        variant: "error",
        autoHideDuration: 5000,
      });
    }
  };

  return (
    <Stack p={{ md: 3 }} spacing={2}>
      <Stack>
        <Typography variant="h4" gutterBottom>
          Menu
        </Typography>
        <Typography variant="body1">
          Zde můžete upravit texty odkazů v hlavní navigaci webu (odsazené
          položky jsou podnabídky, např. Ceník pod Ubytováním).
        </Typography>
      </Stack>

      <Stack direction="row" spacing={1}>
        {langOptions.map(({ code, label }) => (
          <Button
            key={code}
            onClick={() => i18n.changeLanguage(code)}
            variant={activeLang === code ? "contained" : "outlined"}
            size="small"
            sx={{ textTransform: "none" }}
          >
            {label}
          </Button>
        ))}
      </Stack>

      <Stack spacing={2} sx={{ maxWidth: 480 }}>
        {items.map(({ i18nKey, fallback, indent }) => {
          const compositeKey = `${NS}.${i18nKey}`;
          return (
            <TextField
              key={i18nKey}
              label={i18nKey}
              value={getInlineValue(compositeKey, t(i18nKey, { defaultValue: fallback }))}
              onChange={(e) => setInlineValue(compositeKey, e.target.value)}
              size="small"
              fullWidth
              sx={indent ? { ml: 3, width: "calc(100% - 24px)" } : undefined}
            />
          );
        })}
      </Stack>

      <Box>
        <Button
          variant="contained"
          startIcon={<Save />}
          onClick={handleSave}
          disabled={isSaving}
        >
          {isSaving ? "Ukládání..." : "Uložit"}
        </Button>
      </Box>
    </Stack>
  );
}
