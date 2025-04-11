import { useNavigate } from "react-router";
import ApplicantFooter from "./ApplicantFooter";
import CompanyFooter from "./CompanyFooter";
import { useContext } from "react";
import { userContext } from "../../context/UserContext";

function JobCard({ job, type }) {
  // const keywords = job?.keywords?.join(" · ") || "";
  const {user} = useContext(userContext)
  const navigate = useNavigate();
  return (
    <div
      className="job-card"
      key={job.id}
      style={{
        width: "50%",
        border: "1px solid #e1e9ee",
        borderRadius: "8px",
        boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
        padding: "16px",
        marginBottom: "16px",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <div
        style={{ cursor: "pointer" }}
        onClick={() =>
          user.user_type === "COMPANY"
            ? navigate(`/company/jobs/${job.id}`)
            : navigate(`/applicant/jobs/${job.id}`)
        }
      >
        <div style={{ display: "flex", alignItems: "center" }}>
          <img
            src={
              job.company_logo ||
              "https://static.thenounproject.com/png/3198584-200.png"
            }
            alt={job.company_name}
            style={{
              width: "50px",
              height: "50px",
              borderRadius: "50%",
              marginRight: "16px",
            }}
          />
          <div style={{ maxWidth: "100%" }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                maxWidth: "50%",
                flexWrap: "wrap"
              }}
            >
              <h2 style={{ fontSize: "18px", margin: "0" }}>{job.title} </h2>
              <div style={{ display: "flex", alignItems: "center" }}>
                {job.type_of_job && (
                  <div
                    style={{
                      backgroundColor: "#f5f5f5",
                      padding: "1px 2px",
                      marginRight: "8px",
                      borderRadius: "4px",
                      color: "#901b20"
                    }}
                  >
                    {job.type_of_job}
                  </div>
                )}
                {job.attend && (
                  <div
                    style={{
                      backgroundColor: "#f5f5f5",
                      padding: "1px 2px",
                      marginRight: "8px",
                      borderRadius: "4px",
                      color: "#901b20"
                    }}
                  >
                    {job.attend}
                  </div>
                )}
              </div>
            </div>

            <p style={{ margin: "4px 0", color: "#666" }}>
              {job.company_name} - {job.location}
            </p>
          </div>
        </div>
        <p
          style={{
            margin: "16px 0 8px",
            color: "#333",
            flexGrow: 1,
            overflow: "hidden",
            textOverflow: "ellipsis",
            display: "-webkit-box",
            WebkitLineClamp: 5,
            lineClamp: 5,
            WebkitBoxOrient: "vertical",
          }}
        >
          {job.description}
        </p>
      </div>
      {/* <p style={{ color: "#666" }}>{keywords}</p> */}
      {/* {user === "company" ? <CompanyFooter /> : <ApplicantFooter type={type} job_id={job.id}/>} */}
    </div>
  );
}

export default JobCard;