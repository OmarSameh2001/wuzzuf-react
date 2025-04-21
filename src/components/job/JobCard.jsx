import { useNavigate } from "react-router";
import { useContext } from "react";
import { userContext } from "../../context/UserContext";
import {
  Box,
  Typography,
  Chip,
  IconButton,
  Button,
  useTheme,
  useMediaQuery
} from "@mui/material";
import {
  BookmarkBorder,
  LocationOn,
  Business,
  Schedule,
  ArrowForward
} from "@mui/icons-material";
import { motion } from "framer-motion";
function JobCard({ job, type }) {
  // const keywords = job?.keywords?.join(" · ") || "";
  const {user} = useContext(userContext)
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const primaryColor = "#d43132";


  const handleJobClick = (jobId) => {
    navigate(
      user.user_type === "COMPANY"
        ? `/company/jobs/${jobId}`
        : `/applicant/jobs/${jobId}`
    );
  };
  return (
    <motion.div
      whileHover={{ y: -5 }}
      transition={{ duration: 0.3 }}
    >
      <Box
        onClick={() => handleJobClick(job.id)}
        sx={{
          border: "1px solid",
          borderColor: "#e2e8f0",
          borderRadius: "12px",
          padding: isMobile ? 2 : 3,
          cursor: "pointer",
          transition: "all 0.3s ease",
          backgroundColor: "#fff",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          "&:hover": {
            borderColor: primaryColor,
            boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)",
          },
          position: "relative",
          overflow: "hidden"
        }}
      >
        <IconButton
          sx={{
            position: "absolute",
            top: 12,
            right: 12,
            zIndex: 2,
            color: "#cbd5e0",
            "&:hover": {
              color: primaryColor
            }
          }}
          onClick={(e) => {
            e.stopPropagation();
            // Handle bookmark logic here
          }}
        >
          <BookmarkBorder />
        </IconButton>

        <Box sx={{ 
          display: "flex", 
          alignItems: "flex-start",
          mb: 2
        }}>
          <Box
            sx={{
              width: 64,
              height: 64,
              borderRadius: "12px",
              backgroundColor: "#f9fafb",
              border: "1px solid #f0f0f0",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              overflow: "hidden",
              flexShrink: 0,
              mr: 2
            }}
          >
            <img
              src={
                job.company_logo ||
                "https://static.thenounproject.com/png/3198584-200.png"
              }
              alt={job.company_name}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
              }}
            />
          </Box>
          <Box sx={{ flex: 1 }}>
            <Typography 
              variant="h6" 
              sx={{ 
                fontWeight: 700,
                color: "#2d3748",
                mb: 0.5,
                pr: 4
              }}
            >
              {job.title}
            </Typography>
            <Box sx={{ 
              display: "flex",
              alignItems: "center",
              flexWrap: "wrap",
              gap: 1,
              mb: 1
            }}>
              <Chip
                icon={<Business sx={{ fontSize: 16 }} />}
                label={job.company_name}
                size="small"
                sx={{
                  backgroundColor: "#f8fafc",
                  color: "#4a5568",
                  fontWeight: 500
                }}
              />
              <Chip
                icon={<LocationOn sx={{ fontSize: 16 }} />}
                label={job.location}
                size="small"
                sx={{
                  backgroundColor: "#f8fafc",
                  color: "#4a5568",
                  fontWeight: 500
                }}
              />
            </Box>
            {job.type_of_job && (
              <Chip
                icon={<Schedule sx={{ fontSize: 16 }} />}
                label={job.type_of_job}
                size="small"
                sx={{
                  backgroundColor: `${primaryColor}10`,
                  color: primaryColor,
                  fontWeight: 500
                }}
              />
            )}
          </Box>
        </Box>

        <Typography
          variant="body2"
          sx={{
            mt: 2,
            color: "#4a5568",
            overflow: "hidden",
            textOverflow: "ellipsis",
            display: "-webkit-box",
            WebkitLineClamp: 3,
            WebkitBoxOrient: "vertical",
            lineHeight: 1.6,
            position: "relative",
            "&:after": {
              content: '""',
              position: "absolute",
              bottom: 0,
              left: 0,
              right: 0,
              height: "32px",
              background: "linear-gradient(to bottom, rgba(255,255,255,0), rgba(255,255,255,1))",
            }
          }}
        >
          {job.description}
        </Typography>

        <Box sx={{ 
          display: "flex", 
          justifyContent: "space-between",
          alignItems: "center",
          mt: "auto",
          pt: 2
        }}>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Schedule sx={{ 
              fontSize: 16, 
              color: "#718096",
              mr: 1 
            }} />
            <Typography variant="caption" sx={{ color: "#718096" }}>
              Posted {new Date(job.created_at).toLocaleDateString()}
            </Typography>
          </Box>
          
          <Button
            variant="contained"
            onClick={(e) => {
              e.stopPropagation();
              handleJobClick(job.id);
            }}
            sx={{
              px: 3,
              py: 1,
              borderRadius: 2,
              fontWeight: 600,
              backgroundColor: primaryColor,
              "&:hover": {
                backgroundColor: "#b32828",
                boxShadow: `0 4px 14px ${primaryColor}33`,
              },
              textTransform: "none",
              fontSize: 14
            }}
            endIcon={<ArrowForward />}
          >
            View Details
          </Button>
        </Box>
      </Box>
    </motion.div>
  );
}


