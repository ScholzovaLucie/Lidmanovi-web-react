import { createTheme } from "@mui/material/styles";

// Function to create theme based on mode
export const createAppTheme = (mode) => createTheme({
  palette: {
    mode,
    primary: { main: "#4b6b85" }, // tmavá z hlavičky/odkazů (případně upravíme)
    secondary: { main: "#9eb5c9" }, // viz přechody v původním CSS
    
    // Success colors (green)
    success: { 
      main: "#81c784", 
      light: "#c8e6c9", 
      dark: "#388e3c" 
    },
    
    // Warning colors (orange)
    warning: { 
      main: "#ffb74d", 
      light: "#fff3c4", 
      dark: "#f57c00" 
    },
    
    // Error colors (red)
    error: { 
      main: "#e57373", 
      light: "#ffcdd2", 
      dark: "#d32f2f" 
    },
    
    // Info colors (blue)
    info: { 
      main: "#7986cb", 
      light: "#e3f2fd", 
      dark: "#303f9f" 
    },
    
    text: mode === 'light' ? { 
      primary: "#1a1a1a", // velmi tmavě šedá
      secondary: "#4a4a4a", // světlejší šedá
      tertiary: "#6a6a6a", // středně světlá šedá
      quaternary: "#8a8a8a", // světlá šedá
      disabled: "#b0b0b0", // nejsvětlejší šedá pro disabled stavy
      // Additional text colors
      muted: "#525252", // pro description text
      dark: "#213547", // pro nadpisy v AdminPage
      darker: "#243244", // pro tmavší nadpisy
    } : {
      primary: "#ffffff", // bílá pro dark mode
      secondary: "#e0e0e0", // světle šedá pro dark mode
      tertiary: "#b0b0b0", // středně šedá pro dark mode
      quaternary: "#808080", // tmavší šedá pro dark mode
      disabled: "#606060", // nejtmavší šedá pro disabled stavy
      // Additional text colors for dark mode
      muted: "#a0a0a0", // pro description text v dark mode
      dark: "#e0e0e0", // pro nadpisy v AdminPage v dark mode
      darker: "#f0f0f0", // pro tmavší nadpisy v dark mode
    },
    
    background: mode === 'light' ? 
      { 
        default: "#fff", 
        paper: "#fff",
        // Additional backgrounds
        light: "#f6fbff", // světle modrá pro highlighted areas
        card: "#ffffff", // pro karty
        overlay: "rgba(0,0,0,0.3)", // pro overlay/modal backgrounds
      } : 
      { 
        default: "#121212", 
        paper: "#1e1e1e",
        // Additional backgrounds for dark mode
        light: "#2a2a2a", // tmavší varianta pro highlighted areas
        card: "#2c2c2c", // pro karty v dark mode
        overlay: "rgba(255,255,255,0.1)", // pro overlay/modal backgrounds v dark mode
      },
      
    // Divider colors
    divider: mode === 'light' ? "#eee" : "#424242",
    
    // Action colors (for MUI components)
    action: mode === 'light' ? {
      hover: "rgba(0, 0, 0, 0.04)",
      selected: "rgba(0, 0, 0, 0.08)",
      disabled: "rgba(0, 0, 0, 0.26)",
      disabledBackground: "rgba(0, 0, 0, 0.12)",
    } : {
      hover: "rgba(255, 255, 255, 0.08)",
      selected: "rgba(255, 255, 255, 0.12)",
      disabled: "rgba(255, 255, 255, 0.3)",
      disabledBackground: "rgba(255, 255, 255, 0.12)",
    },
    
    // Event colors for calendar
    event: {
      colors: [
        "#4b6b85", // primary
        "#e57373", // red
        "#81c784", // green  
        "#ffb74d", // orange
        "#7986cb", // blue
        "#4dd0e1", // cyan
        "#ba68c8", // purple
        "#a1887f", // brown
      ]
    },
  },
  typography: {
    fontFamily: `"Plus Jakarta Sans", "Inter", system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif`,
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
      styleOverrides: {
        root: {
          textTransform: "none",
        },
      },
    },
  },
});

// Default light theme
const theme = createAppTheme('light');

export default theme;
