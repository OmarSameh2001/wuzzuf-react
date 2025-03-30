import { useState } from "react";

const JobCreate = () => {
    const [jobData, setJobData] = useState({
        title: "",
        description: "",
        experience: "",
        type_of_job: "",
        location: "",
        keywords: "",
        status: "1",
    });

    const [questions, setQuestions] = useState([]);

    const handleJobChange = (e) => {
        setJobData({ ...jobData, [e.target.name]: e.target.value });
    };

    const addQuestion = () => {
        setQuestions([...questions, { text: "", type: "multichoice", choices: [] }]);
    };

    const handleQuestionChange = (index, key, value) => {
        const updatedQuestions = [...questions];
        updatedQuestions[index][key] = value;
        setQuestions(updatedQuestions);
    };

    const addChoice = (index) => {
        const updatedQuestions = [...questions];
        updatedQuestions[index].choices.push("");
        setQuestions(updatedQuestions);
    };

    const handleChoiceChange = (qIndex, cIndex, value) => {
        const updatedQuestions = [...questions];
        updatedQuestions[qIndex].choices[cIndex] = value;
        setQuestions(updatedQuestions);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const jobPayload = { ...jobData, questions };
        
        try {
            const response = await fetch("http://localhost:8000/api/jobs/", { // Adjust backend API
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(jobPayload),
            });
            if (response.ok) {
                alert("Job created successfully!");
                setJobData({ title: "", description: "", experience: "", type_of_job: "", location: "", keywords: "", status: "1" });
                setQuestions([]);
            } else {
                console.error("Failed to create job");
            }
        } catch (error) {
            console.error("Error:", error);
        }
    };

    return (
        <div className="max-w-2xl mx-auto p-4 bg-white shadow-lg rounded-lg">
            <h2 className="text-2xl font-bold mb-4">Create a New Job</h2>
            <form onSubmit={handleSubmit}>

                {/* Job Details */}
                {["title", "description", "experience", "type_of_job", "location", "keywords"].map(field => (
                    <input
                        key={field}
                        type="text"
                        name={field}
                        placeholder={field.replace("_", " ")}
                        value={jobData[field]}
                        onChange={handleJobChange}
                        className="border p-2 rounded w-full mb-2"
                        required
                    />
                ))}

                {/* Questions */}
                <h3 className="text-lg font-semibold mt-4">Job Questions</h3>
                {questions.map((q, qIndex) => (
                    <div key={qIndex} className="border p-3 rounded mt-2">
                        <input
                            type="text"
                            placeholder="Question text"
                            value={q.text}
                            onChange={(e) => handleQuestionChange(qIndex, "text", e.target.value)}
                            className="border p-2 rounded w-full mb-2"
                            required
                        />
                        <select
                            value={q.type}
                            onChange={(e) => handleQuestionChange(qIndex, "type", e.target.value)}
                            className="border p-2 rounded w-full mb-2"
                        >
                            <option value="multichoice">Multiple Choice</option>
                            <option value="boolean">Yes/No</option>
                        </select>

                        {q.type === "multichoice" && (
                            <div>
                                {q.choices.map((choice, cIndex) => (
                                    <input
                                        key={cIndex}
                                        type="text"
                                        placeholder={`Choice ${cIndex + 1}`}
                                        value={choice}
                                        onChange={(e) => handleChoiceChange(qIndex, cIndex, e.target.value)}
                                        className="border p-2 rounded w-full mb-2"
                                    />
                                ))}
                                <button type="button" onClick={() => addChoice(qIndex)} className="bg-green-500 text-white px-2 py-1 rounded">+ Add Choice</button>
                            </div>
                        )}
                    </div>
                ))}

                <button type="button" onClick={addQuestion} className="bg-blue-500 text-white px-4 py-2 rounded mt-4">+ Add Question</button>
                <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded mt-4 ml-2">Submit Job</button>
            </form>
        </div>
    );
};

export default JobCreate;