export default JobCard;

// import React from "react";
// import {
//   Box,
//   Typography,
//   Button,
//   Chip,
//   useMediaQuery,
//   useTheme
// } from "@mui/material";
// import { motion } from "framer-motion";
// import {
//   Business,
//   LocationOn,
//   Schedule,
//   ArrowForward
// } from "@mui/icons-material";
// import { useNavigate } from "react-router-dom";

// const JobCard = ({ application, index, primaryColor }) => {
//   const theme = useTheme();
//   const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
//   const navigate = useNavigate();
//   console.log(application, "application")

//   const getStatusChipProps = (status) => {
//     switch(status) {
//       case 1: // Applied
//         return { label: "Applied", color: "default" };
//       case 2: // Under Review
//         return { label: "Under Review", color: "info" };
//       case 3: // Shortlisted
//         return { label: "Shortlisted", color: "primary" };
//       case 4: // Interview
//         return { label: "Interview", color: "warning" };
//       case 5: // Offered
//         return { label: "Offered", color: "success" };
//       case 6: // Rejected
//         return { label: "Rejected", color: "error" };
//       default:
//         return { label: "Unknown", color: "default" };
//     }
//   };

//   const formatDate = (dateString) => {
//     const options = { year: 'numeric', month: 'short', day: 'numeric' };
//     return new Date(dateString).toLocaleDateString(undefined, options);
//   };

//   return (
//     <motion.div
//       initial={{ opacity: 0, y: 20 }}
//       animate={{ opacity: 1, y: 0 }}
//       exit={{ opacity: 0, y: -20 }}
//       transition={{ 
//         duration: 0.4,
//         delay: index * 0.05
//       }}
//       whileHover={{ 
//         y: -5,
//       }}
//     >
//       <Box
//         onClick={() => navigate(`/applicant/jobs/${application.job_details.id}`)}
//         sx={{
//           border: "1px solid",
//           borderColor: "#e2e8f0",
//           borderRadius: "12px",
//           padding: isMobile ? 2 : 3,
//           cursor: "pointer",
//           transition: "all 0.3s ease",
//           backgroundColor: "#fff",
//           height: "100%",
//           display: "flex",
//           flexDirection: "column",
//           "&:hover": {
//             borderColor: primaryColor,
//             boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)",
//           },
//           position: "relative",
//           overflow: "hidden"
//         }}
//       >
//         {/* Status badge */}
//         <Chip
//           label={getStatusChipProps(application?.status).label}
//           color={getStatusChipProps(application?.status).color}
//           size="small"
//           sx={{
//             position: "absolute",
//             top: 12,
//             right: 12,
//             zIndex: 2,
//             fontWeight: 600,
//             textTransform: "uppercase",
//             fontSize: "0.7rem",
//             letterSpacing: "0.5px"
//           }}
//         />
        
//         <Box sx={{ 
//           display: "flex", 
//           alignItems: "flex-start",
//           mb: 2
//         }}>
//           <Box
//             sx={{
//               width: 64,
//               height: 64,
//               borderRadius: "12px",
//               backgroundColor: "#f8fafc",
//               border: "1px solid #edf2f7",
//               display: "flex",
//               alignItems: "center",
//               justifyContent: "center",
//               overflow: "hidden",
//               flexShrink: 0,
//               mr: 2
//             }}
//           >
//             <img
//               src={
//                 application?.job_details?.company_logo ||
//                 "https://static.thenounproject.com/png/3198584-200.png"
//               }
//               alt={application?.job_details?.company_name}
//               style={{
//                 width: "100%",
//                 height: "100%",
//                 objectFit: "cover",
//               }}
//             />
//           </Box>
//           <Box sx={{ flex: 1 }}>
//             <Typography 
//               variant="h6" 
//               sx={{ 
//                 fontWeight: 700,
//                 color: "#2d3748",
//                 mb: 0.5,
//                 pr: 4
//               }}
//             >
//               {application?.job_details.title}
//             </Typography>
//             <Box sx={{ 
//               display: "flex",
//               alignItems: "center",
//               flexWrap: "wrap",
//               gap: 1,
//               mb: 1
//             }}>
//               <Chip
//                 icon={<Business sx={{ fontSize: 16 }} />}
//                 label={application?.job_details.company_name}
//                 size="small"
//                 sx={{
//                   backgroundColor: "#f8fafc",
//                   color: "#4a5568",
//                   fontWeight: 500
//                 }}
//               />
//               <Chip
//                 icon={<LocationOn sx={{ fontSize: 16 }} />}
//                 label={application?.job_details.location}
//                 size="small"
//                 sx={{
//                   backgroundColor: "#f8fafc",
//                   color: "#4a5568",
//                   fontWeight: 500
//                 }}
//               />
//             </Box>
//             {application?.job_details.type_of_job && (
//               <Chip
//                 icon={<Schedule sx={{ fontSize: 16 }} />}
//                 label={application?.job_details.type_of_job}
//                 size="small"
//                 sx={{
//                   backgroundColor: `${primaryColor}10`,
//                   color: primaryColor,
//                   fontWeight: 500
//                 }}
//               />
//             )}
//           </Box>
//         </Box>

