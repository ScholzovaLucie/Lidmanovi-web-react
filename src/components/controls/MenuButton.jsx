import React from "react";
import { Button, Menu, MenuItem, Typography } from "@mui/material";
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
        variant="text"
        endIcon={<ExpandMoreIcon />}
        sx={{
          px: 1.1,
          py: 0.7,
          color: isActive ? "primary.main" : "text.primary",
          borderRadius: 1.5,
          "& .MuiButton-endIcon": {
            marginLeft: 0.5,
          },
        }}
        {...props}
      >
        <Typography
          component="span"
          sx={{
            fontSize: "0.72rem",
            fontWeight: isActive ? 500 : 400,
            letterSpacing: "0.14em",
            textTransform: "uppercase",
          }}
        >
          {label}
        </Typography>
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
              fontSize: "0.75rem",
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              fontWeight: option.isActive ? 500 : 400,
              backgroundColor: option.isActive ? "rgba(85,116,143,0.08)" : "transparent",
              "&:hover": {
                backgroundColor: option.isActive ? "rgba(85,116,143,0.12)" : "action.hover"
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
