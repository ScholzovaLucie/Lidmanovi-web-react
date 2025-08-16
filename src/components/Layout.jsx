// Layout.jsx
import React from "react";
import { Outlet } from "react-router-dom";
import Box from "@mui/material/Box";
import Header from "./Header";

export default function Layout() {
  return (
    <Box>
      <Header />
      {/* žádný Container kolem Outletu! */}
      <Box component="main">
        <Outlet />
      </Box>

      <Box
        component="footer"
        sx={{
          borderTop: "1px solid #eee",
          py: 2,
          textAlign: "center",
          color: "text.secondary",
        }}
      >
        © {new Date().getFullYear()} Lidmanovi
      </Box>
    </Box>
  );
}
