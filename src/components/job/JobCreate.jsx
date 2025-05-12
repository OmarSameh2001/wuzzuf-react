import { use, useContext, useEffect, useState } from "react";
import { userContext } from "../../context/UserContext";
import { useNavigate, useParams } from "react-router";
import { set } from "date-fns";
//import { useQuery } from "@tanstack/react-query";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { getJobById } from "../../services/Job";
import {
  // Box,
  // Typography,
  // Button,
  // TextField,
  // Select,
  // MenuItem,
  // FormControl,
  // InputLabel,
  // Checkbox,
  // FormControlLabel,
  useMediaQuery,
  useTheme,
  IconButton,
  Paper,
} from "@mui/material"
//import { userContext } from "../context/UserContext"
import { motion, AnimatePresence } from "framer-motion"
import { useQuery } from "@tanstack/react-query"
// import {
//   Add,
//   Remove,
//   Delete,
//   Business,
//   LocationOn,
//   Description,
//   WorkOutline,
//   Schedule,
//   Save,
//   ArrowBack,
// } from "@mui/icons-material"
import {showSuccessToast,showWarningToast,showConfirmToast,showErrorToast} from "../../confirmAlert/toastConfirm";
import '../../ComponentsStyles/job/jobCreate.css';
import CustomAutoComplete from "../autoComplete/CustomAutoComplete";

