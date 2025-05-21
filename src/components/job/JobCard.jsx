import { useNavigate } from "react-router";
import { useContext, useState } from "react";
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
  FiDollarSign,
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
  createApplication,
  deleteApplication,
  getApplicationsByUser,
} from "../../services/Application";
import "../../ComponentsStyles/job/jobcarduser.css";
import {
  showConfirmToast,
  showErrorToast,
  showSuccessToast,
} from "../../confirmAlert/toastConfirm";
import { CgProfile } from "react-icons/cg";
import { FaBookmark } from "react-icons/fa6";
import { AiOutlineFileDone } from "react-icons/ai";
function JobCard({ job, type, isSelected, refetch, applications }) {
  // const keywords = job?.keywords?.join(" · ") || "";
  const { user, isLight } = useContext(userContext);
  const navigate = useNavigate();
  // const theme = useTheme();
  const [isHovered, setIsHovered] = useState(false);
  // const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const primaryColor = "#d43132";
  const jobApplied = applications?.some((application) => application.job_id === job.id && application.status != "1");
  const jobSaved = applications?.some((application) => application.job_id === job.id && application.status === "1");

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
      const app = applications.filter((app) => app.job_id === job.id) || await getApplicationsByUser({
        filters: { user: user?.id, job: job?.id },
      });
      await deleteApplication(app[0]?.app_id || app?.results[0]?.id);
      showSuccessToast("Job unsaved successfully", 2000, isLight);
      refetch();
    } catch (err) {
      showErrorToast("Failed to unsave job", 2000, isLight);
      console.log(err);
      refetch();
    }
  };
  const handleSaveJob = async () => {
    try {
      const application = {
        user: `${user?.id}`,
        job: `${job?.id}`,
        status: `1`,
      };
      const res = await createApplication(application);
      showSuccessToast(
        "Job saved successfully find it in saved section",
        2000,
        isLight
      );
      refetch();
    } catch (err) {
      showErrorToast("Failed to unsave job", 2000, isLight);
      refetch();
    }
  };

  const handleSaveButton = async (e) => {
    e.stopPropagation();
    if (
      jobSaved
    ) {
      showConfirmToast({
        message: `Are you sure you want to unsave job: ${job?.title}?`,
        onConfirm: handleDeleteJob,
        confirmText: "Unsave",
        cancelText: "Cancel",
        isLight: isLight,
      });
    } else if (!applications?.find((app) => app.job === job?.id)) {
      showConfirmToast({
        message: `Are you sure you want to save job: ${job?.title}?`,
        onConfirm: handleSaveJob,
        confirmText: "Save",
        cancelText: "Cancel",
        isLight: isLight,
      });
    }
  };

  return (
    <motion.div
      className={`job-card-container ${isLight ? "light" : "dark"} ${
        isSelected ? "selected" : ""
      }`}
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
              src={
                job?.company_logo ||
                "https://static.thenounproject.com/png/3198584-200.png"
              }
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

          {jobSaved || type === "saved" ? (
            <button
              className="bookmark-button"
              onClick={handleSaveButton}
              aria-label="Unsave job"
              title="Unsave job"
            >
              <FaBookmark color="red" />
            </button>
          ) : jobApplied ? (
            <button
              className="bookmark-button"
              // onClick={handleSaveButton}
              aria-label="Applied"
              title="Applied"
              disabled
            >
              <AiOutlineFileDone color='green'/>
            </button>
          ) : (
            <button
              className="bookmark-button"
              onClick={handleSaveButton}
              aria-label="Save job"
              title="Save job"
            >
              <FiBookmark />
            </button>
          )}
          {/* {applications?.find((app) => app.job_id === job?.id && app.status != '1') && (
            
          )} */}
        </div>

        {job?.specialization && (
          <div className="specialization-badge">{job.specialization}</div>
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
          {/* {job?.applicant_count > -1 && (
            <div className="job-tag experience">
              <CgProfile />
              <span>{job.applicant_count || "0"}</span>
            </div>
          )} */}
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

      <div className="job-card-footer company-footer">
      <div className={`applicants-badge ${job?.applicant_count === 0 ? 'no-applicants' : 
        job?.applicant_count < 5 ? 'few-applicants' : 
        job?.applicant_count < 10 ? 'some-applicants' : 'many-applicants'}`}>
        {/* <FiUsers /> */}
        <span>
          {job?.applicant_count > 0 
            ? `${job.applicant_count} applicants applied for this job` 
            : "No applicants yet"}
        </span>
      </div>
        <motion.button
          className="view-details-button"
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          style={{backgroundColor: jobApplied ? "#830000" : null}}
        >
          {jobApplied ? <span>View Application</span> : <span>View Details</span>}
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
}

export default JobCard;
