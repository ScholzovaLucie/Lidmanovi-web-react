// Layout.jsx
import React from "react";
import { Outlet } from "react-router-dom";
import Box from "@mui/material/Box";
import Header from "./Header";
import { Seo } from "./Seo";
import Footer from "./Footer";
import InlineEditClickGuard from "./InlineEditClickGuard.jsx";

export default function Layout() {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        minHeight: "100dvh",
      }}
    >
        <InlineEditClickGuard>
          <Seo />
          <Header />
          <Box
            component="main"
            sx={{
              flex: 1,
              minHeight: 0,
              display: "flex",
              flexDirection: "column",
            }}
          >
            <Outlet />
          </Box>
          <Footer />
        </InlineEditClickGuard>
    </Box>
  );
}
