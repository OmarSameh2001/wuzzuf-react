import { FaUserCheck, FaUserSlash } from "react-icons/fa";

function AnswerBox({ applicant, phase, next, fail }) {
  const questions = applicant?.job_details?.questions || [];
  const answers = applicant?.answers || [];
  console.log(applicant)
  console.log(phase)
  return (
    <div
      style={{
        padding: "20px",
        border: "1px solid #ccc",
        borderRadius: "8px",
        maxWidth: "600px",
        margin: "20px auto",
        backgroundColor: "#f9f9f9",
        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
      }}
    >
      {questions.map((question, index) => {
        const answer = answers.find((ans) => ans.question === question.id);
        return (
          <div
            key={question.id}
            style={{
              marginBottom: "24px",
              padding: "16px",
              backgroundColor: "#fff",
              borderRadius: "8px",
              boxShadow: "0 2px 6px rgba(0, 0, 0, 0.08)",
              lineHeight: "1.6",
            }}
          >
            <p
              style={{
                fontStyle: "italic",
                color: "#888",
                marginBottom: "10px",
                marginTop: '10px'
              }}
            >
              Question {index + 1}:
            </p>
            <p style={{ fontWeight: "bold", marginBottom: "0px" }}>
              {question.text.endsWith("?")
                ? question.text
                : question.text + " ?"}
            </p>
            <p style={{ color: "#555", marginTop: "0px" }}>
              {answer && answer.answer_text
                ? (() => {
                    try {
                      const parsed = JSON.parse(answer.answer_text);
                      return Array.isArray(parsed) ? parsed.join(", ").toString() : parsed.toString();
                    } catch {
                      return answer.answer_text.toString();
                    }
                  })()
                : "No answer provided"}
            </p>
          </div>
        );
      })}

      <div
        style={{
          marginTop: "30px",
          display: "flex",
          alignItems: "center",
          gap: "20px",
        }}
      >
        {!applicant.fail && (
          <div
            style={{ display: "flex", alignItems: "center", cursor: "pointer" }}
            onClick={() => fail(applicant.id, phase)}
          >
            <FaUserSlash
              color="red"
              style={{ marginRight: "8px", fontSize: "24px" }}
            />
            <span style={{ color: "red", fontWeight: "bold" }}>Fail</span>
          </div>
        )}

        {phase !== 5 && (
          <div
            style={{ display: "flex", alignItems: "center", cursor: "pointer" }}
            onClick={() => next(applicant.id, phase)}
          >
            <FaUserCheck
              color="green"
              style={{ marginRight: "8px", fontSize: "24px" }}
            />
            <span style={{ color: "green", fontWeight: "bold" }}>
              Next Phase
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

export default AnswerBox;
