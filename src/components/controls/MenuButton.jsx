import React from "react";
import { Button, Menu, MenuItem } from "@mui/material";
import { ExpandMore as ExpandMoreIcon } from "@mui/icons-material";

export function MenuButton({ label, options, isActive, ...props }) {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <Button
        onClick={handleClick}
        variant={isActive ? "contained" : "text"}
        endIcon={<ExpandMoreIcon />}
        sx={{
          textTransform: "none",
          fontWeight: isActive ? 600 : 500,
          px: 2,
          py: 1
        }}
        {...props}
      >
        {label}
      </Button>
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          sx: { py: 0 }
        }}
      >
        {options.map((option) => (
          <MenuItem
            key={option.label || option.to}
            onClick={() => {
              if (option.onClick) option.onClick();
              handleClose();
            }}
            sx={{
              py: 1.5,
              px: 3,
              fontWeight: option.isActive ? 600 : 400,
              backgroundColor: option.isActive ? "primary.light" : "transparent",
              "&:hover": {
                backgroundColor: option.isActive ? "primary.main" : "action.hover"
              }
            }}
          >
            {option.label}
          </MenuItem>
        ))}
      </Menu>
    </>
  );
}