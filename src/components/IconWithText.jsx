import { Stack, Typography } from "@mui/material";

export default function IconWithText({
  Icon,
  iconProps,
  text,
  textProps,
  color,
}) {
  return (
    <Stack direction={"row"} spacing={1} alignItems={"center"}>
      <Icon sx={{ color: color || "primary.text" }} {...iconProps} />
      <Typography color={color || "primary.text"} {...textProps}>
        {text}
      </Typography>
    </Stack>
  );
}
