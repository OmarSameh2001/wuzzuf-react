import React, { useState, useEffect, useContext } from "react";
import { useLocation } from "react-router-dom";
import {
  Container,
  Typography,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  Checkbox,
  TextField,
  Button,
  Input,
} from "@mui/material";
import Multi from "../../../components/question/Multi";
import Boolean from "../../../components/question/Boolean";
import { createAnswer } from "../../../services/Answer";
import { userContext } from "../../../context/UserContext";
import { patchUser } from "../../../services/Auth";
import { patchApplication } from "../../../services/Application";
const ApplicationForm = ({ questions, answers: savedAnswers, application, refetch }) => {
  const location = useLocation();
  const { user } = useContext(userContext);
  const [answers, setAnswers] = useState(
    savedAnswers ? { ...savedAnswers } : {}
  );
  const [cv, setCv] = useState(user.cv || null);
  const [cvNew, setCvNew] = useState(false);

  console.log("Questions data received:", questions);
  // const savedQuestionIds = Object.keys(savedAnswers).map(questionId => Number(questionId));
  // console.log("Saved Question IDs:", savedQuestionIds);

  const handleChange = (questionId, value) => {
    setAnswers((prev) => ({ ...prev, [questionId]: value }));
  };

  const handleMultiChange = (questionId, option) => {
    setAnswers((prev) => {
      const currentAnswers = prev[questionId] || [];
      return {
        ...prev,
        [questionId]: currentAnswers.includes(option)
          ? currentAnswers.filter((item) => item !== option)
          : [...currentAnswers, option],
      };
    });
  };

  const handleCvChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert("Cv File size must be less than 1MB");
        return;
      }
    }
    setCv(file);
    setCvNew(true);
  };

  // submit multi value
  const handleSubmit = async () => {
    if (Object.keys(answers).length > 0) {
      const output = Object.entries(answers).map(([key, value]) => ({
        answer_text: Array.isArray(value) ? JSON.stringify(value) : value,
        application: application.id,
        question: parseInt(key),
      }));
      const formData = { answers: output };
      const res = await createAnswer(formData);
      console.log("Submitted Answers:", res);
    }

    if (cvNew) {
      const cvForm = new FormData();
      if (!(cv instanceof File)) {
        console.error("cv is not a valid File object:", cv);
        return;
    }
    cvForm.append("cv", cv, cv.name); 
    try {
        const cvRes = await patchUser(user.id, cvForm);
        console.log("CV Upload Response:", cvRes);
        await patchApplication(application.id,{'status': '2'})
        refetch()
    } catch (error) {
        console.error("Error uploading CV:", error.response?.data || error);
    }
    }
  };

  return (
    <Container
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
      }}
    >
      <Typography variant="h4">
        Job Application Quiz
      </Typography>
      {parseInt(application?.status) > 1 && <Typography color="green" variant="h6" gutterBottom>
        Your application is submitted
      </Typography>}
      {questions?.map((question) => (
        <FormControl
          key={question.id}
          component="fieldset"
          margin="normal"
          fullWidth
        >
          <FormLabel>
            {question.text}
            {question.required && <span style={{ color: "red" }}> *</span>}
          </FormLabel>

          {question.type === "Single Choice" && (
            <RadioGroup
              onChange={(e) =>
                handleChange(question.QuestionID, e.target.value)
              }
            >
              {question.options?.map((option, index) => (
                <FormControlLabel
                  key={index}
                  value={option}
                  control={<Radio />}
                  label={option}
                />
              ))}
            </RadioGroup>
          )}

          {question.type === "multichoice" && (
            <Multi
              question={question}
              handleMultiChange={handleMultiChange}
              answer={savedAnswers}
              value={answers}
            />
          )}
          {question.type === "boolean" && (
            <Boolean
              question={question}
              setValue={handleChange}
              answer={savedAnswers}
              value={answers}
            />
          )}
        </FormControl>
      ))}

      <FormControl>
        <FormLabel>
          CV{" "}
          {user?.cv && (
            <a
              href={user.cv}
              target="_blank"
              style={{
                textDecoration: "underline",
                marginLeft: "20px",
                cursor: "pointer",
              }}
            >
              Old Cv
            </a>
          )}
        </FormLabel>
        <div style={{ display: "flex" }}>
          <input
            type="file"
            accept="application/pdf"
            onChange={handleCvChange}
            disabled={application.status == '2'}
          />
          {cvNew && <button className="btn btn-danger p-0 px-1">X</button>}
        </div>
      </FormControl>

      <Button
        variant="contained"
        color="primary"
        sx={{ mt: 3 }}
        onClick={handleSubmit}
        disabled={
          questions?.some(
            (question) =>
              question.required && typeof answers[question.id] === "undefined"
          ) || !cv || application.status == '2'
        }
      >
        Submit
      </Button>
    </Container>
  );
};

export default ApplicationForm;
