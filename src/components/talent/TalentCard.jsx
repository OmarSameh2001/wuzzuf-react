import React from "react";
import { Card, CardContent, CardActions, Paper, Box, Chip, Tooltip } from "@mui/material";
import { Button, Avatar, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { BookmarkBorder, LocationOn, Visibility, Work } from "@mui/icons-material";
import { motion, AnimatePresence } from "framer-motion"
import { Mail, Phone } from "lucide-react";
import '../../styles/company/talents/talents.css';


const TalentCard = ({ talent, index, skillsArray }) => {
  const navigate = useNavigate();

  return (
        <motion.div
          key={talent.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3, delay: index * 0.05 }}
          className="applicant-card-wrapper"
        >
          <Paper className="applicant-card">
            <Box className="applicant-card__header">
              <Avatar
                src={talent.img || "/placeholder.svg"}
                alt={talent.name}
                className="applicant-avatar"
              />
              <Box className="applicant-details">
                <Typography variant="h6" className="applicant-name">
                  {talent.name}
                </Typography>
                {talent.specialization && (
                  <Typography variant="body2" className="applicant-specialization">
                    {talent.specialization}
                  </Typography>
                )}
                {talent.title && (
                  <Typography variant="body2" className="applicant-title">
                    {typeof talent.title === "string" ? talent.title : "Professional"}
                  </Typography>
                )}
                <Box className="applicant-meta">
                  {talent.location && (
                    <Box className="meta-item">
                      <LocationOn fontSize="small" />
                      <span>{typeof talent.location === "string" ? talent.location : "Location"}</span>
                    </Box>
                  )}
                  {talent.seniority && (
                    <Box className="meta-item">
                      <Work fontSize="small" />
                      <span>
                        {talent.seniority}
                      </span>
                    </Box>
                  )}
                </Box>
              </Box>
            </Box>

            <Box className="applicant-card__body">
              <Box className="applicant-skills">
                {skillsArray.slice(0, 2).map((skill, index) => (
                  <Chip key={index} label={skill} size="small" className="skill-chip" />
                ))}
                {skillsArray.length > 2 && (
                  <Chip label={`+${skillsArray.length - 2}`} size="small" className="more-skills-chip" />
                )}
              </Box>

              <Typography variant="body2" className="applicant-summary">
                {talent.about && typeof talent.about === "string"
                  ? `${talent.about.substring(0, 120)}${talent.about.length > 120 ? "..." : ""}`
                  : "No summary available for this applicant."}
              </Typography>

              <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                <Box className="applicant-contact">
                {talent.email && (
                  <Tooltip title={talent.email}>
                    <Box component="a" href={`mailto:${talent.email}`} className="contact-item-card">
                      <Mail fontSize="small" />
                    </Box>
                  </Tooltip>
                )}
                {talent.phone_number && (
                  <Tooltip title={talent.phone_number}>
                    <Box component="a" href={`tel:${talent.phone_number}`} className="contact-item-card">
                      <Phone fontSize="small" />
                    </Box>
                  </Tooltip>
                )}
                {talent.cv && (
                  <Tooltip title="View CV">
                    <Box
                      component="a"
                      href={talent.cv + ".pdf"}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="contact-item-card contact-item--primary"
                    >
                      <BookmarkBorder fontSize="small" />
                    </Box>
                  </Tooltip>
                )}
                
              </Box>
              <Box className="iti-info">
                {talent?.track?.name && (
                     <p className="iti-info-text">{talent.track.name}</p>
                )}
                {talent?.branch?.name && (
                     <p className="iti-info-text">{talent.branch.name}{talent.iti_grad_year && ` - ${talent.iti_grad_year}`}</p>
                )}
              </Box>
              </Box>
            </Box>

            <Box className="applicant-card__footer">
              <Button
                variant="contained"
                fullWidth
                onClick={() => navigate(`/company/talents/${talent.id}`)}
                startIcon={<Visibility />}
                className="view-profile-button"
              >
                View Full Profile
              </Button>
            </Box>
          </Paper>
        </motion.div>
      )
};

export default TalentCard;