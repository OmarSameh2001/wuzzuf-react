import { useContext } from "react";
import { userContext } from "../../context/UserContext";
import { Link } from "react-router";
import '../../ComponentsStyles/CompanyProcess/companyJobBox.css'
const CompanyJobsBox = ({ profileData, job }) => {
  const { isLight } = useContext(userContext);
  const textColor = isLight ? "#121212" : "#fff";
  

  return (
    <div className={`company-box ${isLight ? "light-mode" : "dark-mode"}`}>
      <div className="company-box-header">
        <h2 className="company-box-title">{profileData?.name} Jobs</h2>
      </div>

      <div className="company-box-content">
        {job && job.length > 0 ? (
          <div className="jobs-list">
            {job.map((jobItem) => (
              <div key={jobItem.id} className="job-item">
                <Link to={`/applicant/jobs/${jobItem.id}`} className="job-link">
                  {jobItem.title}
                </Link>
              </div>
            ))}
          </div>
        ) : (
          <p>No jobs available</p>
        )}
      </div>
    </div>
  );
};

export default CompanyJobsBox;
