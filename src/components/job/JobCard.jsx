import { useNavigate } from "react-router";
import { useContext ,useState } from "react";
import { userContext } from "../../context/UserContext";
import {
  FiBriefcase,
  FiMapPin,
  FiClock,
  FiCalendar,
  FiArrowRight,
  FiStar,
  FiHome,
  FiTrendingUp,
  FiBookmark,
  FiDollarSign
} from "react-icons/fi";
// import {
//   LocationOn,
//   Business,
//   Schedule,
//   ArrowForward,
//   AttachMoney,
//   AccessTime,
//   Star,
//   House,
//   BookmarkBorder,
//   Stairs,
//   DateRange,
// } from "@mui/icons-material";
import { motion, AnimatePresence } from "framer-motion";
import {
  deleteApplication,
  getApplicationsByUser,
} from "../../services/Application";
import '../../ComponentsStyles/job/jobcarduser.css'
import { showConfirmToast, showErrorToast, showSuccessToast } from "../../confirmAlert/toastConfirm";
import { CgProfile } from "react-icons/cg";
function JobCard({ job, type, isSelected, refetch }) {
  // const keywords = job?.keywords?.join(" · ") || "";
  const { user, isLight } = useContext(userContext);
  const navigate = useNavigate();
  // const theme = useTheme();
  const [isHovered, setIsHovered] = useState(false);
  // const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const primaryColor = "#d43132";

  // const handleJobClick = (jobId) => {
  //   navigate(
  //     user.user_type === "COMPANY"
  //       ? `/company/jobs/${jobId}`
  //       : `/applicant/jobs/${jobId}`
  //   );
  // };

  // // Format date to relative time
  // const getRelativeTime = (dateString) => {
  //   if (!dateString) return "Recent";

  //   const date = new Date(dateString);
  //   const now = new Date();
  //   const diffInMs = now - date;
  //   const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

  //   if (diffInDays === 0) {
  //     return "Today";
  //   } else if (diffInDays === 1) {
  //     return "Yesterday";
  //   } else if (diffInDays < 7) {
  //     return `${diffInDays} days ago`;
  //   } else if (diffInDays < 30) {
  //     return `${Math.floor(diffInDays / 7)} weeks ago`;
  //   } else {
  //     return `${Math.floor(diffInDays / 30)} months ago`;
  //   }
  // };

  
  // const handleDeleteJob = async () => {
  //   try {
  //     const app = await getApplicationsByUser({
  //       filters: { user: user?.id, job: job?.id },
  //     });
  //     const res = await deleteApplication(app.results[0].id);
  //     showSuccessToast("Job unsaved successfully", 2000, isLight);
  //     refetch();
  //   } catch (err) {
  //     console.log(err);
  //     showErrorToast("Failed to unsaved job", 2000, isLight);
  //     refetch();
  //   }
  // };
  // const handleSaveJob = async () => {
  //   showConfirmToast({
  //     message: `Are you sure you want to unsave job: ${job?.title}?`,
  //     onConfirm: handleDeleteJob,
  //     confirmText: "Unsave",
  //     cancelText: "Cancel",
  //     isLight:isLight,
  //   });
  // };
  // Format date to relative time
  const getRelativeTime = (dateString) => {
    if (!dateString) return "Recent";

    const date = new Date(dateString);
    const now = new Date();
    const diffInMs = now - date;
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

    if (diffInDays === 0) {
      return "Today";
    } else if (diffInDays === 1) {
      return "Yesterday";
    } else if (diffInDays < 7) {
      return `${diffInDays} days ago`;
    } else if (diffInDays < 30) {
      return `${Math.floor(diffInDays / 7)} weeks ago`;
    } else {
      return `${Math.floor(diffInDays / 30)} months ago`;
    }
  };

  const handleJobClick = (jobId) => {
    navigate(
      user.user_type === "COMPANY"
        ? `/company/jobs/${jobId}`
        : `/applicant/jobs/${jobId}`
    );
  };

  const handleDeleteJob = async () => {
    try {
      const app = await getApplicationsByUser({
        filters: { user: user?.id, job: job?.id },
      });
      const res = await deleteApplication(app.results[0].id);
      showSuccessToast("Job unsaved successfully", 2000, isLight);
      refetch();
    } catch (err) {
      showErrorToast("Failed to unsave job", 2000, isLight);
      refetch();
    }
  };

  const handleSaveJob = async (e) => {
    e.stopPropagation();
    showConfirmToast({
      message: `Are you sure you want to unsave job: ${job?.title}?`,
      onConfirm: handleDeleteJob,
      confirmText: "Unsave",
      cancelText: "Cancel",
      isLight: isLight,
    });
  };

  return (
    <motion.div
      className={`job-card-container ${isLight ? "light" : "dark"} ${isSelected ? "selected" : ""}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => handleJobClick(job?.id)}
    >
      <div className="job-card-accent"></div>
      
      <div className="job-card-content">
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
          </div>

          {type === "saved" && (
            <button className="bookmark-button" onClick={handleSaveJob} aria-label="Unsave job">
              <FiBookmark />
            </button>
          )}
        </div>

        {job?.specialization && (
          <div className="specialization-badge">
            {job.specialization}
          </div>
        )}
        
        <div className="job-details-row">
          <div className="job-detail-item">
            <FiMapPin />
            <span>{job?.location || "Location"}</span>
          </div>
          
          {job?.experince && (
            <div className="job-detail-item">
              <FiTrendingUp />
              <span>{job.experince}</span>
            </div>
          )}
          
          <div className="job-detail-item">
            <FiCalendar />
            <span>{getRelativeTime(job?.created_at)}</span>
          </div>
          {job?.applicant_count >-1 && (
            <div className="job-tag experience">
              <CgProfile />
              <span>{job.applicant_count || "0"}</span>
            </div>
          )}
        </div>

        <div className="job-type-row">
          {job?.type_of_job && (
            <div className="job-type-badge">
              <FiClock />
              <span>{job.type_of_job}</span>
            </div>
          )}

          {job?.attend && (
            <div className="job-type-badge attend">
              <FiHome />
              <span>{job.attend}</span>
            </div>
          )}
          
          {/* {job?.status && (
            <div className={`job-type-badge status ${job.status.toLowerCase()}`}>
              <span>{job.status === "1" ? "Open" : "Closed"}</span>
            </div>
          )} */}
        </div>

        <div className="job-description">
          <p>
            {job?.description ||
              "No description available for this position. Please click for more details about this job opportunity."}
          </p>
        </div>

        {job?.skills_required && job.skills_required.length > 0 && (
          <div className="job-skills">
            <div className="skills-label">Required Skills:</div>
            <div className="skills-container">
              {job.skills_required.slice(0, 3).map((skill, index) => (
                <div className="skill-tag" key={index}>
                  <FiStar />
                  <span>{skill}</span>
                </div>
              ))}

              {job.skills_required.length > 3 && (
                <div className="skill-tag more">
                  <span>+{job.skills_required.length - 3}</span>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      <div className="job-card-footer">
        <motion.button 
          className="view-details-button" 
          whileHover={{ scale: 1.03 }} 
          whileTap={{ scale: 0.97 }}
        >
          <span>View Details</span>
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

export default JobCard;