const JobCreate = () => {
   const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"))
  const { user, isLight } = useContext(userContext);
  const { jobId } = useParams();
  const navigate = useNavigate();
  const primaryColor = isLight ? "#d43132" : "#901b26"
  const secondaryColor = isLight ? "#f5f5f5" : "#2c2c2c"
  const backgroundColor = isLight ? "#fff" : "#242424"
  const textColor = isLight ? "#2d3748" : "#e2e8f0"
  const borderColor = isLight ? "#e2e8f0" : "#4a5568"
  const experienceOptions = 
    [
      "Intern",
      "Junior",
      "Mid-Level",
      "Senior",
      "Lead",
      "Manager",
    
  ]
  const screeningQuestions = [
    "What makes you a strong candidate for this position?",
    "Why do you believe you're a good fit for this role?",
    "Please briefly explain how your skills and experience align with the requirements of this position.",
    "In what ways do your qualifications make you an ideal candidate for this opportunity?",
    "Tell us how your background supports your application?",
  ]

  const [jobData, setJobData] = useState({
    title: "",
    description: "",
    experince: "",
    type_of_job: "Full-time",
    location: "Cairo",
    // keywords: "",
    status: "1",
    attend: "Onsite",
    specialization: "",
    company: `${user?.id}`,
  });

  const [questions, setQuestions] = useState([]);
  const [update, setUpdate] = useState(false);

  const {
    data: jobOld,
    error: jobError,
    isLoading: jobLoading,
    refetch,
  } = useQuery({
    queryKey: ["jobOld", jobId],
    queryFn: async () => {
      if (jobId) {
        const res = await getJobById(jobId);
        return res;
      } else return null;
    },
  });
 

  useEffect(() => {
    if (jobOld) {
      setJobData({
        ...jobData,
        title: jobOld.title,
        description: jobOld.description,
        experince: jobOld.experince,
        type_of_job: jobOld.type_of_job,
        location: jobOld.location,
        status: jobOld.status,
        attend: jobOld.attend,
      });
      setQuestions(jobOld.questions);
      setUpdate(true);
    }
  }, [jobOld]);

  const handleJobChange = (e) => {
    setJobData({ ...jobData, [e.target.name]: e.target.value });
    // console.log(e.target.name, e.target.value);
  };

  const addQuestion = () => {
    setQuestions([
      ...questions,
      { text: "", type: "multichoice", choices: [] },
    ]);
  };

  const removeQuestion = (index) => {
    const updatedQuestions = [...questions];
    updatedQuestions.splice(index, 1);
    setQuestions(updatedQuestions);
  };

  // const handleQuestionChange = (index, key, value) => {
  //   const updatedQuestions = [...questions];
  //   updatedQuestions[index][key] = value;
  //   updatedQuestions[index].text = key === "type" && value === "video" ? screeningQuestions[Math.floor(Math.random() * screeningQuestions.length)] : ''
  //   setQuestions(updatedQuestions);
  // };
   
  const handleQuestionChange = (index, key, value) => {
    setQuestions(prevQuestions => {
      const updatedQuestions = [...prevQuestions];
      updatedQuestions[index] = {
        ...updatedQuestions[index],
        [key]: value
      };
      return updatedQuestions;
    });
  };
  const addChoice = (index) => {
    const updatedQuestions = [...questions];
    updatedQuestions[index].choices.push("");
    setQuestions(updatedQuestions);
  };

  const removeChoice = (qIndex, cIndex) => {
    const updatedQuestions = [...questions];
    updatedQuestions[qIndex].choices.splice(cIndex, 1);
    setQuestions(updatedQuestions);
  };

  const handleChoiceChange = (qIndex, cIndex, value) => {
    const updatedQuestions = [...questions];
    updatedQuestions[qIndex].choices[cIndex] = value;
    setQuestions(updatedQuestions);
  };

  const handleRandomQuestion = (qIndex, qtype) => {
    if(qtype != "video") return
    const text = screeningQuestions[Math.floor(Math.random() * 5)]
    const updatedQuestions = [...questions];
    updatedQuestions[qIndex].text = text;
    setQuestions(updatedQuestions);
  };

  const uploadJob = async () => {
    if (
      questions.some((q) => q.type === "multichoice" && q.choices.length === 0)
    ) {
      showWarningToast(
        "Please ensure all multiple-choice questions have at least one choice."
      );
      return;
    }
    const jobPayload = { ...jobData, questions };
    jobPayload.company = user?.id; // Ensure company ID is set correctly

    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND}jobs/`, {
        // Adjust backend API
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(jobPayload),
      });
      if (response.ok) {
        showSuccessToast("Job created successfully!", 2000, isLight);
        setJobData({
          title: "",
          description: "",
          experince: "",
          type_of_job: "",
          location: "",
          status: "1",
          company: `${user?.id}`,
        });
        setQuestions([]);
        navigate("/company/jobs");
      } else {
        showErrorToast("Failed to create job", 2000, isLight);
        console.error("Failed to create job");
      }
    } catch (error) {
      showErrorToast("Failed to create job", 2000, isLight);
      console.error("Error:", error);
    }
  }
  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(questions)
    if (questions.length === 0) {
      showConfirmToast(
        {message:"Are you sure no questions will be added ?", onConfirm: uploadJob, isLight: isLight},
      )
    }else{
      console.log("uploading job")
      uploadJob()
    }
    
  };

  const updateJob = async () => {
    if (
      questions.some((q) => q.type === "multichoice" && q.choices.length === 0)
    ) {
      showErrorToast(
        "Please ensure all multiple-choice questions have at least one choice."
      );
      return;
    }
    const jobPayload = { ...jobData, questions };
    jobPayload.company = user?.id; // Ensure company ID is set correctly

    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND}jobs/${jobId}/`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(jobPayload),
      });
      if (response.ok) {
        showSuccessToast("Job updated successfully!", 2000, isLight);
        setJobData({
          title: "",
          description: "",
          experince: "",
          type_of_job: "",
          location: "",
          status: "1",
          company: `${user?.id}`,
        });
        setQuestions([]);
        setUpdate(false);
        navigate("/company/jobs/" + jobId);
      } else {
        console.error("Failed to update job");
        showErrorToast("Failed to update job", 2000, isLight);
      }
    } catch (error) {
      console.error("Error:", error);
      showErrorToast("Failed to update job", 2000, isLight);
    }
  }
  const handleUpdate = async (e) => {
    e.preventDefault();
    showConfirmToast({message:"Are you sure you want to update this job ?", onConfirm: updateJob, isLight: isLight})
  };

  return (
    <div  style={{background: isLight ? '#fff' : '#121212',width: '100%'}}>
    <div className={`job-create-container ${isLight ? "light-mode" : "dark-mode"}`}>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <div className="job-create-header">
          <h2 className="job-create-title">{update ? "Update Job" : "Create a New Job"}</h2>
          <p className="job-create-subtitle">
            {update
              ? "Update your job posting to attract the best talent"
              : "Create a compelling job posting to attract the best talent"}
          </p>
        </div>
      </motion.div>

      <form onSubmit={update ? handleUpdate : handleSubmit}>
        {/* Job Details */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <div className="form-section">
            <h3 className="section-title">Job Details</h3>

            <div className="form-grid">
              <div className="form-group">
                <label htmlFor="title" className="form-label">
                  Job Title
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  placeholder="Enter job title"
                  value={jobData.title}
                  onChange={handleJobChange}
                  className="form-input"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="location" className="form-label">
                  Location
                </label>
                {/* <input
                  type="text"
                  id="location"
                  name="location"
                  placeholder="Enter job location"
                  value={jobData.location}
                  onChange={handleJobChange}
                  className="form-input"
                  required
                /> */}
                <CustomAutoComplete
                  setter={setJobData}
                  getter={jobData.location}
                  value={'location'}
                  label={'Governates'}
                  background={isLight ? '#fff' : '#1a202c'}
                  required
                  type={'egypt'}
                  />
              </div>

              <div className="form-group">
                <label htmlFor="type_of_job" className="form-label">
                  Job Type
                </label>
                <select
                  id="type_of_job"
                  name="type_of_job"
                  value={jobData.type_of_job}
                  onChange={handleJobChange}
                  className="form-select"
                  required
                >
                  <option value="Full-time">Full-time</option>
                  <option value="Part-time">Part-time</option>
                  <option value="Internship">Internship</option>
                  <option value="Freelance">Freelance</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="attend" className="form-label">
                  Work Mode
                </label>
                <select
                  id="attend"
                  name="attend"
                  value={jobData.attend}
                  onChange={handleJobChange}
                  className="form-select"
                  required
                >
                  <option value="Onsite">Onsite</option>
                  <option value="Hybrid">Hybrid</option>
                  <option value="Remote">Remote</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="experince" className="form-label">
                  Experience Required
                </label>
                <CustomAutoComplete
                  options={experienceOptions}
                  getter={jobData.experince}
                  setter={setJobData}
                  value={"experince"}
                  label={"Experince"}
                  background={isLight ? '#fff' : '#1a202c'}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="experince" className="form-label">
                  Specialization
                </label>
                <CustomAutoComplete
                  // options={experienceOptions}
                  getter={jobData.specialization}
                  setter={setJobData}
                  value={"specialization"}
                  label={"Specialization"}
                  background={isLight ? '#fff' : '#1a202c'}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="description" className="form-label">
                Job Description
                <p className="form-hint">
                  (The more details you provide, the better we can match you with interested Talents!)
                </p>
              </label>
              <textarea
                id="description"
                name="description"
                placeholder="Enter job description"
                value={jobData.description}
                onChange={handleJobChange}
                className="form-textarea"
                style={{
                  height: `${jobData.description ? jobData.description.split("\n").length * 2 + 2 : 4}em`,
                  maxHeight: "50vh",
                  minHeight: "20vh",
                }}
                required
              />
            </div>
          </div>
        </motion.div>

        {/* Questions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className="questions-section">
            <div className="questions-header">
              <h3 className="section-title">Job Questions</h3>
              <button type="button" onClick={addQuestion} className="add-question-btn">
                + Add Question
              </button>
            </div>

            <AnimatePresence>
              {questions.length === 0 ? (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  <div className="no-questions">
                    <p>No questions added yet. Questions help you screen candidates more effectively.</p>
                    <button type="button" onClick={addQuestion} className="add-first-question-btn">
                      + Add Your First Question
                    </button>
                  </div>
                </motion.div>
              ) : (
                questions.map((question, qIndex) => (
                  <motion.div
                    key={qIndex}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="question-card">
                      <button
                        type="button"
                        onClick={() => removeQuestion(qIndex)}
                        className="remove-question"
                        aria-label="Remove question"
                      >
                        X
                      </button>

                      <div className="question-header">
                        <input
                          type="text"
                          placeholder="Question text"
                          value={question.text}
                          onChange={(e) => handleQuestionChange(qIndex, "text", e.target.value)}
                          className="form-input question-input"
                          required
                        >
                          
                        </input>
                        <select
                          value={question.type}
                          onChange={(e) => handleQuestionChange(qIndex, "type", e.target.value)}
                          className="form-select question-type-select"
                        >
                          <option value="multichoice">Multiple Choice</option>
                          <option value="boolean">Yes/No</option>
                          <option value="video" disabled={questions.filter((q) => q.type === "video").length === 1}>Screening Video</option>
                          
                        </select>
                        <div className="required-checkbox">
                          <input
                            type="checkbox"
                            id={`required-${qIndex}`}
                            checked={question.required || question.type === "video" || false}
                            onChange={(e) => handleQuestionChange(qIndex, "required", e.target.checked)}
                          />
                          <label htmlFor={`required-${qIndex}`} className="required-label">
                            Required
                          </label>
                        </div>
                      </div>

                      {question.type === "multichoice" && (
                        <div className="choices-container">
                          <AnimatePresence>
                            {question.choices &&
                              question.choices.map((choice, cIndex) => (
                                <motion.div
                                  key={cIndex}
                                  initial={{ opacity: 0, x: -20 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  exit={{ opacity: 0, x: 20 }}
                                  transition={{ duration: 0.2 }}
                                >
                                  <div className="choice-item">
                                    <input
                                      type="text"
                                      placeholder={`Choice ${cIndex + 1}`}
                                      value={choice}
                                      onChange={(e) => handleChoiceChange(qIndex, cIndex, e.target.value)}
                                      className="form-input choice-input"
                                      required
                                    />
                                    <button
                                      type="button"
                                      onClick={() => removeChoice(qIndex, cIndex)}
                                      disabled={question.choices.length <= 1}
                                      className="remove-choice-btn"
                                    >
                                      -
                                    </button>
                                  </div>
                                </motion.div>
                              ))}
                          </AnimatePresence>

                          <div className="choice-actions">
                            <button
                              type="button"
                              onClick={() => addChoice(qIndex)}
                              disabled={question.choices && question.choices.length >= 10}
                              className="add-choice-btn"
                            >
                              + Add Choice
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </motion.div>
                ))
              )}
            </AnimatePresence>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <div className="form-actions">
            <button type="button" onClick={() => navigate(-1)} className="cancel-btn">
              Cancel
            </button>
            <button type="submit" className="submit-btn">
              {update ? "Update Job" : "Submit Job"}
            </button>
          </div>
        </motion.div>
      </form>
    </div>
    </div>
  );
};

export default JobCreate;
