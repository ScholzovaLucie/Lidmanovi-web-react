import React from "react";
import { useSnackbar } from "notistack";
import {
  Alert,
  Box,
  Button,
  Container,
  FormControl,
  FormControlLabel,
  FormHelperText,
  FormLabel,
  MenuItem,
  Paper,
  Radio,
  RadioGroup,
  TextField,
  Typography,
} from "@mui/material";
import { useCreateVoucherOrderMutation, useVoucherAmountsQuery } from "../redux/api/vouchersApi";
import { getApiErrorMessage } from "../utils/apiError";

const initialForm = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  country: "CZ",
  guestNote: "",
  delivery: "email",
  amountId: "",
  shippingStreet: "",
  shippingHouseNumber: "",
  shippingCity: "",
  shippingPostalCode: "",
  shippingCountry: "Česká republika",
  note: "",
};

const formatAmount = (amount) =>
  new Intl.NumberFormat("cs-CZ", { style: "currency", currency: amount.currency }).format(amount.value);

const countries = [
  ["CZ", "Česko (CZ)"],
  ["SK", "Slovensko (SK)"],
  ["PL", "Polsko (PL)"],
  ["DE", "Německo (DE)"],
  ["AT", "Rakousko (AT)"],
  ["HU", "Maďarsko (HU)"],
  ["SI", "Slovinsko (SI)"],
  ["IT", "Itálie (IT)"],
  ["CH", "Švýcarsko (CH)"],
  ["GB", "Spojené království (GB)"],
  ["FR", "Francie (FR)"],
  ["ES", "Španělsko (ES)"],
  ["NL", "Nizozemsko (NL)"],
  ["SE", "Švédsko (SE)"],
  ["NO", "Norsko (NO)"],
  ["UA", "Ukrajina (UA)"],
  ["US", "Spojené státy (US)"],
  ["CA", "Kanada (CA)"],
  ["BR", "Brazílie (BR)"],
  ["AU", "Austrálie (AU)"],
  ["NZ", "Nový Zéland (NZ)"],
  ["JP", "Japonsko (JP)"],
  ["KR", "Jižní Korea (KR)"],
  ["CN", "Čína (CN)"],
  ["IN", "Indie (IN)"],
  ["AE", "Spojené arabské emiráty (AE)"],
  ["ZA", "Jihoafrická republika (ZA)"],
];

