import React from "react";
import { Card, CardContent, CardActions } from "@mui/material";
import { Button, Avatar, Typography } from "@mui/material";

const TalentCard = ({ img, name, description }) => {
  return (
    <Card sx={{ width: "50%", boxShadow: 3, borderRadius: 2, display: "flex", alignItems: "center" }} className="my-2">
      
      <Avatar src={img} alt={name} sx={{ width: 80, height: 80, ml: 2 }} loading="lazy" />
      <CardContent sx={{ display: "flex", flexDirection: "column" }}>
        <Typography variant="h6" fontWeight={600}>
          {name}
        </Typography>
        <Typography
          variant="subtitle2"
          color="text.secondary"
          sx={{
            display: "-webkit-box",
            overflow: "hidden",
            WebkitBoxOrient: "vertical",
            WebkitLineClamp: 2,
          }}
        >
          {description}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default TalentCard;