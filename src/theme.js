import { createTheme } from "@mui/material/styles";

// Function to create theme based on mode
export const createAppTheme = () =>
  createTheme({
    palette: {
      mode: "light",
      background: {
        default: "#f4efe6",
        paper: "#fffdf8",
      },
      text: {
        primary: "#2d2823",
        secondary: "#74695d",
      },
      primary: {
        main: "#446783",
        light: "#e8f0f6",
        dark: "#2f4f6c",
        contrastText: "#ffffff",
        50: "#edf4f8",
        100: "#dce9f1",
      },
      secondary: {
        main: "#a28d6f",
        light: "#eee5d7",
        dark: "#786246",
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
        fontSize: "clamp(48px, 7vw, 92px)",
        fontWeight: 400,
        lineHeight: 1.02,
        letterSpacing: 0,
      },
      h2: {
        fontFamily: `"Cormorant Garamond", Georgia, serif`,
        fontSize: "clamp(38px, 4.4vw, 54px)",
        fontWeight: 400,
        lineHeight: 1.05,
        marginBottom: 12,
        letterSpacing: 0,
      },
      h3: {
        fontFamily: `"Cormorant Garamond", Georgia, serif`,
        fontSize: "clamp(28px, 3vw, 38px)",
        fontWeight: 400,
        lineHeight: 1.12,
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
    shape: { borderRadius: 2 },
    components: {
      MuiCssBaseline: {
        styleOverrides: {
          body: {
            backgroundColor: "#f4efe6",
            backgroundImage: "none",
          },
          "::selection": {
            backgroundColor: "rgba(68,103,131,0.2)",
          },
        },
      },
      MuiAppBar: {
        styleOverrides: {
          root: {
            backdropFilter: "none",
            backgroundColor: "#fffaf0",
            backgroundImage: "none",
            borderBottom: "1px solid #dfd4c4",
          },
        },
      },
      MuiButton: {
        defaultProps: { disableElevation: true },
        styleOverrides: {
          root: {
            textTransform: "none",
            borderRadius: 0,
            paddingInline: 16,
            paddingBlock: 9,
            fontWeight: 700,
            letterSpacing: 0,
          },
          contained: {
            boxShadow: "none",
          },
          outlined: {
            borderWidth: 1,
          },
          text: {
            borderRadius: 0,
          },
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: {
            backgroundImage: "none",
          },
          rounded: {
            borderRadius: 2,
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
            borderRadius: 2,
            border: "1px solid #dfd4c4",
            boxShadow: "0 18px 45px rgba(45,40,35,0.14)",
          },
        },
      },
      MuiOutlinedInput: {
        styleOverrides: {
          root: {
            borderRadius: 2,
            backgroundColor: "#fffdf8",
          },
          notchedOutline: {
            borderColor: "#d8cbb8",
          },
        },
      },
      MuiTableCell: {
        styleOverrides: {
          root: {
            borderBottomColor: "#e2d7c8",
          },
          head: {
            color: "#928675",
            fontSize: "0.68rem",
            fontWeight: 700,
            letterSpacing: "0.16em",
            textTransform: "uppercase",
          },
        },
      },
    },
  });

// Default light theme
const theme = createAppTheme();

export default theme;
