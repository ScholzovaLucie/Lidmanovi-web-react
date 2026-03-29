import { TextField, InputAdornment, IconButton } from "@mui/material";
import { Add, Remove } from "@mui/icons-material";

export default function SpinnerField({
  label,
  value,
  onChange,
  min = 0,
  required,
  fullWidth,
}) {
  const numValue = parseInt(value) || min;

  const decrement = () => onChange(Math.max(min, numValue - 1));
  const increment = () => onChange(numValue + 1);

  return (
    <TextField
      label={label}
      value={numValue}
      onChange={(e) => onChange(Math.max(min, parseInt(e.target.value) || min))}
      fullWidth={fullWidth}
      required={required}
      slotProps={{
        input: {
          min,
          startAdornment: (
            <InputAdornment position="start">
              <IconButton size="small" onClick={decrement}>
                <Remove fontSize="small" />
              </IconButton>
            </InputAdornment>
          ),
          endAdornment: (
            <InputAdornment position="end">
              <IconButton size="small" onClick={increment}>
                <Add fontSize="small" />
              </IconButton>
            </InputAdornment>
          ),
        },
        htmlInput: {
          style: { textAlign: "center" },
        },
      }}
    />
  );
}
