import { createTheme } from "@mui/material/styles";

// Function to create theme based on mode
export const createAppTheme = () =>
  createTheme({
    palette: {
      mode: "light",
      background: {
        default: "#f5f7fa",
        paper: "#ffffff",
      },
      text: {
        primary: "#15191f",
        secondary: "#5e6a78",
      },
      primary: {
        main: "#55748f",
        light: "#dfe8f1",
        dark: "#38536a",
        contrastText: "#ffffff",
        50: "#f3f7fb",
        100: "#e3edf6",
      },
      secondary: {
        main: "#8c98a4",
        light: "#e8edf2",
        dark: "#697583",
      },
      success: {
        main: "#2e7d32",
      },

      // Reservation status colors
      reservationStatus: {
        new:             { main: "#1565c0", contrastText: "#ffffff" }, // blue
        confirmed:       { main: "#2e7d32", contrastText: "#ffffff" }, // green
        cancelled:       { main: "#c62828", contrastText: "#ffffff" }, // red
        payment_pending: { main: "#e65100", contrastText: "#ffffff" }, // deep orange
        payed:           { main: "#00695c", contrastText: "#ffffff" }, // teal
        done:            { main: "#37474f", contrastText: "#ffffff" }, // blue-grey
      },

      // Event colors for calendar - pouze základní paleta
      event: {
        colors: [
          "#55748f", // primary
          "#d32f2f", // error
          "#2e7d32", // success
          "#ed6c02", // warning
          "#8c98a4", // secondary
        ],
      },
    },
    typography: {
      fontFamily: `"Jost", "Inter", system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif`,
      h1: {
        fontFamily: `"Cormorant Garamond", Georgia, serif`,
        fontSize: "clamp(34px, 5vw, 58px)",
        fontWeight: 400,
        lineHeight: 1.04,
        letterSpacing: "-0.025em",
      },
      h2: {
        fontFamily: `"Cormorant Garamond", Georgia, serif`,
        fontSize: "clamp(28px, 3vw, 40px)",
        fontWeight: 400,
        lineHeight: 1.08,
        marginBottom: 12,
        letterSpacing: "-0.02em",
      },
      h3: {
        fontFamily: `"Cormorant Garamond", Georgia, serif`,
        fontSize: "clamp(22px, 2.4vw, 30px)",
        fontWeight: 500,
        lineHeight: 1.2,
      },
      subtitle1: {
        letterSpacing: "0.14em",
        textTransform: "uppercase",
      },
      body1: { fontSize: 16, lineHeight: 1.85, fontWeight: 300 },
      body2: { fontSize: 14, lineHeight: 1.8, fontWeight: 300 },
    },
    spacing: 8,
    breakpoints: {
      // tvůj klíčový breakpoint je 800px → posuneme md
      values: { xs: 0, sm: 600, md: 800, lg: 1200, xl: 1536 },
    },
    shape: { borderRadius: 10 },
    components: {
      MuiCssBaseline: {
        styleOverrides: {
          body: {
            backgroundImage:
              "radial-gradient(circle at top, rgba(85,116,143,0.08), transparent 32%)",
          },
          "::selection": {
            backgroundColor: "rgba(85,116,143,0.2)",
          },
        },
      },
      MuiAppBar: {
        styleOverrides: {
          root: {
            backdropFilter: "blur(18px)",
            backgroundImage:
              "linear-gradient(180deg, rgba(255,255,255,0.96), rgba(255,255,255,0.84))",
            borderBottom: "1px solid rgba(85,116,143,0.10)",
          },
        },
      },
      MuiButton: {
        defaultProps: { disableElevation: true },
        styleOverrides: {
          root: {
            textTransform: "none",
            borderRadius: 4,
            paddingInline: 16,
            paddingBlock: 9,
            fontWeight: 400,
            letterSpacing: "0.16em",
          },
          contained: {
            boxShadow: "0 10px 24px rgba(85,116,143,0.18)",
          },
          outlined: {
            borderWidth: 1.5,
          },
          text: {
            borderRadius: 4,
          },
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: {
            backgroundImage: "none",
          },
          rounded: {
            borderRadius: 12,
          },
        },
      },
      MuiToolbar: {
        styleOverrides: {
          root: {
            minHeight: 78,
          },
        },
      },
      MuiLink: {
        styleOverrides: {
          root: {
            textUnderlineOffset: "0.2em",
          },
        },
      },
      MuiMenu: {
        styleOverrides: {
          paper: {
            marginTop: 8,
            borderRadius: 10,
            border: "1px solid rgba(85,116,143,0.12)",
            boxShadow: "0 20px 50px rgba(29,42,56,0.16)",
          },
        },
      },
    },
  });

// Default light theme
const theme = createAppTheme();

export default theme;
