import { Alert, Box, FormControlLabel, Paper, Stack, Switch, Typography } from "@mui/material";
import { useSnackbar } from "notistack";
import {
  useGetAppSettingsQuery,
  useUpsertAppSettingMutation,
} from "../../../../redux/api/appSettingsApi";
import { getApiErrorMessage } from "../../../../utils/apiError";

const LANGUAGE_SWITCHER_ENABLED_KEY = "languageSwitcher.enabled";

export default function SettingsSection() {
  const { data: appSettings, isLoading, isError } = useGetAppSettingsQuery();
  const [upsertAppSetting, { isLoading: isSaving }] =
    useUpsertAppSettingMutation();
  const { enqueueSnackbar } = useSnackbar();
  const isLanguageSwitcherEnabled =
    appSettings?.[LANGUAGE_SWITCHER_ENABLED_KEY] === true;

  const handleLanguageSwitcherChange = async (event) => {
    const value = event.target.checked;

    try {
      await upsertAppSetting({
        key: LANGUAGE_SWITCHER_ENABLED_KEY,
        value,
      }).unwrap();
      enqueueSnackbar("Nastavení bylo uloženo.", { variant: "success" });
    } catch (error) {
      enqueueSnackbar(getApiErrorMessage(error, "Nastavení se nepodařilo uložit."), {
        variant: "error",
      });
    }
  };

  if (isLoading) {
    return (
      <Box sx={{ textAlign: "center", py: 8 }}>
        <Typography>Načítání nastavení...</Typography>
      </Box>
    );
  }

  if (isError) {
    return (
      <Box sx={{ textAlign: "center", py: 8 }}>
        <Typography color="error">Nastavení se nepodařilo načíst.</Typography>
      </Box>
    );
  }

  return (
    <Stack p={{ md: 3 }} spacing={3}>
      <Stack spacing={0.5}>
        <Typography variant="h4">Nastavení</Typography>
        <Typography color="text.secondary">
          Správa veřejných provozních nastavení webu.
        </Typography>
      </Stack>

      <Alert severity="info">
        Do těchto nastavení neukládejte hesla, tokeny ani integrační klíče.
      </Alert>

      <Paper variant="outlined" sx={{ p: 2 }}>
        <FormControlLabel
          control={
            <Switch
              checked={isLanguageSwitcherEnabled}
              disabled={isSaving}
              onChange={handleLanguageSwitcherChange}
            />
          }
          label="Zobrazit přepínač jazyka"
        />
        <Typography variant="body2" color="text.secondary" sx={{ ml: 0.5 }}>
          Umožní návštěvníkům změnit jazyk webu v hlavičce a mobilním menu.
        </Typography>
      </Paper>
    </Stack>
  );
}