//         <Box sx={{ 
//           display: "flex",
//           justifyContent: "space-between",
//           alignItems: "center",
//           mb: 2,
//           p: 1.5,
//           backgroundColor: "#f8fafc",
//           borderRadius: 2
//         }}>
//           <Box>
//             <Typography variant="caption" sx={{ 
//               color: "#718096",
//               fontWeight: 500,
//               display: "block"
//             }}>
//               Applied On
//             </Typography>
//             <Typography variant="body2" sx={{ fontWeight: 600 }}>
//               {formatDate(application?.created_at)}
//             </Typography>
//           </Box>
//           <Box>
//             <Typography variant="caption" sx={{ 
//               color: "#718096",
//               fontWeight: 500,
//               display: "block"
//             }}>
//               Last Updated
//             </Typography>
//             <Typography variant="body2" sx={{ fontWeight: 600 }}>
//               {formatDate(application?.updated_at)}
//             </Typography>
//           </Box>
//         </Box>

//         <Typography
//           variant="body2"
//           sx={{
//             mt: 1,
//             color: "#4a5568",
//             overflow: "hidden",
//             textOverflow: "ellipsis",
//             display: "-webkit-box",
//             WebkitLineClamp: 3,
//             WebkitBoxOrient: "vertical",
//             lineHeight: 1.6,
//             position: "relative",
//             "&:after": {
//               content: '""',
//               position: "absolute",
//               bottom: 0,
//               left: 0,
//               right: 0,
//               height: "32px",
//               background: "linear-gradient(to bottom, rgba(255,255,255,0), rgba(255,255,255,1))",
//             }
//           }}
//         >
//           {application?.job_details.description}
//         </Typography>

//         {application?.job_details.skills_required?.length > 0 && (
//           <Box
//             sx={{ 
//               display: "flex", 
//               flexWrap: "wrap", 
//               gap: 1, 
//               mt: 3,
//               pt: 2,
//               borderTop: `1px solid #edf2f7`
//             }}
//           >
//             {application?.job_details.skills_required.slice(0, 5).map((skill, index) => (
//               <motion.div
//                 key={index}
//                 whileHover={{ scale: 1.05 }}
//               >
//                 <Chip
//                   label={skill}
//                   size="small"
//                   sx={{
//                     backgroundColor: `${primaryColor}10`,
//                     color: primaryColor,
//                     fontWeight: 500
//                   }}
//                 />
//               </motion.div>
//             ))}
//             {application?.job_details.skills_required.length > 5 && (
//               <Chip
//                 label={`+${application?.job_details.skills_required.length - 5} more`}
//                 size="small"
//                 sx={{
//                   backgroundColor: "#edf2f7",
//                   color: "#718096"
//                 }}
//               />
//             )}
//           </Box>
//         )}

//         <Box sx={{ 
//           display: "flex", 
//           justifyContent: "space-between",
//           alignItems: "center",
//           mt: "auto",
//           pt: 2
//         }}>
//           <Button
//             variant="outlined"
//             onClick={(e) => {
//               e.stopPropagation();
//               navigate(`/applicant/applications/${application.id}`);
//             }}
//             sx={{
//               px: 3,
//               py: 1,
//               borderRadius: 2,
//               fontWeight: 600,
//               borderColor: primaryColor,
//               color: primaryColor,
//               "&:hover": {
//                 backgroundColor: `${primaryColor}10`,
//                 borderColor: primaryColor
//               },
//               textTransform: "none",
//               fontSize: 14
//             }}
//           >
//             View Details
//           </Button>
          
//           <Button
//             variant="contained"
//             onClick={(e) => {
//               e.stopPropagation();
//               navigate(`/applicant/jobs/${application.job_details.id}`);
//             }}
//             sx={{
//               px: 3,
//               py: 1,
//               borderRadius: 2,
//               fontWeight: 600,
//               backgroundColor: primaryColor,
//               "&:hover": {
//                 backgroundColor: "#b32828",
//                 boxShadow: `0 4px 14px ${primaryColor}33`,
//               },
//               textTransform: "none",
//               fontSize: 14
//             }}
//             endIcon={<ArrowForward />}
//           >
//             View Job
//           </Button>
//         </Box>
//       </Box>
//     </motion.div>
//   );
// };

// export default JobCard;