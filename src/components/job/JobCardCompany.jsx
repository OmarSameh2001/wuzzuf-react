
import { useState, useContext } from "react"
import { useNavigate } from "react-router-dom"
import { userContext } from "../../context/UserContext"
import { motion, AnimatePresence } from "framer-motion"
import {
  FiBriefcase,
  FiMapPin,
  FiClock,
  FiCalendar,
  FiArrowRight,
  FiStar,
  FiHome,
  FiUsers,
  FiTrendingUp,
  FiEdit,
} from "react-icons/fi";
import '../../ComponentsStyles/job/jobcardcomp.css';
import { CgProfile } from "react-icons/cg";

const JobCardCompany = ({ job, isSelected }) => {
    const { isLight } = useContext(userContext)
    const navigate = useNavigate()
    const [isHovered, setIsHovered] = useState(false)
  
    // Format date to relative time
    const getRelativeTime = (dateString) => {
      if (!dateString) return "Recent"
  
      const date = new Date(dateString)
      const now = new Date()
      const diffInMs = now - date
      const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24))
  
      if (diffInDays === 0) {
        return "Today"
      } else if (diffInDays === 1) {
        return "Yesterday"
      } else if (diffInDays < 7) {
        return `${diffInDays} days ago`
      } else if (diffInDays < 30) {
        return `${Math.floor(diffInDays / 7)} weeks ago`
      } else {
        return `${Math.floor(diffInDays / 30)} months ago`
      }
    }
  
    const handleJobClick = (jobId) => {
      navigate(`/company/jobs/${jobId}`)
    }
  
    const handleEditJob = (e) => {
      e.stopPropagation()
      navigate(`/company/jobEdit/${job?.id}`)
    }
  
    // Calculate applicants badge
    const getApplicantsBadge = () => {
      const count = job?.id.applications?.length || 0
      if (count === 0) return { text: "No applicants", className: "no-applicants" }
      if (count < 5) return { text: `${count} applicants`, className: "few-applicants" }
      if (count < 20) return { text: `${count} applicants`, className: "some-applicants" }
      return { text: `${count} applicants`, className: "many-applicants" }
    }
    const applicantsBadge = getApplicantsBadge()
  
    return (
      <motion.div
        className={`job-card-container company-card ${isLight ? "light" : "dark"} ${isSelected ? "selected" : ""}`}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={() => handleJobClick(job?.id)}
      >
        <div className="job-status-badge">
          {job?.status ==="1" ? (
            <span className="active-badge">Active</span>
          ) : (
            <span className="inactive-badge">Inactive</span>
          )}
        </div>
  
        <button className="edit-button" onClick={handleEditJob} aria-label="Edit job">
          <FiEdit />
        </button>
  
        <div className="job-card-header">
          <div className="company-logo">
            <img
              src={job?.company_logo || "https://static.thenounproject.com/png/3198584-200.png"}
              alt={job?.company_name || "Company"}
            />
          </div>
          <div className="job-header-content">
            <h3 className="job-title">{job?.title || "Job Title"}</h3>
            <div className="company-info">
              <FiBriefcase />
              <span>{job?.company_name || "Company Name"}</span>
            </div>
            <div className="location-info">
              <FiMapPin />
              <span>{job?.location || "Location"}</span>
            </div>
          </div>
        </div>
  
        <div className="job-tags">
          <div className="job-tag date">
            <FiCalendar />
            <span>{getRelativeTime(job?.created_at)}</span>
          </div>
  
          {job?.type_of_job && (
            <div className="job-tag job-type">
              <FiClock />
              <span>{job.type_of_job}</span>
            </div>
          )}
  
          {job?.attend && (
            <div className="job-tag remote">
              <FiHome />
              <span>{job.attend}</span>
            </div>
          )}
  
          {job?.experince && (
            <div className="job-tag experience">
              <FiTrendingUp />
              <span>{job.experince}</span>
            </div>
          )}
          {/* {job?.applicant_count > -1 && (
            <div className="job-tag experience">
              <CgProfile />
              <span>{job.applicant_count || "0"}</span>
            </div>
          )} */}
        </div>
  
        <div className="job-description">
          <p>
            {job?.description ||
              "No description available for this position. Please click for more details about this job opportunity."}
          </p>
        </div>
  
        {/* {job?.skills_required && job.skills_required.length > 0 && (
          <div className="job-skills">
            {job.skills_required.slice(0, 3).map((skill, index) => (
              <div className="skill-tag" key={index}>
                <FiStar />
                <span>{skill}</span>
              </div>
            ))} 


            {job.skills_required.length > 3 && (
              <div className="skill-tag more">
                <span>+{job.skills_required.length - 3} more</span>
              </div>
            )} 
          </div>
        )} */}
            {/* style={{height: "20.5rem" ,paddingBottom: "10rem"}} */}
       
            <div className="job-card-footer company-footer">
            <div className={`applicants-badge ${applicantsBadge.className}`}>
              <FiUsers />
              <span>{applicantsBadge.text}</span>
              {job?.applicant_count > -1 && (
                <span className="applicant-count">
                  <CgProfile />
                  {job.applicant_count || "0"}
                </span>
              )}
            </div>

          <motion.button className="view-details-button" whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} style={{paddingBottom: "1rem"}}>
            <span>Show the job details</span>
            <FiArrowRight />
          </motion.button>
        </div>
  
        <AnimatePresence>
          {isHovered && (
            <motion.div
              className="hover-effect"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            />
          )}
        </AnimatePresence>
      </motion.div>
    )
  }
  
  export default JobCardCompany;
  