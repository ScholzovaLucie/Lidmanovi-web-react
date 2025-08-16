import React from "react";
import {
  Box,
  Container,
  Paper,
  TextField,
  Typography,
  Button,
  MenuItem,
  Alert,
} from "@mui/material";

// volitelné: seznam balíčků na výběr
const PACKAGES = [
  { value: "---", label: "---" },
  {
    value: "Prodloužený víkend ve Stolových horách",
    label: "Prodloužený víkend ve Stolových horách",
  },
  {
    value: "Pětidenní turisticko-poznávací pobyt na Machovsku",
    label: "Pětidenní turisticko-poznávací pobyt na Machovsku",
  },
  {
    value: "Týdenní dovolená na Broumovsku",
    label: "Týdenní dovolená na Broumovsku",
  },
];

export default function ReservationForm({
  recipient = "info@ulidmanu.cz", // kam poslat mailto
}) {
  const [form, setForm] = React.useState({
    userName: "",
    userEmail: "",
    userTelefon: "",
    date_od: "",
    date_do: "",
    balicek: "---",
    subject: "",
    zprava: "",
  });
  const [errors, setErrors] = React.useState({});
  const [sent, setSent] = React.useState(false);

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
    setErrors((er) => ({ ...er, [name]: "" }));
  };

  const validate = () => {
    const er = {};
    if (!form.userName.trim()) er.userName = "Vyplňte prosím jméno.";
    if (!form.userEmail.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/))
      er.userEmail = "Zadejte platný e-mail.";
    if (!form.userTelefon.trim()) er.userTelefon = "Zadejte telefon.";
    if (!form.date_od) er.date_od = "Vyberte datum příjezdu.";
    if (!form.date_do) er.date_do = "Vyberte datum odjezdu.";
    if (form.date_od && form.date_do && form.date_do < form.date_od)
      er.date_do = "Datum odjezdu musí být po datu příjezdu.";
    if (!form.subject.trim()) er.subject = "Vyplňte předmět.";
    return er;
  };

  const onSubmit = (e) => {
    e.preventDefault();
    const er = validate();
    setErrors(er);
    if (Object.keys(er).length) return;

    // MAILTO fallback (bez backendu)
    const bodyLines = [
      `Jméno: ${form.userName}`,
      `E-mail: ${form.userEmail}`,
      `Telefon: ${form.userTelefon}`,
      `Termín: ${form.date_od} – ${form.date_do}`,
      `Pobytový balíček: ${form.balicek}`,
      `Zpráva:`,
      form.zprava || "(neuvedeno)",
    ];
    const url =
      `mailto:${recipient}` +
      `?subject=${encodeURIComponent(form.subject)}` +
      `&body=${encodeURIComponent(bodyLines.join("\n"))}`;

    // otevřít klienta
    window.location.href = url;
    setSent(true);

    // Pokud budeš chtít posílat přes API:
    // fetch("/api/reservation", { method:"POST", headers:{ "Content-Type":"application/json" }, body: JSON.stringify(form) })
  };

  return (
    <Container maxWidth="sm" sx={{ py: { xs: 4, md: 6 } }} id="rezervace-form">
      <Paper variant="outlined" sx={{ p: { xs: 2, md: 3 } }}>
        <Typography
          variant="h5"
          sx={{ fontWeight: 700, mb: 2, textAlign: "center" }}
        >
          Rezervace ubytování
        </Typography>

        {sent && (
          <Alert severity="info" sx={{ mb: 2 }}>
            Otevřel/a se e-mailová aplikace s předvyplněnou zprávou. Pokud se
            neotevřela, napište prosím na <b>{recipient}</b>.
          </Alert>
        )}

        <Box
          component="form"
          noValidate
          onSubmit={onSubmit}
          sx={{ display: "grid", gap: 2 }}
        >
          <TextField
            label="Jméno"
            name="userName"
            value={form.userName}
            onChange={onChange}
            error={!!errors.userName}
            helperText={errors.userName}
            fullWidth
          />

          <TextField
            type="email"
            label="E-mail"
            name="userEmail"
            value={form.userEmail}
            onChange={onChange}
            error={!!errors.userEmail}
            helperText={errors.userEmail}
            fullWidth
          />

          <TextField
            label="Telefon"
            name="userTelefon"
            value={form.userTelefon}
            onChange={onChange}
            error={!!errors.userTelefon}
            helperText={errors.userTelefon}
            fullWidth
          />

          {/* Termín pobytu */}
          <Box
            sx={{
              display: "grid",
              gap: 2,
              gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
            }}
          >
            <TextField
              type="date"
              label="Příjezd"
              name="date_od"
              value={form.date_od}
              onChange={onChange}
              error={!!errors.date_od}
              helperText={errors.date_od || " "}
              InputLabelProps={{ shrink: true }}
              fullWidth
            />
            <TextField
              type="date"
              label="Odjezd"
              name="date_do"
              value={form.date_do}
              onChange={onChange}
              error={!!errors.date_do}
              helperText={errors.date_do || " "}
              InputLabelProps={{ shrink: true }}
              fullWidth
            />
          </Box>

          {/* Balíček */}
          <TextField
            select
            label="Pobytový balíček"
            name="balicek"
            value={form.balicek}
            onChange={onChange}
            fullWidth
          >
            {PACKAGES.map((p) => (
              <MenuItem key={p.value} value={p.value}>
                {p.label}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            label="Předmět"
            name="subject"
            value={form.subject}
            onChange={onChange}
            error={!!errors.subject}
            helperText={errors.subject}
            fullWidth
          />

          <TextField
            label="Zpráva"
            name="zprava"
            value={form.zprava}
            onChange={onChange}
            fullWidth
            multiline
            minRows={4}
          />

          <Button
            type="submit"
            variant="contained"
            size="large"
            sx={{ mt: 1, alignSelf: "center" }}
          >
            Odeslat
          </Button>
        </Box>
      </Paper>
    </Container>
  );
}
