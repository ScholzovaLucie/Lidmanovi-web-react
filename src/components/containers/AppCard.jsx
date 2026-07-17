import { Box, Container, Paper, Stack } from "@mui/material";

export default function AppCard({ children }) {
  return (
    <Stack
      component={Paper}
      variant="outlined"
      sx={{
        p: { xs: 2, md: 3 },
        borderRadius: 0.25,
        borderColor: "#dfd4c4",
        backgroundColor: "background.paper",
        boxShadow: "0 8px 24px rgba(45,40,35,0.06)",
        textAlign: "center",
        width: "fit-content",
      }}
    >
      {children}
    </Stack>
  );
}

export function AppCardCustomizable({ borderRadius, props, children }) {
  return (
    <Stack
      component={Paper}
      variant="outlined"
      sx={{
        borderRadius: borderRadius ?? 0.25,
        backgroundColor: "background.paper",
        borderColor: "#dfd4c4",
        boxShadow: (theme) =>
          `0 8px 24px ${theme.palette.mode === "light" ? "rgba(45,40,35,0.05)" : "rgba(0,0,0,0.2)"}`,
        textAlign: "center",
        ...props,
      }}
    >
      {children}
    </Stack>
  );
}
