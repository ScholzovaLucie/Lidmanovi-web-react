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
    <Box
      component={Paper}
      variant="outlined"
      sx={{
        borderRadius: borderRadius ?? 2,
        backgroundColor: "#fff",
        boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
        textAlign: "center",
        ...props,
      }}
    >
      {children}
    </Box>
  );
}
