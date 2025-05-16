
import { useState } from "react"
import {
  FiArrowLeft,
  FiMapPin,
  FiMail,
  FiPhone,
  FiCalendar,
  FiDownload,
  FiLinkedin,
  FiGithub,
  FiGlobe,
  FiUser,
  FiCode,
  FiBriefcase,
  FiBookOpen,
  FiClock,
  FiChevronDown,
  FiChevronUp,
  FiLoader,
  FiAward,
  FiStar,
} from "react-icons/fi"
import {  useContext, useEffect } from "react"
import { useQuery } from "@tanstack/react-query"
import { motion, AnimatePresence } from "framer-motion"
// import { useTheme ,useMediaQuery} from "@emotion/react";
import { userContext } from "../../../context/UserContext"
import { useNavigate, useLocation, useParams } from "react-router-dom"
import { getTalentById } from "../../../services/Talents"
import '../../../styles/company/talents/talents_profile.css'
import { LocationCity, Work } from "@mui/icons-material"
import { FaHome, FaPenFancy } from "react-icons/fa";
import { Calendar } from "lucide-react"


const parseJSONField = (field) => {
  try {
    return field ? JSON.parse(field) : []
  } catch (e) {
    return []
  }
}

const getSkillLevel = (proficiency) => {
  if (!proficiency) return "beginner"
  if (proficiency >= 90) return "expert"
  if (proficiency >= 70) return "advanced"
  if (proficiency >= 40) return "intermediate"
  return "beginner"
}

const SkeletonBox = ({ className }) => <div className={`skeleton-box ${className || ""}`}></div>

const SkeletonProfile = () => (
  <div className="talent-profile-content">
    <div className="profile-header">
      <div className="back-button-placeholder"></div>
      <SkeletonBox className="skeleton-title" />
    </div>

    <div className="profile-grid">
      {/* Sidebar Skeleton */}
      <div className="profile-sidebar">
        <div className="profile-banner">
          <div className="profile-avatar skeleton-avatar"></div>
        </div>

        <div className="profile-info">
          <SkeletonBox className="skeleton-name" />
          <SkeletonBox className="skeleton-title" />

          <div className="profile-social-links">
            <SkeletonBox className="skeleton-social" />
            <SkeletonBox className="skeleton-social" />
            <SkeletonBox className="skeleton-social" />
          </div>

          <SkeletonBox className="skeleton-button" />
        </div>

        <div className="sidebar-section">
          <SkeletonBox className="skeleton-section-title" />
          <div className="contact-list">
            <SkeletonBox className="skeleton-contact" />
            <SkeletonBox className="skeleton-contact" />
            <SkeletonBox className="skeleton-contact" />
          </div>
        </div>
      </div>

      {/* Main Content Skeleton */}
      <div className="profile-main">
        <div className="profile-card">
          <div className="card-header">
            <SkeletonBox className="skeleton-card-title" />
          </div>
          <div className="card-content">
            <SkeletonBox className="skeleton-text-block" />
            <SkeletonBox className="skeleton-text-block" />
          </div>
        </div>

        <div className="profile-card">
          <div className="card-header">
            <SkeletonBox className="skeleton-card-title" />
          </div>
          <div className="card-content">
            <div className="skills-container">
              <SkeletonBox className="skeleton-skill" />
              <SkeletonBox className="skeleton-skill" />
              <SkeletonBox className="skeleton-skill" />
              <SkeletonBox className="skeleton-skill" />
            </div>
          </div>
        </div>

        <div className="profile-card">
          <div className="card-header">
            <SkeletonBox className="skeleton-card-title" />
          </div>
          <div className="card-content">
            <div className="timeline-container">
              <SkeletonBox className="skeleton-timeline-item" />
              <SkeletonBox className="skeleton-timeline-item" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
)

