import { Button, Stack, Typography } from "@mui/material";
import { useState } from "react";

export default function CollapsableText({ text }) {
  const [expanded, setExpanded] = useState(false);
  const toggleExpanded = () => setExpanded((prev) => !prev);

  return (
    <Stack spacing={1} alignItems={"center"}>
      <Typography
        fontSize={16}
        color={"text.secondary"}
        lineHeight="24px"
        textAlign={"start"}
        sx={{
          display: "-webkit-box",
          WebkitLineClamp: expanded ? "none" : 4,
          WebkitBoxOrient: "vertical",
          overflow: "hidden",
        }}
      >
        {text}
      </Typography>
      <Button onClick={toggleExpanded} size="small">
        {expanded ? "Zobrazit méně" : "Zobrazit více"}
      </Button>
    </Stack>
  );
}
