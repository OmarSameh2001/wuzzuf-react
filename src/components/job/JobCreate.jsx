import { use, useContext, useEffect, useState } from "react";
import { userContext } from "../../context/UserContext";
import { useNavigate, useParams } from "react-router";
import { set } from "date-fns";
import { useQuery } from "@tanstack/react-query";
import { getJobById } from "../../services/Job";
import { Checkbox } from "@mui/material";

const JobCreate = () => {
  const { user } = useContext(userContext);
  const { jobId } = useParams();
  const navigate = useNavigate();
  const [jobData, setJobData] = useState({
    title: "",
    description: "",
    experince: "",
    type_of_job: "Full-time",
    location: "",
    // keywords: "",
    status: "1",
    attend: "Onsite",
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
        console.log(res);
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

  const handleQuestionChange = (index, key, value) => {
    const updatedQuestions = [...questions];
    updatedQuestions[index][key] = value;
    setQuestions(updatedQuestions);
    console.log(index, key, value);
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (questions.length === 0) {
      if (!confirm("Are you sure no questions will be added ?")) {
        return;
      }
    }
    if (
      questions.some((q) => q.type === "multichoice" && q.choices.length === 0)
    ) {
      alert(
        "Please ensure all multiple-choice questions have at least one choice."
      );
      return;
    }
    const jobPayload = { ...jobData, questions };
    jobPayload.company = user?.id; // Ensure company ID is set correctly

    try {
      const response = await fetch("http://localhost:8000/jobs/", {
        // Adjust backend API
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(jobPayload),
      });
      if (response.ok) {
        alert("Job created successfully!");
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
        console.log("Job created successfully!", response.body);
        navigate("/company/jobs");
      } else {
        console.error("Failed to create job");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };
  const handleUpdate = async (e) => {
    e.preventDefault();
    if (questions.length === 0) {
      if (!confirm("Are you sure no questions will be added ?")) {
        return;
      }
    }
    if (
      questions.some((q) => q.type === "multichoice" && q.choices.length === 0)
    ) {
      alert(
        "Please ensure all multiple-choice questions have at least one choice."
      );
      return;
    }
    const jobPayload = { ...jobData, questions };
    jobPayload.company = user?.id; // Ensure company ID is set correctly

    try {
      const response = await fetch(`http://localhost:8000/jobs/${jobId}/`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(jobPayload),
      });
      if (response.ok) {
        alert("Job updated successfully!");
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
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div
      className="mx-auto my-3 p-4 bg-white shadow-lg rounded-lg"
      style={{ minWidth: "70vw", maxWidth: "70vw", borderRadius: "10px" }}
    >
      <h2 className="text-2xl font-bold mb-4">
        {update ? `Update Old Job` : "Create a New Job"}
      </h2>
      <form onSubmit={update ? handleUpdate : handleSubmit}>
        {/* Job Details */}
        {[
          "title",
          "description",
          "experince",
          "location",
          "type_of_job",
          "attend",
        ].map((field, i) => (
          <div className="mb-4 d-flex flex-column" key={field}>
            <label
              htmlFor={field}
              className="block text-gray-700 text-sm font-bold mb-2"
            >
              {field.replaceAll("_", " ").charAt(0).toUpperCase() +
                field.replaceAll("_", " ").slice(1)}{" "}
              {i === 1 && (
                <p
                  className="p-0 m-0"
                  style={{ fontSize: "12px", color: "green" }}
                >
                  (The more details you provide, the better we can match you
                  with interested Talents!)
                </p>
              )}
            </label>
            {field === "description" ? (
              <textarea
                key={field}
                name={field}
                placeholder={field.replaceAll("_", " ")}
                value={jobData[field]}
                onChange={handleJobChange}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                style={{
                  height: `${
                    jobData[field]
                      ? jobData[field].split("\n").length * 2 + 2
                      : 4
                  }em`,
                  maxHeight: "50vh",
                  minHeight: "20vh",
                }}
                required
              />
            ) : field === "type_of_job" ? (
              <select
                key={field}
                name={field}
                value={jobData[field]}
                onChange={handleJobChange}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                required
              >
                <option value="Full-time">Full-time</option>
                <option value="Part-time">Part-time</option>
                <option value="Internship">Internship</option>
                <option value="Freelance">Freelance</option>
              </select>
            ) : field === "attend" ? (
              <select
                key={field}
                name={field}
                value={jobData[field]}
                onChange={handleJobChange}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                required
              >
                <option value="Onsite">Onsite</option>
                <option value="Hybrid">Hybrid</option>
                <option value="Remote">Remote</option>
              </select>
            ) : (
              <input
                key={field}
                type="text"
                name={field}
                placeholder={field.replaceAll("_", " ")}
                value={jobData[field]}
                onChange={handleJobChange}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                required
              />
            )}
          </div>
        ))}

        {/* Questions */}
        <h3 className="text-lg font-semibold mt-4">Job Questions</h3>
        {questions.map((q, qIndex) => (
          <div
            key={qIndex}
            className="border p-3 rounded mt-2"
            style={{ position: "relative", maxWidth: "100%"}}
          >
            <div style={{ display: "flex", alignItems: 'center', gap: '10px' }}>
            <input
              type="text"
              placeholder="Question text"
              value={q.text}
              onChange={(e) =>
                handleQuestionChange(qIndex, "text", e.target.value)
              }
              className="border p-2 rounded w-full mb-2"
              required
            />
            <select
              value={q.type}
              onChange={(e) =>
                handleQuestionChange(qIndex, "type", e.target.value)
              }
              className="border p-2 rounded w-full mb-2"
            >
              <option value="multichoice">Multiple Choice</option>
              <option value="boolean">Yes/No</option>
            </select>
            <div>
            <Checkbox
              checked={q.required || false}
              onChange={(e) =>
                handleQuestionChange(qIndex, "required", e.target.checked)
              }
            ></Checkbox>
            <label className="text-sm">Required</label>
            </div>
            </div>

            {q.type === "multichoice" && (
              <div style={{ display: "flex", flexDirection: "column" }}>
                {q.choices.map((choice, cIndex) => (
                  <input
                    key={cIndex}
                    type="text"
                    placeholder={`Choice ${cIndex + 1}`}
                    value={choice}
                    onChange={(e) =>
                      handleChoiceChange(qIndex, cIndex, e.target.value)
                    }
                    className="border p-2 rounded w-full mb-2"
                    required
                  />
                ))}
                <div style={{ display: "flex", gap: "5px" }}>
                  <button
                    type="button"
                    disabled={q.choices.length > 9}
                    onClick={() => addChoice(qIndex)}
                    className="btn btn-primary text-white px-2 py-1 rounded"
                  >
                    + Add
                  </button>
                  <button
                    type="button"
                    disabled={q.choices.length < 2}
                    onClick={() => removeChoice(qIndex, q.choices.length - 1)}
                    className="btn btn-danger text-white px-2 py-1 rounded ml-2"
                  >
                    - Remove
                  </button>
                </div>
              </div>
            )}
            <button
              type="button"
              onClick={() => removeQuestion(qIndex)}
              className="btn btn-danger text-white px-2 py-1 rounded"
              style={{ position: "absolute", top: "5px", right: "5px" }}
            >
              X
            </button>
          </div>
        ))}

        <div style={{ display: "flex", gap: "10px", marginTop: "20px" }}>
          <button
            type="button"
            onClick={addQuestion}
            className="btn btn-primary text-white px-4 py-2 rounded"
          >
            + Add Question
          </button>
          <button
            type="submit"
            className="btn btn-success text-white px-4 py-2 rounded"
          >
            {update ? "Update Job" : "Submit Job"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default JobCreate;
