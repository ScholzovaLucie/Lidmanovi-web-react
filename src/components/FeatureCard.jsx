import React from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardActionArea from "@mui/material/CardActionArea";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";

export default function FeatureCard({ title, text, image, onClick }) {
  return (
    <Card
      elevation={0}
      sx={{ border: "1px solid #eaeaea", borderRadius: 2, height: "100%" }}
    >
      <CardActionArea onClick={onClick} sx={{ height: "100%" }}>
        {image && (
          <Box
            sx={{
              aspectRatio: "16/9",
              backgroundImage: `url(${image})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          />
        )}
        <CardContent sx={{ p: 2 }}>
          <Typography variant="h6" sx={{ mb: 1, fontWeight: 700 }}>
            {title}
          </Typography>
          {text && (
            <Typography variant="body2" color="text.secondary">
              {text}
            </Typography>
          )}
        </CardContent>
      </CardActionArea>
    </Card>
  );
}
