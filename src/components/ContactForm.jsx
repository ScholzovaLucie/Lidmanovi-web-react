import React from "react";
import {
  Box,
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  FormControlLabel,
  Checkbox,
  Snackbar,
  Alert,
  CircularProgress,
} from "@mui/material";

/**
 * ContactForm – vše pod sebou, MUI + validace + consent.
 *
 * Props:
 * - title?: string = "Kontaktujte nás"
 * - maxWidth?: "xs"|"sm"|"md"|"lg"|"xl"|false = "lg"
 * - useMailto?: boolean = true
 * - mailto?: string = "info@ulidmanu.cz"
 * - requireConsent?: boolean = true
 * - defaultSubject?: string = ""
 * - onSubmit?: (data) => Promise<void> | void   // vlastní odeslání (pokud nepoužiješ mailto)
 * - sx?: object                                 // extra styly pro Paper
 */
export default function ContactForm({
  title = "Kontaktujte nás",
  maxWidth = "lg",
  useMailto = true,
  mailto = "info@ulidmanu.cz",
  requireConsent = true,
  defaultSubject = "",
  onSubmit,
  sx = {},
}) {
  const initialForm = React.useMemo(
    () => ({
      userName: "",
      userEmail: "",
      subject: defaultSubject,
      zprava: "",
      consent: !requireConsent, // pokud není vyžadován, považuj za odškrtnutý
      hp: "", // honeypot
    }),
    [defaultSubject, requireConsent]
  );

  const [form, setForm] = React.useState(initialForm);
  const [errors, setErrors] = React.useState({});
  const [touched, setTouched] = React.useState({});
  const [loading, setLoading] = React.useState(false);
  const [snack, setSnack] = React.useState({
    open: false,
    type: "success",
    msg: "",
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((f) => ({ ...f, [name]: type === "checkbox" ? checked : value }));
  };
  const handleBlur = (e) =>
    setTouched((t) => ({ ...t, [e.target.name]: true }));

  const validate = () => {
    const e = {};
    if (!form.userName.trim()) e.userName = "Zadejte prosím jméno.";
    if (!form.userEmail.trim()) e.userEmail = "Zadejte prosím e-mail.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.userEmail))
      e.userEmail = "Neplatný formát e-mailu.";
    if (!form.subject.trim()) e.subject = "Zadejte prosím předmět.";
    if (!form.zprava.trim()) e.zprava = "Napište prosím zprávu.";
    if (requireConsent && !form.consent)
      e.consent = "Potvrďte prosím souhlas se zpracováním.";
    setErrors(e);
    return e;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const eObj = validate();
    if (Object.keys(eObj).length > 0 || form.hp) return; // hp = bot

    try {
      setLoading(true);

      if (onSubmit) {
        await onSubmit({
          userName: form.userName,
          userEmail: form.userEmail,
          subject: form.subject,
          zprava: form.zprava,
        });
        setSnack({
          open: true,
          type: "success",
          msg: "Zpráva byla odeslána. Děkujeme!",
        });
      } else if (useMailto) {
        const body = encodeURIComponent(
          `Jméno: ${form.userName}\nE-mail: ${form.userEmail}\n\n${form.zprava}`
        );
        const subject = encodeURIComponent(form.subject);
        window.location.href = `mailto:${mailto}?subject=${subject}&body=${body}`;
        setSnack({
          open: true,
          type: "info",
          msg: "Otevírám váš e-mailový klient…",
        });
      } else {
        setSnack({
          open: true,
          type: "error",
          msg: "Není nastaven způsob odeslání.",
        });
        return;
      }

      setForm(initialForm);
      setTouched({});
    } catch (err) {
      console.error(err);
      setSnack({
        open: true,
        type: "error",
        msg: "Odeslání se nezdařilo. Zkuste to prosím znovu.",
      });
    } finally {
      setLoading(false);
    }
  };

  const FormInner = (
    <Box component="form" noValidate onSubmit={handleSubmit}>
      {/* Honeypot (antispam) */}
      <input
        type="text"
        name="hp"
        value={form.hp}
        onChange={handleChange}
        style={{ display: "none" }}
      />

      {/* VŠE POD SEBOU */}
      <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        <TextField
          label="Jméno *"
          name="userName"
          value={form.userName}
          onChange={handleChange}
          onBlur={handleBlur}
          error={touched.userName && !!errors.userName}
          helperText={touched.userName && errors.userName}
          fullWidth
          autoComplete="name"
        />

        <TextField
          type="email"
          label="Email *"
          name="userEmail"
          value={form.userEmail}
          onChange={handleChange}
          onBlur={handleBlur}
          error={touched.userEmail && !!errors.userEmail}
          helperText={touched.userEmail && errors.userEmail}
          fullWidth
          autoComplete="email"
        />

        <TextField
          label="Předmět *"
          name="subject"
          value={form.subject}
          onChange={handleChange}
          onBlur={handleBlur}
          error={touched.subject && !!errors.subject}
          helperText={touched.subject && errors.subject}
          fullWidth
        />

        <TextField
          label="Zpráva *"
          name="zprava"
          value={form.zprava}
          onChange={handleChange}
          onBlur={handleBlur}
          error={touched.zprava && !!errors.zprava}
          helperText={touched.zprava && errors.zprava}
          fullWidth
          multiline
          minRows={4}
          inputProps={{ maxLength: 2000 }}
        />
        <Typography variant="caption" sx={{ color: "text.secondary" }}>
          Max. 2000 znaků
        </Typography>

        {requireConsent && (
          <>
            <FormControlLabel
              control={
                <Checkbox
                  name="consent"
                  checked={form.consent}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
              }
              label="Souhlasím se zpracováním osobních údajů za účelem vyřízení mého dotazu."
            />
            {touched.consent && errors.consent && (
              <Typography variant="caption" color="error" sx={{ mt: -1 }}>
                {errors.consent}
              </Typography>
            )}
          </>
        )}

        <Button
          type="submit"
          variant="contained"
          disabled={loading}
          startIcon={loading ? <CircularProgress size={18} /> : null}
          sx={{ alignSelf: "flex-start" }}
        >
          {loading ? "Odesílám…" : "Odeslat"}
        </Button>
      </Box>
    </Box>
  );

  return (
    <>
      <Container
        id="kontakt-form"
        maxWidth={false}
        sx={{
          width: { xs: "100%", sm: "100%" },
          maxWidth: 720, // strop šířky
          mx: "auto", // centrování
          px: { xs: 2, md: 0 }, // malý horizontální padding na mobilu
          py: { xs: 4, md: 6 },
        }}
      >
        <Paper
          variant="outlined"
          sx={{
            width: "100%",
            p: { xs: 2, md: 3 },
            borderRadius: 2,
            boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
            ...sx,
          }}
        >
          <Typography variant="h5" sx={{ fontWeight: 700, mb: 2 }}>
            {title}
          </Typography>
          {FormInner}
        </Paper>
      </Container>

      {/* Snackbar beze změny */}

      <Snackbar
        open={snack.open}
        autoHideDuration={3000}
        onClose={() => setSnack((s) => ({ ...s, open: false }))}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={() => setSnack((s) => ({ ...s, open: false }))}
          severity={snack.type}
          variant="filled"
          sx={{ width: "100%" }}
        >
          {snack.msg}
        </Alert>
      </Snackbar>
    </>
  );
}
