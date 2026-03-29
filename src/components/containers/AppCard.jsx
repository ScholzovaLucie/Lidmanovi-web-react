import { Box, Container, Paper, Stack } from "@mui/material";

export default function AppCard({ children }) {
  return (
    <Stack
      component={Paper}
      variant="outlined"
      sx={{
        p: { xs: 2, md: 3 },
        borderRadius: 2,
        boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
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
        borderRadius: borderRadius ?? 1,
        backgroundColor: "background.paper",
        boxShadow: (theme) =>
          `0 1px 4px ${theme.palette.mode === "light" ? "rgba(0,0,0,0.04)" : "rgba(0,0,0,0.2)"}`,
        textAlign: "center",
        ...props,
      }}
    >
      {children}
    </Stack>
  );
}
