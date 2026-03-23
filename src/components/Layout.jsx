// Layout.jsx
import React from "react";
import { Outlet } from "react-router-dom";
import Box from "@mui/material/Box";
import Header from "./Header";
import { Seo } from "./Seo";
import Footer from "./Footer";

export default function Layout() {
  return (
    <Box sx={{ 
      display: 'flex', 
      flexDirection: 'column', 
      minHeight: '100vh' 
    }}>
      <Seo />
      <Header />
      <Box 
        component="main" 
        sx={{ 
          flex: 1,
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        <Outlet />
      </Box>
      <Footer />
    </Box>
  );
}
