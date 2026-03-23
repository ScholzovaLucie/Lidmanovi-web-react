import { Box, Button, Grid, Stack, TextField, Typography } from "@mui/material";
import { AppCardCustomizable } from "../../../../components/containers/AppCard";
import { DatePicker } from "@mui/x-date-pickers";
import CustomTable from "../../components/CustomMuiTable";
import { announcementColumns } from "./constants";

export default function AnnouncementSection() {
  return (
    <Stack p={{ sx: 1, md: 3 }} spacing={5}>
      <Stack>
        <Typography variant="h4" gutterBottom>
          Oznámení
        </Typography>
        <Typography variant="body1">
          Zde můžete spravovat oznámení pro vaše hosty. Přidávejte, upravujte
          nebo odstraňujte důležitá sdělení, která se zobrazí při rezervaci nebo
          v profilu hosta.
        </Typography>
      </Stack>

      <Stack>
        <Typography variant="h5" gutterBottom>
          Nové oznámení
        </Typography>
        <AppCardCustomizable props={{ p: 2 }}>
          <TextField multiline rows={5} fullWidth label="Zpráva oznámení" />
          <Stack
            direction="row"
            spacing={2}
            pt={2}
            justifyContent={"space-between"}
          >
            <DatePicker label="Od" sx={{ width: "100%" }} />
            <DatePicker label="Do" sx={{ width: "100%" }} />
            <Button variant="contained" color="primary" fullWidth>
              Uložit oznámení
            </Button>
          </Stack>
        </AppCardCustomizable>
      </Stack>

      <Stack>
        <Typography variant="h5" gutterBottom>
          Aktivní oznámení
        </Typography>
        <AppCardCustomizable>
          <CustomTable
            columns={announcementColumns}
            data={[
              {
                id: 1,
                title: "Nové oznámení",
                starts_at: "2024-06-01",
                ends_at: "2024-06-30",
              },
            ]}
            getRowId={(row) => row.id}
          />
        </AppCardCustomizable>
      </Stack>
    </Stack>
  );
}
