import { useTheme } from "@mui/material/styles";
import { Box, Button, Typography } from "@mui/material";
import { userContext } from "../../context/UserContext";
import { useContext } from "react";
import { useNavigate } from "react-router";

export default function NotFound() {
  const { isLight } = useContext(userContext);
  const theme = useTheme();
  const navigate = useNavigate();

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        flexDirection: "column",
        alignItems: "center",
        minHeight: "80vh",
        minWidth: "100vw",
        backgroundColor: isLight
          ? theme.palette.grey[100]
          : theme.palette.grey[900],
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
      <Typography
        variant="h4"
        sx={{
          color: "#882024",
        }}
      >
        404 - Page Not Found
      </Typography>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mt: 2,
        }}
      >
        <Button
          variant="contained"
          sx={{
            backgroundColor: "#882024",
            "&:hover": {
              backgroundColor: "#882024",
            },
          }}
          onClick={handleBack}
        >
          Go Back
        </Button>
        <Button
          variant="outlined"
          sx={{
            backgroundColor: "transparent",
            borderColor: "#882024",
            color: "#882024",
            "&:hover": {
              backgroundColor: "#88202410",
            },
          }}
          onClick={() => navigate("/")}
        >
          Go Home
        </Button>
      </Box>
    </Box>
  );
}