export default function Vouchers() {
  const [form, setForm] = React.useState(initialForm);
  const [errors, setErrors] = React.useState({});
  const [submittedOrder, setSubmittedOrder] = React.useState(null);
  const confirmationRef = React.useRef(null);
  const { enqueueSnackbar } = useSnackbar();
  const { data: amounts = [], isLoading: areAmountsLoading, isError: areAmountsUnavailable } = useVoucherAmountsQuery();
  const [createOrder, { isLoading: isSubmitting }] = useCreateVoucherOrderMutation();

  const handleChange = (event) => {
    const { name, value } = event.target;
    const nextForm = { ...form, [name]: value };
    const nextErrors = validate(nextForm);
    setForm(nextForm);
    setErrors((current) => ({ ...current, [name]: nextErrors[name] || "" }));
    setSubmittedOrder(null);
  };

  const validate = (values = form) => {
    const nextErrors = {};
    if (!values.firstName.trim()) nextErrors.firstName = "Vyplňte jméno.";
    if (!values.lastName.trim()) nextErrors.lastName = "Vyplňte příjmení.";
    if (!/^\S+@\S+\.\S+$/.test(values.email)) nextErrors.email = "Zadejte platný e-mail.";
    if (!/^\+?[0-9\s()-]{7,20}$/.test(values.phone.trim())) nextErrors.phone = "Zadejte platný telefon.";
    if (!countries.some(([code]) => code === values.country)) nextErrors.country = "Vyberte zemi.";
    if (!values.amountId) nextErrors.amountId = "Vyberte hodnotu poukazu.";
    if (values.delivery === "print") {
      if (!values.shippingStreet.trim()) nextErrors.shippingStreet = "Vyplňte ulici.";
      if (!values.shippingHouseNumber.trim()) nextErrors.shippingHouseNumber = "Vyplňte číslo domu.";
      if (!values.shippingCity.trim()) nextErrors.shippingCity = "Vyplňte město.";
      if (!/^[0-9A-Za-z -]{3,12}$/.test(values.shippingPostalCode.trim())) nextErrors.shippingPostalCode = "Zadejte platné PSČ.";
      if (!values.shippingCountry.trim()) nextErrors.shippingCountry = "Vyplňte zemi.";
    }
    return nextErrors;
  };

  const isFormValid = Object.keys(validate()).length === 0;

  React.useLayoutEffect(() => {
    if (!submittedOrder) return;

    confirmationRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    confirmationRef.current?.focus({ preventScroll: true });
  }, [submittedOrder]);

  const handleNewOrder = () => {
    setForm(initialForm);
    setErrors({});
    setSubmittedOrder(null);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const nextErrors = validate();
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) return;

    try {
      const payload = {
        amount_id: Number(form.amountId),
        delivery_method: form.delivery,
        note: form.note.trim(),
        guest: {
          first_name: form.firstName.trim(),
          last_name: form.lastName.trim(),
          email: form.email.trim(),
          phone: form.phone.trim(),
          country: form.country.trim(),
          note: form.guestNote.trim(),
        },
      };
      if (form.delivery === "print") {
        Object.assign(payload, {
          shipping_street: form.shippingStreet.trim(),
          shipping_house_number: form.shippingHouseNumber.trim(),
          shipping_city: form.shippingCity.trim(),
          shipping_postal_code: form.shippingPostalCode.trim(),
          shipping_country: form.shippingCountry.trim(),
        });
      }
      const order = await createOrder(payload).unwrap();
      setSubmittedOrder(order);
    } catch (error) {
      enqueueSnackbar(getApiErrorMessage(error, "Objednávku se nepodařilo odeslat. Zkuste to prosím znovu."), {
        variant: "error",
      });
    }
  };

  return (
    <Box sx={{ borderTop: "1px solid #dfd4c4", bgcolor: "background.default", py: { xs: 4, md: 7 } }}>
      <Container maxWidth="lg">
        <Box component="header" sx={{ maxWidth: 780, mb: { xs: 4, md: 6 } }}>
          <Typography sx={{ color: "primary.main", fontSize: "0.75rem", fontWeight: 800, letterSpacing: "0.24em", textTransform: "uppercase", mb: 1 }}>
            Dárek podle vašeho přání
          </Typography>
          <Typography variant="h1" sx={{ mb: 1.5 }}>Dárkové poukazy</Typography>
          <Typography color="text.secondary" sx={{ maxWidth: 590, fontSize: { xs: "1rem", md: "1.1rem" } }}>Vyberte hodnotu, vyplňte kontaktní údaje a zvolte, jak si přejete poukaz doručit.</Typography>
        </Box>
        <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", lg: "minmax(0, 1.1fr) minmax(320px, 0.7fr)" }, gap: { xs: 5, lg: 8 }, alignItems: "start" }}>
            <Paper component={submittedOrder ? "section" : "form"} onSubmit={submittedOrder ? undefined : handleSubmit} variant="outlined" sx={{ p: { xs: 3, md: 5 }, borderColor: "#dfd4c4", boxShadow: "0 18px 42px rgba(45,40,35,0.05)" }}>
              {submittedOrder ? (
                <Box ref={confirmationRef} tabIndex={-1} sx={{ py: { xs: 1, md: 3 }, textAlign: "center", scrollMarginTop: (theme) => theme.spacing(10) }}>
                  <Typography variant="h2" sx={{ fontSize: { xs: "2.2rem", md: "2.8rem" }, mb: 1.5 }}>Děkujeme za objednávku</Typography>
                  <Typography sx={{ color: "success.dark", fontSize: "1rem", fontWeight: 700, mb: 1.5 }}>Objednávka číslo {submittedOrder.number} byla úspěšně přijata.</Typography>
                  <Typography sx={{ color: "text.secondary", fontSize: "1rem", mb: 1.5 }}>Potvrzení objednávky jsme odeslali na váš e-mail.</Typography>
                  <Typography sx={{ color: "text.secondary", fontSize: "1rem", mb: 3.5 }}>Údaje k platbě vám zašleme e-mailem. Platbu pak provedete podle pokynů, které v něm obdržíte.</Typography>
                  <Button type="button" variant="outlined" onClick={handleNewOrder}>Objednat další poukaz</Button>
                </Box>
              ) : (
                <>
                  <Typography variant="h2" sx={{ fontSize: { xs: "2.2rem", md: "2.8rem" }, mb: 0.5 }}>Objednávka poukazu</Typography>
                  <Typography sx={{ color: "text.secondary", fontSize: "0.94rem", mb: 4 }}>Zabere vám jen chvilku.</Typography>
                <Box sx={{ borderTop: "1px solid #e2d7c8", pt: 2.5 }}>
                <Typography sx={{ color: "primary.main", fontSize: "0.71rem", fontWeight: 800, letterSpacing: "0.18em", textTransform: "uppercase", mb: 2 }}>1. Kontaktní údaje</Typography>
                <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" }, gap: 2 }}>
                  <TextField label="Jméno" name="firstName" value={form.firstName} onChange={handleChange} error={Boolean(errors.firstName)} helperText={errors.firstName} required />
                  <TextField label="Příjmení" name="lastName" value={form.lastName} onChange={handleChange} error={Boolean(errors.lastName)} helperText={errors.lastName} required />
                </Box>
                <TextField sx={{ mt: 2 }} type="email" label="E-mail" name="email" value={form.email} onChange={handleChange} error={Boolean(errors.email)} helperText={errors.email || "Na tento e-mail zašleme potvrzení objednávky."} fullWidth required />
                <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" }, gap: 2, mt: 2 }}>
                  <TextField type="tel" label="Telefon" name="phone" value={form.phone} onChange={handleChange} error={Boolean(errors.phone)} helperText={errors.phone || "Například +420 777 123 456."} required />
                  <TextField select label="Země" name="country" value={form.country} onChange={handleChange} error={Boolean(errors.country)} helperText={errors.country} required>
                    {countries.map(([code, label]) => <MenuItem key={code} value={code}>{label}</MenuItem>)}
                  </TextField>
                </Box>
                <TextField sx={{ mt: 2 }} label="Poznámka pro kontakt" name="guestNote" value={form.guestNote} onChange={handleChange} helperText="Nepovinné." fullWidth multiline minRows={2} />
              </Box>

              <Box sx={{ borderTop: "1px solid #e2d7c8", mt: 3.5, pt: 2.5 }}>
                <Typography sx={{ color: "primary.main", fontSize: "0.71rem", fontWeight: 800, letterSpacing: "0.18em", textTransform: "uppercase", mb: 2 }}>2. Hodnota a doručení</Typography>
                <TextField select label="Hodnota poukazu" name="amountId" value={form.amountId} onChange={handleChange} error={Boolean(errors.amountId)} helperText={errors.amountId || "Poukaz lze využít jednorázově na naše služby."} fullWidth disabled={areAmountsLoading || areAmountsUnavailable}>
                  {amounts.map((amount) => <MenuItem key={amount.id} value={String(amount.id)}>{formatAmount(amount)}</MenuItem>)}
                </TextField>
                {areAmountsUnavailable && <Alert severity="error" sx={{ mt: 2 }}>Hodnoty poukazů se nepodařilo načíst. Zkuste to prosím později.</Alert>}

                <FormControl sx={{ mt: 2.5, display: "flex", width: "100%", p: 2, bgcolor: "primary.50", border: "1px solid #dce9f1" }} error={Boolean(errors.delivery)}>
                  <FormLabel sx={{ color: "text.primary", fontWeight: 700 }}>Způsob doručení</FormLabel>
                  <RadioGroup name="delivery" value={form.delivery} onChange={handleChange} sx={{ mt: 0.75, gap: 0.25 }}>
                    <FormControlLabel value="email" control={<Radio />} label="Poslat e-mailem" />
                    <FormControlLabel value="print" control={<Radio />} label="Tištěný poukaz na adresu" />
                  </RadioGroup>
                  {errors.delivery && <FormHelperText>{errors.delivery}</FormHelperText>}
                </FormControl>
                {form.delivery === "print" && (
                  <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "minmax(0, 1fr) minmax(0, 0.55fr)" }, gap: 2, mt: 2 }}>
                    <TextField label="Ulice" name="shippingStreet" value={form.shippingStreet} onChange={handleChange} error={Boolean(errors.shippingStreet)} helperText={errors.shippingStreet} required />
                    <TextField label="Číslo domu" name="shippingHouseNumber" value={form.shippingHouseNumber} onChange={handleChange} error={Boolean(errors.shippingHouseNumber)} helperText={errors.shippingHouseNumber} required />
                    <TextField label="Město" name="shippingCity" value={form.shippingCity} onChange={handleChange} error={Boolean(errors.shippingCity)} helperText={errors.shippingCity} required />
                    <TextField label="PSČ" name="shippingPostalCode" value={form.shippingPostalCode} onChange={handleChange} error={Boolean(errors.shippingPostalCode)} helperText={errors.shippingPostalCode} required />
                    <TextField sx={{ gridColumn: { sm: "1 / -1" } }} label="Země" name="shippingCountry" value={form.shippingCountry} onChange={handleChange} error={Boolean(errors.shippingCountry)} helperText={errors.shippingCountry || "Pro tištěnou variantu je adresa povinná."} required />
                  </Box>
                )}
                <TextField sx={{ mt: 2 }} label="Poznámka k objednávce" name="note" value={form.note} onChange={handleChange} helperText="Nepovinné." fullWidth multiline minRows={2} />
              </Box>

                <Button type="submit" variant="contained" size="large" fullWidth disabled={!isFormValid || isSubmitting || areAmountsLoading || areAmountsUnavailable} sx={{ mt: 3.5, py: 1.5, whiteSpace: "nowrap" }}>
                  {isSubmitting ? "Odesíláme objednávku..." : "Objednat poukaz"}
                </Button>
                <Typography sx={{ mt: 1.5, textAlign: "center", color: "text.secondary", fontSize: "0.78rem" }}>Po objednání vám zašleme potvrzení e-mailem.</Typography>
                </>
              )}
            </Paper>

          <Box component="aside" sx={{ position: { lg: "sticky" }, top: { lg: 104 } }}>
            <Box sx={{ borderTop: "2px solid", borderColor: "primary.main", pt: 2.5 }}>
              <Typography sx={{ mb: 0.75, color: "primary.main", fontSize: "0.72rem", fontWeight: 800, letterSpacing: "0.2em", textTransform: "uppercase" }}>Jak bude dárek vypadat</Typography>
              <Typography variant="h2" sx={{ mb: 1.25, fontSize: { xs: "2.25rem", md: "2.75rem" } }}>Náhled poukazu</Typography>
              <Typography sx={{ mb: 3, color: "text.secondary", fontSize: "0.9rem" }}>Přední i zadní stranu dárkového poukazu připravíme podle zvolené hodnoty.</Typography>
              <Box sx={{ display: "grid", gap: 3 }}>
                {[
                  { src: "poukaz-predni.png", label: "Přední strana poukazu" },
                  { src: "poukaz-zadni.png", label: "Zadní strana poukazu" },
                ].map(({ src, label }) => (
                  <Box component="figure" key={src} sx={{ m: 0 }}>
                    <Typography sx={{ mb: 0.75, fontSize: "0.72rem", fontWeight: 800, letterSpacing: "0.13em", textTransform: "uppercase", color: "text.secondary" }}>{label}</Typography>
                    <Box
                      component="img"
                      src={`${import.meta.env.BASE_URL}${src}`}
                      alt={label}
                      sx={{ display: "block", width: "100%", height: "auto", border: "1px solid rgba(45,40,35,0.14)", boxShadow: "0 14px 28px rgba(45,40,35,0.12)" }}
                    />
                  </Box>
                ))}
              </Box>
            </Box>
          </Box>
        </Box>
      </Container>
    </Box>
  );
}
