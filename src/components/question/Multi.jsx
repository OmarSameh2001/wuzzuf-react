import { Box, Checkbox, FormControlLabel, Typography, useMediaQuery, useTheme } from "@mui/material";
import { userContext } from "../../context/UserContext";
import { useContext } from "react";



function Multi({ question, handleMultiChange, answer, value, disabled }) {
    const { isLight } = useContext(userContext)
    const theme = useTheme()
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"))
    const filteredAnswer = answer.filter((item) => item.question === question.id);
    const selectedOptions = JSON.parse(filteredAnswer[0]?.answer_text || '[]');
    const isDisabled = disabled || filteredAnswer.length > 0;
    const primaryColor = "#e53946"
  const backgroundColor = isLight ? "#ffffff" : "#121212"
  const disabledBg = isLight ? "#f0f0f0" : "#2a2a2a"
  const textColor = isLight ? "#2d3748" : "#e2e8f0"
    return (
        <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 1,
          width: "100%",
          mt: 1,
        }}
      >
        {question.choices?.map((option, index) => (
          <FormControlLabel
            sx={{
              backgroundColor: isDisabled ? disabledBg : "transparent",
              padding: "10px",
              borderRadius: "8px",
              width: "100%",
              margin: 0,
              transition: "all 0.2s ease",
              "&:hover": {
                backgroundColor: isDisabled ? disabledBg : isLight ? "#f7f7f7" : "#1e1e1e",
              },
              "& .MuiFormControlLabel-label": {
                color: textColor,
              },
            }}
            disabled={isDisabled}
            key={index}
            control={
              <Checkbox
                checked={selectedOptions.includes(option) || value[question.id]?.includes(option) || false}
                onChange={() => handleMultiChange(question.id, option)}
                sx={{
                  color: isLight ? "#a0a0a0" : "#fff",
                  "&.Mui-checked": {
                    color: primaryColor,
                  },
                  "&.Mui-disabled": {
                    color: isLight ? "#c0c0c0" : "#121212",
                  },
                }}
              />
            }
            label={<Typography color={isLight ? "#2d3748" : "#e2e8f0"}>{option}</Typography>}
          />
        ))}
      </Box>
    );
}

export default Multi;
