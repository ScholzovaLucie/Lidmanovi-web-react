import { Button, Menu, MenuItem, TextField } from "@mui/material";
import { useState } from "react";

export function SelectButton({ label, options, customContent, ...props }) {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <Button onClick={handleClick} {...props}>
        {label}
      </Button>
      <Menu anchorEl={anchorEl} open={open} onClose={() => handleClose()}>
        {options &&
          options.map(({ label, onClick }) => (
            <MenuItem
              key={label}
              onClick={() => {
                onClick();
                handleClose();
              }}
            >
              {label}
            </MenuItem>
          ))}
        {customContent}
      </Menu>
    </>
  );
}
