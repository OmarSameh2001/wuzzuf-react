import { FormControlLabel, Radio, RadioGroup, Typography } from "@mui/material";
import { userContext } from "../../context/UserContext";
import { useContext } from "react";

function Boolean({ question, setValue, answer, value, disabled }) {
  const filteredAnswer = answer.filter((item) => item.question === question.id);
  const isDisabled = disabled || filteredAnswer.length > 0;
  const { isLight } = useContext(userContext);
  
  const disabledBg = isLight ? "#f0f0f0" : "#2a2a2a"
  return (
    <>
      <RadioGroup
        value={filteredAnswer.length > 0 ? filteredAnswer[0].answer_text : value[question.id] || ""}
        onChange={(e) => setValue(question.id, e.target.value)}
        disabled={isDisabled}
        sx={{
          backgroundColor: isDisabled ? disabledBg : "transparent",
          padding: "10px",
          borderRadius: "5px",
          color: isLight ? "#2d3748" : "#fff",
        }}
      >
        <FormControlLabel value="true" control={<Radio disabled={isDisabled} />} label={<Typography color={isLight ? "#2d3748" : "#e2e8f0"}>Yes</Typography>} />
        <FormControlLabel value="false" control={<Radio disabled={isDisabled} />} label={<Typography color={isLight ? "#2d3748" : "#e2e8f0"}>No</Typography>}  />
      </RadioGroup>
    </>
  );
}

export default Boolean;
