import React from "react";
import { Card, CardContent, CardActions } from "@mui/material";
import { Button, Avatar, Typography } from "@mui/material";

const TalentCard = ({ img, name, education }) => {
  return (
    <div className="bg-white shadow-md rounded-lg p-4 text-center">
      <img
        src={img}
        alt={name}
        className="w-24 h-24 mx-auto rounded-full object-cover"
      />
      <h2 className="text-xl font-semibold mt-3">{name}</h2>
      <p className="text-gray-600 mt-2">{education}</p>
    </div>
  );
};

export default TalentCard;
