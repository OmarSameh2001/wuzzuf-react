import { FormControlLabel, Radio, RadioGroup, Typography } from "@mui/material";

function Boolean({ question, setValue, answer, value }) {
  const filteredAnswer = answer.filter((item) => item.question === question.id);
  const isDisabled = filteredAnswer.length > 0;
  console.log(value)
  return (
    <>
      <RadioGroup
        value={filteredAnswer.length > 0 ? filteredAnswer[0].answer_text : value[question.id] || ""}
        onChange={(e) => setValue(question.id, e.target.value)}
        disabled={isDisabled}
        sx={{
          backgroundColor: isDisabled ? "#f0f0f0" : "transparent",
          padding: "10px",
          borderRadius: "5px",
        }}
      >
        <FormControlLabel value="true" control={<Radio disabled={isDisabled} />} label="Yes" />
        <FormControlLabel value="false" control={<Radio disabled={isDisabled} />} label="No" />
      </RadioGroup>
    </>
  );
}

export default Boolean;
