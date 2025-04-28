import React, { useState, useContext } from "react";
import { useLocation } from "react-router-dom";
import {
    Container,
    Typography,
    FormControl,
    FormLabel,
    RadioGroup,
    FormControlLabel,
    Radio,
    Button,
    Paper,
    Alert,
    Box,
    useTheme,
    useMediaQuery,
    CircularProgress,
} from "@mui/material"
import { Upload, FileText, Check, AlertCircle } from "lucide-react"
import Multi from "../../../components/question/Multi";
import Boolean from "../../../components/question/Boolean";
import { createAnswer } from "../../../services/Answer";
import { userContext } from "../../../context/UserContext";
import { patchUser } from "../../../services/Auth";
import { patchApplication } from "../../../services/Application";
import { showErrorToast, showSuccessToast } from "../../../confirmAlert/toastConfirm";
import '../../../styles/theme.css';
import '../../../ComponentsStyles/application_form.css';
const ApplicationForm = ({ questions, answers: savedAnswers, application, refetch }) => {
  const location = useLocation();
  const theme = useTheme();
  const { user, setUser, isLight } = useContext(userContext);
  const [answers, setAnswers] = useState(
    savedAnswers ? { ...savedAnswers } : {}
  );
  const [cv, setCv] = useState(user.cv || null);
  const [cvNew, setCvNew] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false)
  // console.log("Questions data received:", questions);
  console.log("Saved Answers:", answers);
  const isMobile = useMediaQuery("(max-width: 768px)");
  const primaryColor = "#e53946"
  const backgroundColor = isLight ? "#ffffff" : "#121212"
  const textColor = isLight ? "#2d3748" : "#e2e8f0"
  const borderColor = isLight ? "#e3cdcd" : "#2d3748"
  const cardBackground = isLight ? "#ffffff" : "#1e1e1e"
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
        showErrorToast("Cv File size must be less than 1MB");
        return;
      }
    }
    setCv(file);
    setCvNew(true);
  };

  // submit multi value
  const handleSubmit = async () => {
    try{
      setIsSubmitting(true)

      if (cvNew) {
        const cvForm = new FormData();
        if (!(cv instanceof File)) {
          console.error("cv is not a valid File object:", cv);
          showErrorToast("cv is not a valid File object");
          setIsSubmitting(false)
          return;
      }
    cvForm.append("cv", cv, cv.name); 
    try {
        const cvRes = await patchUser(user.id, cvForm);
        if(!cvRes) {
          console.error("CV upload failed:", cvRes);
          showErrorToast("CV upload failed");
          setIsSubmitting(false)
          return;
        }
        setUser(cvRes)
        console.log("CV Upload Response:", cvRes);
        await patchApplication(application.id,{'status': '2'})
        refetch()
    } catch (error) {
        console.error("Error uploading CV:", error.response?.data || error);
        return;
    }
    }else if (user.cv) {
      await patchApplication(application.id,{'status': '2'})
      showSuccessToast("Application submitted successfully");
      refetch()
    }
    if (Object.keys(answers).length > 0) {
      const output = Object.entries(answers).map(([key, value]) => ({
        answer_text: Array.isArray(value) ? JSON.stringify(value) : value,
        application: application.id,
        question: parseInt(key),
      }));
      const formData = { answers: output };
      const res = await createAnswer(formData);
      console.log("Submitted Answers:", res);
      showSuccessToast("Application submitted successfully");
      setIsSubmitting(false)
    }} catch (error) {
      console.error("Error submitting answers:", error.response?.data || error);
      setIsSubmitting(false)
    }
  };


  const isFormDisabled =
  questions?.some((question) => question.required && typeof answers[question.id] === "undefined") ||
  !cv ||
  Number.parseInt(application.status) > 1 ||
  application.job_details.status === "0"


  return (

    <Container className="application-form-container">
    <Paper className="application-form-paper" style={{background: isLight ? '#fff' : '#242424'}}>
      <Typography variant="h4" className="form-title" style={{color: isLight ? '#242424' : '#fff'}}>
        Job Application
      </Typography>

      {application.fail ? (
        <Alert
          severity="error"
          className="application-alert"
          sx={{
            borderRadius: "8px",
            backgroundColor: isLight ? "#fde8e8" : "#3b1a1a",
            color: isLight ? "#e02424" : "#f8b4b4",
            border: isLight ? "1px solid #fbd5d5" : "1px solid #3b1a1a",
          }}
        >
          <AlertCircle size={20} className="alert-icon" />
          <Typography>Unfortunately, you have failed this phase</Typography>
        </Alert>
      ) : Number.parseInt(application?.status) > 1 ? (
        <>
          <Alert
            severity="success"
            className="application-alert"
            sx={{
              borderRadius: "8px",
              backgroundColor: isLight ? "#def7ec" : "#1a3b2c",
              color: isLight ? "#057a55" : "#84e1bc",
              border: isLight ? "1px solid #bcf0da" : "1px solid #1a3b2c",
            }}
          >
            <Check size={20} className="alert-icon" />
            <Typography>Your application has been submitted successfully</Typography>
          </Alert>
          <Alert
            severity="info"
            className="application-alert"
            sx={{
              borderRadius: "8px",
              backgroundColor: isLight ? "#e1effe" : "#1e3a5f",
              color: isLight ? "#1e40af" : "#93c5fd",
              border: isLight ? "1px solid #c3ddfd" : "1px solid #1e3a5f",
              mt: 2,
            }}
          >
            <Typography>Please check the next phases for updates</Typography>
          </Alert>
        </>
      ) : (
        <>
          <div className="questions-container">
            {questions?.map((question) => (
              <FormControl
                key={question.id}
                component="fieldset"
                className="question-control"
                sx={{
                  mb: 3,
                  width: "100%",
                }}
              >
                <FormLabel
                  className="question-label"
                  sx={{
                    color: textColor,
                    mb: 1,
                    fontWeight: 500,
                  }}
                >
                  {question.text}
                  {question.required && <span className="required-mark">*</span>}
                </FormLabel>

                {question.type === "Single Choice" && (
                  <RadioGroup
                    onChange={(e) => handleChange(question.QuestionID, e.target.value)}
                    className="radio-group"
                  >
                    {question.options?.map((option, index) => (
                      <FormControlLabel
                        key={index}
                        value={option}
                        control={
                          <Radio
                            sx={{
                              color: isLight ? "#a0a0a0" : "#6c6c6c",
                              "&.Mui-checked": {
                                color: primaryColor,
                              },
                            }}
                          />
                        }
                        label={option}
                        className="radio-option"
                        sx={{
                          color: textColor,
                          mb: 0.5,
                        }}
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
                  <Boolean question={question} setValue={handleChange} answer={savedAnswers} value={answers} />
                )}
              </FormControl>
            ))}
          </div>

          <div className="cv-section">
            <FormControl
              className="cv-control"
              sx={{
                width: "100%",
                mb: 3,
              }}
            >
              <FormLabel
                className="cv-label"
                sx={{
                  color: textColor,
                  mb: 1,
                  fontWeight: 500,
                }}
              >
                CV Upload <span className="required-mark">*</span>
              </FormLabel>

              <Box
                className="cv-options"
                sx={{
                  display: "flex",
                  flexDirection: isMobile ? "column" : "row",
                  alignItems: isMobile ? "flex-start" : "center",
                  gap: 2,
                  mt: 1,
                }}
              >
                {user?.cv && (
                  <a
                    href={user.cv.endsWith("pdf") ? user.cv : user.cv + ".pdf"}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="view-cv-link"
                    style={{
                      color: primaryColor,
                      textDecoration: "none",
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                      padding: "8px 16px",
                      borderRadius: "8px",
                      backgroundColor: `${primaryColor}10`,
                      transition: "all 0.2s ease",
                    }}
                  >
                    <FileText size={18} className="cv-icon" />
                    <span>View Current CV</span>
                  </a>
                )}

                <Box
                  className="cv-upload-container"
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 2,
                    flexWrap: "wrap",
                  }}
                >
                  <Button
                    component="label"
                    variant="outlined"
                    startIcon={<Upload />}
                    className="upload-button"
                    sx={{
                      borderColor: primaryColor,
                      color: primaryColor,
                      "&:hover": {
                        borderColor: "#c62a37",
                        backgroundColor: `${primaryColor}10`,
                      },
                    }}
                    disabled={Number.parseInt(application.status) > 1}
                  >
                    {cvNew ? "Change CV" : "Upload New CV"}
                    <input
                      type="file"
                      hidden
                      onChange={handleCvChange}
                      accept=".pdf,.doc,.docx"
                      disabled={Number.parseInt(application.status) > 1}
                    />
                  </Button>

                  {cvNew && (
                    <Box
                      className="file-info"
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                        backgroundColor: isLight ? "#f7f7f7" : "#1e1e1e",
                        padding: "4px 12px",
                        borderRadius: "4px",
                      }}
                    >
                      <span className="file-name" style={{ color: textColor }}>
                        {cv.name}
                      </span>
                      <Button
                        size="small"
                        variant="text"
                        color="error"
                        onClick={() => setCvNew(false)}
                        sx={{
                          color: primaryColor,
                          minWidth: "auto",
                        }}
                      >
                        Remove
                      </Button>
                    </Box>
                  )}
                </Box>
              </Box>
            </FormControl>
          </div>

          <Button
            variant="contained"
            className="submit-button"
            onClick={handleSubmit}
            disabled={isFormDisabled || isSubmitting}
            sx={{
              backgroundColor: primaryColor,
              "&:hover": {
                backgroundColor: "#c62a37",
              },
              "&:disabled": {
                backgroundColor: isLight ? "#e9d8d9" : "#3a2a2b",
              },
              padding: "10px 24px",
              borderRadius: "8px",
              fontWeight: 600,
              textTransform: "none",
              fontSize: "16px",
            }}
            startIcon={isSubmitting ? <CircularProgress size={20} color="inherit" /> : null}
          >
            {isSubmitting ? "Submitting..." : "Submit Application"}
          </Button>
        </>
      )}
    </Paper>
  </Container>
  );
};

export default ApplicationForm;
