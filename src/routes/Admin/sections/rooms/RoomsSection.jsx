import { Stack, Typography } from "@mui/material";

export default function RoomsSection() {
  return (
    <Stack p={{ sx: 1, md: 3 }} spacing={5}>
      <Stack>
        <Typography variant="h4" gutterBottom>
          Pokoje
        </Typography>
        <Typography variant="body1">
          Zde můžete spravovat informace o pokojích, které nabízíte. Přidávejte
          nové pokoje, upravujte stávající nebo odstraňujte ty, které již
          nenabízíte. Můžete také nastavit ceny, popisy a fotografie pro každý
          pokoj.
        </Typography>
      </Stack>
    </Stack>
  );
}
