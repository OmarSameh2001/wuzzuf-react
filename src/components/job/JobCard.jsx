import ApplicantFooter from "./ApplicantFooter";
import CompanyFooter from "./CompanyFooter";

function JobCard({ job, user }) {
  const keywords = job?.keywords?.join(" · ") || "";
  return (
    <div
      className="job-card"
      key={job._id}
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
      <div style={{ display: "flex", alignItems: "center" }}>
        <img
          src={job.companyLogo}
          alt={job.companyName}
          style={{
            width: "50px",
            height: "50px",
            borderRadius: "50%",
            marginRight: "16px",
          }}
        />
        <div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "8px",
            }}
          >
            <h2 style={{ fontSize: "18px", margin: "0" }}>{job.title} </h2>
            <div
              style={{
                display: "flex",
                alignItems: "center",
              }}
            >
              {job.type && (
                <div
                  style={{
                    backgroundColor: "#f5f5f5",
                    padding: "1px 2px",
                    marginRight: "8px",
                  }}
                >
                  {job.type}
                </div>
              )}
              {job.workStyle && (
                <div
                  style={{
                    backgroundColor: "#f5f5f5",
                    padding: "1px 2px",
                    marginRight: "8px",
                  }}
                >
                  {job.workStyle}
                </div>
              )}
            </div>
          </div>

          <p style={{ margin: "4px 0", color: "#666" }}>{job.companyName} - {job.location}</p>
        </div>
      </div>
      <p style={{ margin: "16px 0 8px", color: "#333", flexGrow: 1 }}>
        {job.description}
      </p>
      <p style={{ color: "#666" }}>{keywords}</p>
      {user === "company" ? <CompanyFooter /> : <ApplicantFooter />}
    </div>
  );
}

export default JobCard;