// Layout.jsx
import React from "react";
import { Outlet } from "react-router-dom";
import Box from "@mui/material/Box";
import Header from "./Header";
import { Seo } from "./Seo";
import Footer from "./Footer";

export default function Layout() {
  return (
    <Box>
      <Seo />
      <Header />
      {/* žádný Container kolem Outletu! */}
      <Box component="main">
        <Outlet />
      </Box>
      <Footer />
    </Box>
  );
}