const TalentProfile = () => {
  // const theme = useTheme()
  const { isLight } = useContext(userContext)
  // const isMobile = useMediaQuery(theme.breakpoints.down("md"))
  const navigate = useNavigate()
  const location = useLocation()
  const {id} = useParams()
  const talentId = id
  const [shortlisted, setShortlisted] = useState(false)
  const [expandedExp, setExpandedExp] = useState({})
  const [isContentReady, setIsContentReady] = useState(false)
  const toggleExpanded = (id) => {
    setExpandedExp((prev) => ({
      ...prev,
      [id]: !prev[id],
    }))
  }

  const {
    data: talent,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["talent", talentId],
    queryFn: () => getTalentById(talentId),
    enabled: !!talentId,
  })

   // This effect ensures content is only shown after everything is loaded
   useEffect(() => {
    if (!isLoading && talent) {
      // Delay showing content to ensure CSS is fully applied
      const timer = setTimeout(() => {
        setIsContentReady(true)
      }, 300)
      return () => clearTimeout(timer)
    }
    return () => setIsContentReady(false)
  }, [isLoading, talent])


  // const education = parseJSONField(talent?.education)
  // const experience = parseJSONField(talent?.experience)
  // const skills = parseJSONField(talent?.skills)
  const education = talent ? parseJSONField(talent?.education) : []
  const experience = talent ? parseJSONField(talent?.experience) : []
  const skills = talent ? parseJSONField(talent?.skills) : []
  if (isError || (!isLoading && !talent.id)) {
    return (
      <div className={`talent-profile-container ${isLight ? "light-mode" : "dark-mode"}`}>
        <div className="background-pattern"></div>
        <div className="error-container">
          <div className="error-card">
            <h2>{isError ? "Error Loading Profile" : "Profile Not Found"}</h2>
            <p>
              {isError
                ? error.message
                : "The requested talent profile could not be found. Please check the URL or try again later."}
            </p>
            <button className="back-button-large" onClick={() => navigate(-1)}>
              <FiArrowLeft /> Go Back
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className={`talent-profile-container ${isLight ? "light-mode" : "dark-mode"}`}>
      <div className="background-pattern"></div>

      {/* Show skeleton loader while content is loading */}
      {!isContentReady && <SkeletonProfile />}

      {/* Show actual content when ready */}
      <AnimatePresence>
        {isContentReady && talent && (
          <motion.div
            className="talent-profile-content"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <div className="profile-header">
              <button className="back-button" onClick={() => navigate(-1)} aria-label="Go back">
                <FiArrowLeft />
              </button>
              <h1>Talent Profile</h1>
            </div>

            <div className="profile-grid">
              {/* Sidebar */}
              <motion.div
                className="profile-sidebar"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3, delay: 0.1 }}
              >
                <div className="profile-banner">
                  <div className="profile-avatar">
                    <img src={talent?.img || "/placeholder.svg"}  />
                  </div>
                </div>

                <div className="profile-info">
                  <h2 className="profile-name">{talent?.name}</h2>
                  {talent?.title && <p className="profile-title">{talent?.title}</p>}

                  <div className="profile-social-links">
                    {talent?.linkedin && (
                      <a href={talent?.linkedin} target="_blank" rel="noopener noreferrer" className="social-link">
                        <FiLinkedin />
                      </a>
                    )}
                    {talent?.github && (
                      <a href={talent?.github} target="_blank" rel="noopener noreferrer" className="social-link">
                        <FiGithub />
                      </a>
                    )}
                    {talent?.website && (
                      <a href={talent?.website} target="_blank" rel="noopener noreferrer" className="social-link">
                        <FiGlobe />
                      </a>
                    )}
                  </div>

                  {talent?.cv && (
                    <a
                      href={talent?.cv.endsWith(".pdf") ? talent?.cv : talent?.cv + ".pdf"}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="download-cv-button"
                    >
                      Download CV <FiDownload />
                    </a>
                  )}
                </div>

                <div className="sidebar-section">
                  <h3 className="sidebar-section-title">Professional Details</h3>
                  <div className="contact-list">
                    {talent?.seniority && (
                      <div className="contact-item">
                        <Work fontSize="small" className="contact-icon" />
                        <span>{talent?.seniority}</span>
                      </div>
                    )}
                    {talent?.specialization && (
                      <div className="contact-item">
                        <FaPenFancy className="contact-icon" />
                        <span>{talent?.specialization}</span>
                      </div>
                    )}
                    {talent?.experience?.length > 0 && (
                      <div className="contact-item">
                        <FaHome className="contact-icon" />
                        <span>{talent?.experience.find((e) => e.endDate === "Present")?.company || talent?.experience[0]?.company}</span>
                      </div>
                    )}
                  </div>
                </div>
                <div className="sidebar-section">
                  <h3 className="sidebar-section-title">Contact Information</h3>
                  <div className="contact-list">
                    {talent?.location && (
                      <div className="contact-item">
                        <FiMapPin className="contact-icon" />
                        <span>{talent?.location}</span>
                      </div>
                    )}
                    {talent?.email && (
                      <div className="contact-item">
                        <FiMail className="contact-icon" />
                        <a href={`mailto:${talent?.email}`}>{talent?.email}</a>
                      </div>
                    )}
                    {talent?.phone_number && (
                      <div className="contact-item">
                        <FiPhone className="contact-icon" />
                        <a href={`tel:${talent?.phone_number}`}>{talent?.phone_number}</a>
                      </div>
                    )}
                    {talent?.location && (
                      <div className="contact-item">
                        <LocationCity className="contact-icon" />
                        <span>{talent?.location}</span>
                      </div>
                    )}
                    {talent?.dob && (
                      <div className="contact-item">
                        <FiCalendar className="contact-icon" />
                        <span>
                          {new Date(talent?.dob).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
                <div className="sidebar-section">
                  <h3 className="sidebar-section-title">ITI Information</h3>
                  <div className="contact-list">
                    {talent?.branch?.name && (
                      <div className="contact-item">
                        <FaHome className="contact-icon" />
                        <span>{talent?.branch?.name}</span>
                      </div>
                    )}
                    {talent?.track?.name && (
                      <div className="contact-item">
                        <FaPenFancy className="contact-icon" />
                        <span>{talent?.track?.name}</span>
                      </div>
                    )}
                    {talent?.iti_grad_year && (
                      <div className="contact-item">
                        <Calendar className="contact-icon" />
                        <span>{talent?.iti_grad_year}</span>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>

              {/* Main Content */}
              <div className="profile-main">
                {/* About Section */}
                {(talent?.about || talent?.specialization) && (
                  <motion.div
                    className="profile-card"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.2 }}
                  >
                    <div className="card-header">
                      <h3>
                        <FiUser /> Professional Summary
                      </h3>
                    </div>
                    <div className="card-content">
                      {talent?.about && (
                        <div className="summary-item">
                          <h4>About</h4>
                          <p>{talent?.about}</p>
                        </div>
                      )}
                      {talent?.summary && (
                        <div className="summary-item">
                          <h4>Summary</h4>
                          <p>{talent?.summary}</p>
                        </div>
                      )}
                      {/* {talent?.specialization && (
                        <div className="summary-item">
                          <h4>Specialization</h4>
                          <p>{talent?.specialization}</p>
                        </div>
                      )} */}
                    </div>
                  </motion.div>
                )}

                {/* Skills Section */}
                {talent?.skills?.length > 0 && (
                  <motion.div
                    className="profile-card"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.3 }}
                  >
                    <div className="card-header">
                      <h3>
                        <FiCode /> Skills & Expertise
                      </h3>
                    </div>
                    <div className="card-content">
                      <div className="skills-container">
                        {talent?.skills?.map((skill, index) => {
                          const skillName = typeof skill === "object" ? skill.name : skill
                          const proficiency = typeof skill === "object" ? skill.proficiency : null
                          const level = getSkillLevel(proficiency)

                          return (
                            <div className="skill-item" key={index}>
                              {proficiency ? (
                                <div className="skill-with-progress">
                                  <div className="skill-header">
                                    <span className="skill-name">{skillName}</span>
                                    <span className="skill-percentage">{proficiency}%</span>
                                  </div>
                                  <div className="skill-progress-container">
                                    <div
                                      className={`skill-progress-bar ${level}`}
                                      style={{ width: `${proficiency}%` }}
                                    ></div>
                                  </div>
                                  <div className="skill-level-indicator">
                                    <span className="skill-level">{level}</span>
                                    <div className="skill-stars">
                                      {[...Array(5)].map((_, i) => (
                                        <FiStar
                                          key={i}
                                          className={`star ${
                                            (level === "beginner" && i < 1) ||
                                            (level === "intermediate" && i < 2) ||
                                            (level === "advanced" && i < 4) ||
                                            (level === "expert" && i < 5)
                                              ? "filled"
                                              : ""
                                          }`}
                                        />
                                      ))}
                                    </div>
                                  </div>
                                </div>
                              ) : (
                                <div className={`skill-chip ${level}`}>
                                  <FiAward className="skill-icon" />
                                  <span>{skillName}</span>
                                </div>
                              )}
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Experience Section */}
                {talent?.experience?.length > 0 && (
                  <motion.div
                    className="profile-card"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.4 }}
                  >
                    <div className="card-header">
                      <h3>
                        <FiBriefcase /> Work Experience
                      </h3>
                    </div>
                    <div className="card-content">
                      <div className="timeline-container">
                        {talent?.experience?.map((exp, index) => (
                          <motion.div
                            className="timeline-item"
                            key={index}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.05 * index }}
                          >
                            <div className="timeline-marker"></div>
                            <div className="timeline-content">
                              <div className="experience-header">
                                <div className="experience-header-content">
                                  <h4 className="experience-title">{exp.title}</h4>
                                  <h5 className="experience-company">{exp.company}</h5>
                                  <div className="experience-meta">
                                    {exp.location && (
                                      <span className="meta-item">
                                        <FiMapPin /> {exp.location}
                                      </span>
                                    )}
                                    <span className="meta-item">
                                      <FiClock /> {exp.startDate} — {exp.endDate || "Present"}
                                    </span>
                                  </div>
                                </div>
                                <div className="experience-status">
                                  <span className={`status-badge ${exp.endDate != 'Present' ? "past" : "current"}`}>
                                    {exp.endDate != 'Present' ? "Past" : "Current"}
                                  </span>
                                </div>
                              </div>

                              {exp.description && (
                                <div className="experience-description">
                                  <button className="toggle-details-button" onClick={() => toggleExpanded(index)}>
                                    {expandedExp[index] ? "Hide details" : "Show details"}
                                    {expandedExp[index] ? <FiChevronUp /> : <FiChevronDown />}
                                  </button>

                                  <AnimatePresence>
                                    {expandedExp[index] && (
                                      <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: "auto", opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        transition={{ duration: 0.3 }}
                                        className="description-content"
                                      >
                                        <p>{exp.description}</p>
                                      </motion.div>
                                    )}
                                  </AnimatePresence>
                                </div>
                              )}
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Education Section */}
                {talent?.education?.length > 0 && (
                  <motion.div
                    className="profile-card"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.5 }}
                  >
                    <div className="card-header">
                      <h3>
                        <FiBookOpen /> Education
                      </h3>
                    </div>
                    <div className="card-content">
                      <div className="education-grid">
                        {talent?.education?.map((edu, index) => (
                          <motion.div
                            className="education-item"
                            key={index}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.05 * index }}
                            whileHover={{ y: -5 }}
                          >
                            <div className="education-icon">
                              <FiBookOpen />
                            </div>
                            <div className="education-details">
                              <h4 className="education-degree">{edu.degree}</h4>
                              <h5 className="education-school">{edu.school}</h5>
                              {edu.fieldOfStudy && <p className="education-field">{edu.fieldOfStudy}</p>}
                              <div className="education-period">
                                <FiClock /> {edu.startDate} — {edu.endDate || "Present"}
                              </div>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Show loading spinner if content is not ready */}
      {isLoading && !isContentReady && (
        <div className="loading-overlay">
          <div className="loading-spinner-container">
            <FiLoader className="loading-spinner" />
          </div>
          <p>Loading talent profile...</p>
        </div>
      )}
    </div>
  )
}

export default TalentProfile
