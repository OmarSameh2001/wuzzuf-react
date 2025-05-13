import { useContext, useState } from "react";
import { userContext } from "../../context/UserContext";
import { patchJob } from "../../services/Job";
import { useNavigate } from "react-router";
// import { Button } from "@mui/material";
import { TbCancel } from "react-icons/tb";
import { FaEdit, FaMapMarkerAlt, FaRegClock, FaBriefcase, FaRegBuilding, FaArrowDown, FaArrowUp } from "react-icons/fa";
import { IoIosCloudDone } from "react-icons/io";
import { 
// MdOutlineWork,
// MdOutlineAttachMoney,
// MdBusinessCenter,
MdWorkOutline,
MdOutlineBusinessCenter
 } from "react-icons/md";
import { BsCalendarDate, BsLightningCharge } from "react-icons/bs";
// import { BsTools } from "react-icons/bs";
import "../../ComponentsStyles/job/job_details.css";
import { showConfirmToast, showErrorToast } from "../../confirmAlert/toastConfirm";
import { Button } from "@mui/material";
import { CgProfile } from "react-icons/cg";

function JobDetails({ job, refetch }) {
  if (!job) return null;
  const { user, isLight } = useContext(userContext);
  const navigate = useNavigate();
  const id = job.id;
  const [loading, setLoading] = useState(false);
  const [expand, setExpand] = useState(false);

  const handleActivation = async (state) => {
    setLoading(true);
    try {
    if (
      state === 0 
    ) {
      showConfirmToast({
        message: "Are you sure you want to deactivate this job?", 
        onConfirm: async () => {
          // Implement the deactivation logic here
          const res = await patchJob(id, { status: 0 });
          refetch();
        },
        isLight: isLight
      })
      
    } else if (
      state === 1
    ) {
      showConfirmToast({
        message: "Are you sure you want to activate this job?", 
        onConfirm: async () => {
          // Implement the activation logic here
          const res = await patchJob(id, { status: 1 });
          refetch();
        }
        ,isLight: isLight
      })   
      
    }
    setLoading(false);
  } catch (error) {
      showErrorToast(error.message, 5000, isLight);
    setLoading(false);
    }
  };


  return (
<div className={`job-details-container ${isLight ? "light-mode" : "dark-mode"}`}>
      <div className="background-pattern"></div>
      
      <div className="job-details-wrapper">
        {/* Status Banner */}
        <div className={`status-banner ${job.status === "1" ? "active" : "inactive"}`}>
          <div className="status-content">
            <div className="status-indicator"></div>
            <span className="status-text">
              This position is currently {job.status === "1" ? "open" : "closed"}
            </span>
          </div>
          
          {user?.user_type === "COMPANY" && (
            <div className="action-buttons">
              {job?.status == 1 ? (
                <button
                  className="action-icon-button deactivate"
                  onClick={() => handleActivation(0)}
                  title="Deactivate Job"
                  disabled={loading}
                >
                  <TbCancel />
                </button>
              ) : (
                <button
                  className="action-icon-button activate"
                  onClick={() => handleActivation(1)}
                  title="Activate Job"
                  disabled={loading}
                >
                  <IoIosCloudDone />
                </button>
              )}

              <button
                className="action-icon-button edit"
                onClick={() => navigate("/company/jobEdit/" + id)}
                title="Edit Job"
              >
                <FaEdit />
              </button>
            </div>
          )}
        </div>
        
        <div className="job-content-grid">
          {/* Main Content */}
          <div className="job-main-content">
            {/* Job Header */}
            <div className="job-header">
              <div className="company-logo-container">
                <img
                  src={job.company_logo || "https://static.thenounproject.com/png/3198584-200.png"}
                  alt={job.company_name}
                  className="company-logo"
                  onClick={()=>{
                    user?.user_type === "JOBSEEKER" ? navigate(`/applicant/companies/${job.company}`) : null
                  }}
                  style={{cursor: user?.user_type === "JOBSEEKER" ? 'pointer' : null}}
                />
              </div>
              
              <div className="job-title-container">
                <h1 className="job-title">{job.title}</h1>
                <div className="company-info">
                  <span className="company-name"
                    onClick={()=>{
                      user?.user_type === "JOBSEEKER" ? navigate(`/applicant/companies/${job.company}`) : null
                    }}
                    style={{cursor: user?.user_type === "JOBSEEKER" ? 'pointer' : null}}>
                    <FaRegBuilding className="company-icon" />
                    {job.company_name}
                  </span>
                  <span className="location">
                    <FaMapMarkerAlt className="location-icon" />
                    {job.location}
                  </span>
                </div>
              </div>
            </div>
            
            {/* Job Description */}
            <div className="job-section description-section">
              <h2 className="section-title">
                <span className="section-icon-wrapper">
                  <FaRegClock className="section-icon" />
                </span>
                Job Description
                <Button className="btn btn-primary" onClick={() => setExpand(!expand)}>{expand ? "Collapse" : "Expand"}{expand ? <FaArrowUp /> : <FaArrowDown />}</Button>
              </h2>
              
              <div className="description-content" style={{height: expand ? "auto" : "100px", overflow: "hidden"}}>{job.description}</div>
            </div>
            
            {/* Skills Section */}
            {job.keywords && job.keywords.length > 0 && (
              <div className="job-section skills-section">
                <h2 className="section-title">
                  <span className="section-icon-wrapper">
                    <BsLightningCharge className="section-icon" />
                  </span>
                  Required Skills
                </h2>
                <div className="skills-container">
                  {job.keywords.map((skill, index) => (
                    <span key={index} className="skill-tag">{skill}</span>
                  ))}
                </div>
              </div>
            )}
          </div>
          
          {/* Sidebar */}
          <div className="job-sidebar">
            <div className="sidebar-card job-details-card">
              <h3 className="sidebar-card-title">Job Details</h3>
              
              <div className="detail-item">
                <div className="detail-icon">
                  <MdWorkOutline />
                </div>
                <div className="detail-content">
                  <span className="detail-label">Job Type</span>
                  <span className="detail-value">{job.type_of_job}</span>
                </div>
              </div>
              
              <div className="detail-item">
                <div className="detail-icon">
                  <MdOutlineBusinessCenter />
                </div>
                <div className="detail-content">
                  <span className="detail-label">Work Mode</span>
                  <span className="detail-value">{job.attend}</span>
                </div>
              </div>
              
              <div className="detail-item">
                <div className="detail-icon">
                  <FaBriefcase />
                </div>
                <div className="detail-content">
                  <span className="detail-label">Experience</span>
                  <span className="detail-value">{job.experince || "Not specified"}</span>
                </div>
              </div>
              
              <div className="detail-item">
                <div className="detail-icon">
                  <BsCalendarDate />
                </div>
                <div className="detail-content">
                  <span className="detail-label">Posted</span>
                  <span className="detail-value">{job?.created_at?.split("T")[0] || "Recently"}</span>
                </div>
              </div>

              <div className="detail-item">
                <div className="detail-icon">
                  <CgProfile />
                </div>
                <div className="detail-content">
                  <span className="detail-label">Clicked Apply</span>
                  <span className="detail-value">{job?.applicant_count || 'You are the first to apply'}</span>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
export default JobDetails;
