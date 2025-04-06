import { Checkbox, FormControlLabel } from "@mui/material";

function Multi({ question, handleMultiChange, answer, value }) {
    const filteredAnswer = answer.filter((item) => item.question === question.id);
    const selectedOptions = JSON.parse(filteredAnswer[0]?.answer_text || '[]');
    const isDisabled = filteredAnswer.length > 0;

    return (
        <>
            {question.choices?.map((option, index) => (
                <FormControlLabel
                    sx={{
                        backgroundColor: isDisabled ? "#f0f0f0" : "transparent",
                        padding: "10px",
                        borderRadius: "5px",
                    }}
                    disabled={isDisabled}
                    key={index}
                    control={
                        <Checkbox
                            checked={selectedOptions.includes(option) || value[question.id]?.includes(option) || false}
                            onChange={() => handleMultiChange(question.id, option)}
                        />
                    }
                    label={option}
                />
            ))}
        </>
    );
}

export default Multi;
