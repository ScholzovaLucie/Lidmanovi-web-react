import { Menu } from "@mui/material";
import React, { cloneElement, useState } from "react";

export default function MenuDecorator({ children, menuContent }) {
  const [anchorEl, setAnchorEl] = useState(null);

  const openMenu = (e) => setAnchorEl(e.currentTarget);
  const closeMenu = () => setAnchorEl(null);

  const child = cloneElement(children, {
    onClick: openMenu,
  });

  return (
    <>
      {child}
      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={closeMenu}>
       {menuContent}
      </Menu>
    </>
  );
}
