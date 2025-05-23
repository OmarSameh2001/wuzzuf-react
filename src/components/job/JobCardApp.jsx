 import React, { useContext ,useState} from "react";
 import {
   Box,
   Typography,
   Button,
   Chip,
   useMediaQuery,
   useTheme
 } from "@mui/material";
 import { motion, AnimatePresence } from "framer-motion";
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
  FiCheckCircle,
  FiAlertCircle,
  FiFileText,
  FiClock as FiClockCircle
} from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { userContext } from "../../context/UserContext";
import '../../ComponentsStyles/job/jobcardApp.css' 
import { CgProfile } from "react-icons/cg";
import { FaMoneyBillWave } from "react-icons/fa";

 const  JobCardApp  = ({ application, index, primaryColor }) => {
   const theme = useTheme();
   const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
   const navigate = useNavigate();
   const {isLight} = useContext(userContext);
   const [isHovered, setIsHovered] = useState(false);
  //  const firstUpdate = application?.updates?.[0]?.timestamp;


   const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const handleJobClick = (jobId) => {
    navigate(`/applicant/jobs/${jobId}`);
  };
  const handleApplicationClick = (e, applicationId) => {
    e.stopPropagation();
    navigate(`/applicant/applications/${applicationId}`);
  };
  const getStatusInfo = (status, fail) => {
    if (fail) {
      return { 
        label: "Failed", 
        className: "failed",
        icon: <FiAlertCircle />
      };
    }
    switch (parseInt(status)) {
      case 1:
        return { 
          label: "Applied", 
          className: "applied",
          icon: <FiCheckCircle />
        };
      case 2:
        return { 
          label: "Under Review", 
          className: "review",
          icon: <FiFileText />
        };
      case 3:
        return { 
          label: "Technical Assessment", 
          className: "assessment",
          icon: <FiStar />
        };
      case 4:
        return { 
          label: "Technical Interview", 
          className: "interview",
          icon: <FiUsers />
        };
      case 5:
        return { 
          label: "HR Interview", 
          className: "hr-interview",
          icon: <FiUsers />
        };
      case 6:
        return { 
          label: "Offer", 
          className: "offer",
          icon: <FiCheckCircle />
        };
      case 7:
        return { 
          label: "Contract", 
          className: "contract",
          icon: <FaMoneyBillWave />
        };
      default:
        return { 
          label: "Unknown", 
          className: "unknown",
          icon: <FiAlertCircle />
        };
    }
  };
  const statusInfo = getStatusInfo(application?.status, application?.fail);
   return (
    <motion.div
    className={`job-card-container application-card ${isLight ? "light" : "dark"}`}
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ 
      duration: 0.4,
      delay: index * 0.05
    }}
    onMouseEnter={() => setIsHovered(true)}
    onMouseLeave={() => setIsHovered(false)}
    onClick={() => handleJobClick(application?.job_details?.id)}
  >
    <div className={`application-status-badge ${statusInfo.className}`}>
      {statusInfo.icon}
      <span>{statusInfo.label}</span>
    </div>

    <div className="job-card-header">
      <div className="company-logo">
        <img
          src={application?.job_details?.company_logo || "https://static.thenounproject.com/png/3198584-200.png"}
          alt={application?.job_details?.company_name || "Company"}
        />
      </div>
      <div className="job-header-content">
        <h3 className="job-title">{application?.job_details?.title || "Job Title"}</h3>
        <div className="company-info">
          <FiBriefcase />
          <span>{application?.job_details?.company_name || "Company Name"}</span>
        </div>
        <div className="location-info">
          <FiMapPin />
          <span>{application?.job_details?.location || "Location"}</span>
        </div>
      </div>
    </div>

    <div className="job-tags">
      {application?.job_details?.type_of_job && (
        <div className="job-tag job-type">
          <FiClock />
          <span>{application.job_details.type_of_job}</span>
        </div>
      )}

      {application?.job_details?.attend && (
        <div className="job-tag remote">
          <FiHome />
          <span>{application.job_details.attend}</span>
        </div>
      )}
      {application?.job_details?.applicant_count >-1 && (
        <div className="job-tag experience">
          <CgProfile />
          <span>{application?.job_details?.applicant_count || "0"}</span>
        </div>
      )}
    </div>

    <div className="application-dates">
      <div className="date-item">
        <div className="date-icon">
          <FiCalendar />
        </div>
        <div className="date-content">
          <span className="date-label">Applied On</span>
          <span className="date-value">{formatDate(application?.created_at)}</span>
        </div>
      </div>
      <div className="date-item">
        <div className="date-icon">
          <FiClockCircle />
        </div>
        <div className="date-content">
          <span className="date-label">Last Updated</span>
          <span className="date-value">{formatDate(application?.updated_at)}</span>
        </div>
      </div>
    </div>

    <div className="job-description">
      <p>
        {application?.job_details?.description ||
          "No description available for this position. Please click for more details about this job opportunity."}
      </p>
    </div>

    {application?.job_details?.skills_required?.length > 0 && (
      <div className="job-skills">
        {application.job_details.skills_required.slice(0, 3).map((skill, index) => (
          <div className="skill-tag" key={index}>
            <FiStar />
            <span>{skill}</span>
          </div>
        ))}

        {application.job_details.skills_required.length > 3 && (
          <div className="skill-tag more">
            <span>+{application.job_details.skills_required.length - 3} more</span>
          </div>
        )}
      </div>
    )}

    <div className="job-card-footer application-footer">
      {/* <motion.button 
        className="view-application-button" 
        whileHover={{ scale: 1.03 }} 
        whileTap={{ scale: 0.97 }}
        onClick={(e) => handleApplicationClick(e, application?.id)}
      >
        <span>View Application</span>
      </motion.button> */}
      
      <motion.button 
        className="view-job-button" 
        whileHover={{ scale: 1.03 }} 
        whileTap={{ scale: 0.97 }}
      >
        <span>View Job</span>
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
   );
 };
 
 
 
export default JobCardApp;
