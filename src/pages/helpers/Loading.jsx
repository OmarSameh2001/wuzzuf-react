import { CircularProgress, LinearProgress, Typography } from "@mui/material";
import { userContext } from "../../context/UserContext";
import { useContext } from "react";

const Loading = ({minHeight, minWidth}) => {
  const { isLight } = useContext(userContext);
  return (
    <div
      style={{
        minHeight: minHeight || "70vh",
        minWidth: minWidth || '100vw',
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
        gap: "5px",
        backgroundColor: isLight ? "#fff" : "#242424",
      }}
    >
      <Typography
        variant="h3"
        sx={{
          fontWeight: 700,
          color: "#882024",
          letterSpacing: "-0.5px",
        }}
      >
        HireGenius AI
      </Typography>
      <CircularProgress sx={{ color: "#882024", scale: "1" }} />
    </div>
  );
};

export default Loading;
