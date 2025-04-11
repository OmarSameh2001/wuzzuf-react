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
  Alert,
  CircularProgress
} from "@mui/material";
import Multi from "../../../components/question/Multi";
import Boolean from "../../../components/question/Boolean";
import { createAnswer } from "../../../services/Answer";
import { userContext } from "../../../context/UserContext";
import { patchUser } from "../../../services/Auth";
import { patchApplication } from "../../../services/Application";

const ApplicationForm = ({ questions, answers: savedAnswers, application, refetch }) => {
  const location = useLocation();
  const { user , setUser} = useContext(userContext);
  const [answers, setAnswers] = useState(
    savedAnswers ? { ...savedAnswers } : {}
  );
  const [cv, setCv] = useState(user.cv || null);
  const [cvNew, setCvNew] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);

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
        setSubmitError("CV file size must be less than 5MB");
        return;
      }
      setSubmitError(null);
    }
    setCv(file);
    setCvNew(true);
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setSubmitError(null);

    try {
      if (Object.keys(answers).length > 0) {
        const output = Object.entries(answers).map(([key, value]) => ({
          answer_text: Array.isArray(value) ? JSON.stringify(value) : value,
          application: application.id,
          question: parseInt(key),
        }));
        const formData = { answers: output };
        await createAnswer(formData);
      }

      if (cvNew) {
        const cvForm = new FormData();
        if (!(cv instanceof File)) {
          throw new Error("Invalid CV file");
        }
        cvForm.append("cv", cv, cv.name); 
        await patchUser(user.id, cvForm);
        await patchApplication(application.id, { 'status': '2' });
        refetch();
      }
    } catch (error) {
      console.error("Submission error:", error);
      setSubmitError(error.response?.data?.message || "Failed to submit application. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };
  return (
    <Container
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
        backgroundColor: '#f8f9fa',
        padding: { xs: '1rem', md: '2rem' },
        borderRadius: '8px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        maxWidth: '800px',
        margin: '1rem auto'
      }}
    >
      <Typography 
        variant="h4" 
        sx={{ 
          color: "#901b20", 
          marginBottom: '1rem',
          fontSize: { xs: '1.5rem', md: '2rem' },
          textAlign: 'center'
        }}
      >
        Job Application Quiz
      </Typography>

      {parseInt(application?.status) > 1 && (
        <Alert severity="success" sx={{ width: '100%', mb: 2 }}>
          Your application has been successfully submitted!
        </Alert>
      )}

      {submitError && (
        <Alert severity="error" sx={{ width: '100%', mb: 2 }}>
          {submitError}
        </Alert>
      )}
      
      {questions?.map((question) => (
        <FormControl
          key={question.id}
          component="fieldset"
          margin="normal"
          fullWidth
          sx={{
            backgroundColor: 'white',
            padding: { xs: '0.75rem', md: '1rem' },
            borderRadius: '4px',
            borderLeft: `4px solid #901b20`,
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
          }}
        >
          <FormLabel 
            sx={{ 
              color: "#901b20", 
              fontWeight: 'bold',
              fontSize: { xs: '0.9rem', md: '1rem' }
            }}
          >
            {question.text}
            {question.required && <span style={{ color: "#ff0000" }}> *</span>}
          </FormLabel>

          {question.type === "Single Choice" && (
            <RadioGroup
              onChange={(e) => handleChange(question.QuestionID, e.target.value)}
              sx={{ mt: 1 }}
            >
              {question.options?.map((option, index) => (
                <FormControlLabel
                  key={index}
                  value={option}
                  control={<Radio sx={{ color: "#901b20 !important" }} />}
                  label={option}
                  sx={{ '& .MuiTypography-root': { fontSize: { xs: '0.9rem', md: '1rem' } } }}
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
              style={{ color: "#901b20" }}
            />
          )}
          {question.type === "boolean" && (
            <Boolean
              question={question}
              setValue={handleChange}
              answer={savedAnswers}
              value={answers}
              style={{ color: "#901b20" }}
            />
          )}
        </FormControl>
      ))}

      <FormControl 
        fullWidth 
        margin="normal" 
        sx={{ 
          backgroundColor: 'white', 
          padding: { xs: '0.75rem', md: '1rem' }, 
          borderRadius: '4px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
        }}
      >
        <FormLabel 
          sx={{ 
            color: "#901b20", 
            fontWeight: 'bold',
            fontSize: { xs: '0.9rem', md: '1rem' }
          }}
        >
          CV Upload
          {user?.cv && (
            <Button
              href={user.cv}
              target="_blank"
              rel="noopener noreferrer"
              sx={{
                color: "#901b20",
                textDecoration: "underline",
                marginLeft: "20px",
                fontSize: { xs: '0.8rem', md: '0.9rem' },
                textTransform: 'none',
                '&:hover': {
                  textDecoration: 'underline'
                }
              }}
            >
              View Current CV
            </Button>
          )}
        </FormLabel>
        <Box sx={{ 
          display: "flex", 
          alignItems: 'center', 
          marginTop: '0.5rem',
          flexDirection: { xs: 'column', sm: 'row' },
          gap: 1
        }}>
          <Button
            component="label"
            variant="outlined"
            disabled={application.status === '2'}
            sx={{
              color: "#901b20",
              borderColor: "#901b20",
              '&:hover': {
                borderColor: "#7a161b",
                backgroundColor: 'rgba(144, 27, 32, 0.04)'
              },
              fontSize: { xs: '0.8rem', md: '0.9rem' }
            }}
          >
            Upload New CV
            <input
              type="file"
              accept="application/pdf"
              onChange={handleCvChange}
              hidden
            />
          </Button>
          {cvNew && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Typography 
                variant="body2" 
                sx={{ 
                  color: "#901b20",
                  fontSize: { xs: '0.8rem', md: '0.9rem' }
                }}
              >
                {cv.name}
              </Typography>
              <Button 
                variant="outlined" 
                onClick={() => { setCv(null); setCvNew(false); }}
                sx={{ 
                  color: "#901b20", 
                  borderColor: "#901b20",
                  minWidth: 'unset',
                  padding: '4px 8px',
                  fontSize: { xs: '0.7rem', md: '0.8rem' },
                  '&:hover': {
                    borderColor: "#7a161b"
                  }
                }}
              >
                Remove
              </Button>
            </Box>
          )}
        </Box>
        <Typography 
          variant="caption" 
          sx={{ 
            display: 'block',
            mt: 1,
            color: 'text.secondary',
            fontSize: { xs: '0.7rem', md: '0.8rem' }
          }}
        >
          Maximum file size: 5MB (PDF only)
        </Typography>
      </FormControl>

      <Button
        variant="contained"
        disabled={
          questions?.some(
            (question) =>
              question.required && typeof answers[question.id] === "undefined"
          ) || !cv || application.status == '2'|| isSubmitting
        }
        onClick={handleSubmit}
        sx={{ 
          mt: 3,
          backgroundColor: "#901b20",
          '&:hover': {
            backgroundColor: "#7a161b",
          },
          '&:disabled': {
            backgroundColor: '#e0e0e0',
            color: '#a0a0a0'
          },
          padding: { xs: '8px 16px', md: '10px 24px' },
          fontSize: { xs: '0.9rem', md: '1rem' },
          minWidth: '200px',
          height: '48px'
        }}
      >
        {isSubmitting ? (
          <CircularProgress size={24} sx={{ color: 'white' }} />
        ) : (
          "Submit Application"
        )}
      </Button>
    </Container>
  );
};

export default ApplicationForm;