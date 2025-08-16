import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    mode: "light",
    primary: { main: "#4b6b85" }, // tmavá z hlavičky/odkazů (případně upravíme)
    secondary: { main: "#9eb5c9" }, // viz přechody v původním CSS
    text: { primary: "#222", secondary: "#444" },
    background: { default: "#fff", paper: "#fff" },
  },
  typography: {
    fontFamily: `"Inter", system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif`,
    h1: { fontSize: "clamp(28px, 4vw, 42px)", fontWeight: 700 },
    h2: { fontSize: 24, fontWeight: 700, marginBottom: 12 },
    body1: { fontSize: 16, lineHeight: 1.6 },
  },
  spacing: 8,
  breakpoints: {
    // tvůj klíčový breakpoint je 800px → posuneme md
    values: { xs: 0, sm: 600, md: 800, lg: 1200, xl: 1536 },
  },
  shape: { borderRadius: 6 },
  components: {
    MuiButton: {
      defaultProps: { disableElevation: true },
    },
  },
});

export default theme;
