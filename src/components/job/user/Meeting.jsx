// import { Link } from "react-router-dom";
// // import React from "react";
// import { Box, Button, Typography, Paper, Chip, Tooltip } from "@mui/material"
// import { Calendar, dateFnsLocalizer } from "react-big-calendar";
// import format from "date-fns/format";
// import parse from "date-fns/parse";
// import startOfWeek from "date-fns/startOfWeek";
// import getDay from "date-fns/getDay";
// import { enUS } from "date-fns/locale";
// import { FaCalendarAlt, FaLink, FaTrophy, FaSadTear, FaHourglassHalf } from "react-icons/fa"
// import "react-big-calendar/lib/css/react-big-calendar.css";
// import React, { useState, useEffect, useContext } from "react";
// import { userContext } from "../../../context/UserContext";
// import '../../../ComponentsStyles/CompanyProcess'
// const locales = { "en-US": enUS };

// const localizer = dateFnsLocalizer({
//   format,
//   parse,
//   startOfWeek,
//   getDay,
//   locales,
// });

// const Meeting = ({ phase, clickedColumn, applicationData }) => {
//   const { isLight } = useContext(userContext);
//   const { link: phaseLink, time: phaseTime } = getPhaseData();

//   // Convert phaseTime to Date format
//   const eventDate = phaseTime ? new Date(phaseTime) : new Date();

//   // State to control the calendar view date
//   const [viewDate, setViewDate] = useState(eventDate);
//   const [view, setView] = useState("month");
//   if (!applicationData) {
//     return <p className="text-danger text-center">You didnt apply yet</p>;
//   }
//   console.log(applicationData);
//   const appStatus = parseInt(applicationData.status) - 1;
//   const getPhaseData = () => {
//     switch (phase) {
//       case "Technical Assessment":
//         return {
//           link: applicationData.assessment_link,
//           time: applicationData.assessment_time,
//         };
//       case "Technical Interview":
//         return {
//           link: applicationData.interview_link,
//           time: applicationData.interview_time,
//         };
//       case "Hr Interview":
//         return { link: applicationData.hr_link, time: applicationData.hr_time };
//       case "Offer":
//         return {
//           link: applicationData.offer_link,
//           time: applicationData.offer_time,
//         };

//       default:
//         return { link: null, time: null };
//     }
//   };


//   // Automatically focus on the meeting date when phaseTime changes
//   useEffect(() => {
//     if (phaseTime) {
//       setViewDate(new Date(phaseTime));
//     }
//   }, [phaseTime]);

//   // Convert phaseTime to calendar events
//   const events = phaseTime
//     ? [
//         {
//           title: `${phase} Meeting`,
//           start: eventDate,
//           end: new Date(eventDate.getTime() + 60 * 60 * 1000), // 1-hour duration
//         },
//       ]
//     : [];

//   // Highlight the event
//   const eventPropGetter = (event) => {
//     return {
//       style: {
//         backgroundColor: "#1976d2", // Primary blue color
//         color: "#fff",
//         borderRadius: "8px",
//         padding: "5px",
//       },
//     };
//   };

//   console.log("Application :", appStatus, clickedColumn);
//   return (
//     <div
//       style={{
//         display: "flex",
//         flexDirection: "column",
//         marginTop: "10px",
//         justifyContent: "center",
//         alignItems: "center",
//       }}
//     >
//       <Typography
//         variant="h4"
//         gutterBottom
//         style={{ color: isLight ? "black" : "white" }}
//       >
//         {phase === "Technical Assessment"
//           ? "Technical Assessment"
//           : `${phase} Meeting`}
//       </Typography>

//       {appStatus === clickedColumn && applicationData.fail ? (
//         <p style={{ color: "red" }}>Unfortunately you have failed this phase</p>
//       ) : appStatus === clickedColumn ? (
//         <>
//           {/* <p>Status is eligible for this phase.</p> */}
//           {/* {console.log(phaseLink)} */}
//           {phaseLink ? (
//             <Box mt={2}>
//               <Button
//                 variant="contained"
//                 color="primary"
//                 href={phaseLink}
//                 target="_blank"
//               >
//                 Access {phase} Resources
//               </Button>
//             </Box>
//           ) : (
//             <p>
//               You qualified to this phase but the meeting isn't assigned yet.
//             </p>
//           )}

//           {/* Show Reminder Calendar */}
//           {phaseTime && (
//             <Box mt={3} style={{ height: 500 }}>
//               <h4 style={{ color: isLight ? "black" : "white" }}>
//                 Meeting Schedule
//               </h4>
//               <Button
//                 variant="outlined"
//                 color="primary"
//                 onClick={() => setView("day")}
//                 style={{ marginRight: "10px" }}
//               >
//                 View by Day
//               </Button>
//               <Button
//                 variant="outlined"
//                 color="secondary"
//                 onClick={() => setView("month")}
//               >
//                 View by Month
//               </Button>
//               <Calendar
//                 localizer={localizer}
//                 events={events}
//                 startAccessor="start"
//                 endAccessor="end"
//                 view={view}
//                 date={viewDate}
//                 onNavigate={(date) => setViewDate(date)}
//                 onView={setView}
//                 style={{ 
//                   height: 400, 
//                   color: isLight ? "black" : "white",
//                 }}
//                 eventPropGetter={eventPropGetter}
//               />
//             </Box>
//           )}
//         </>
//       ) : appStatus > clickedColumn ? (
//         <p style={{ color: "green" }}>
//           Congratulations you have passed this phase
//         </p>
//       ) : (
//         <p className="text-warning">You didn't proceed to this phase yet.</p>
//       )}
//       <style>
//         {`
//           .rbc-today {
//             background-color:rgb(153, 0, 0);
//             color: #fff;
//             border-radius: 8px;
//             padding: 5px;
//           }
//         `}
//       </style>
//     </div>
    
//   );
  
// };

// export default Meeting;
"use client"
import { Box, Button, Typography, Paper, Chip, Tooltip } from "@mui/material"
import { Calendar, dateFnsLocalizer } from "react-big-calendar"
import format from "date-fns/format"
import parse from "date-fns/parse"
import startOfWeek from "date-fns/startOfWeek"
import getDay from "date-fns/getDay"
import { enUS } from "date-fns/locale"
import "react-big-calendar/lib/css/react-big-calendar.css"
import { useState, useEffect, useContext } from "react"
import { userContext } from "../../../context/UserContext"
import { FaCalendarAlt, FaLink } from "react-icons/fa"
import Lottie from "lottie-react";
import { useTheme } from "@mui/material/styles"
import { CalendarMonth, VideoCall, People, Handshake } from "@mui/icons-material"
import successAnimation from "../../../assets/animations/success-animation.json"
import failureAnimation from "../../../assets/animations/failure-animation.json"
import pendingAnimation from "../../../assets/animations/pending-animation.json"
import waitingAnimation from "../../../assets/animations/waiting-animation.json"
import successPersonAnimation from "../../../assets/animations/success-person.json"
import failurePersonAnimation from "../../../assets/animations/failure-person.json"
// import pendingPersonAnimation from "../../../assets/animations/pending-person.json"
import waitingPersonAnimation from "../../../assets/animations/waiting-person.json"
import '../../../ComponentsStyles/CompanyProcess/meetings_user.css'



const locales = { "en-US": enUS }

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
})

const Meeting = ({ phase, clickedColumn, applicationData }) => {
  const { isLight } = useContext(userContext)
  // Initialize state variables with default values
  const [viewDate, setViewDate] = useState(new Date())
  const [view, setView] = useState("month")
  const [eventDate, setEventDate] = useState(new Date())
  const [phaseLink, setPhaseLink] = useState(null)

  // Lottie animation options
  const successOptions = {
    loop: true,
    autoplay: true,
    animationData: successAnimation,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  }

  const failureOptions = {
    loop: true,
    autoplay: true,
    animationData: failureAnimation,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  }

  const pendingOptions = {
    loop: true,
    autoplay: true,
    animationData: pendingAnimation,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  }

  const waitingOptions = {
    loop: true,
    autoplay: true,
    animationData: waitingAnimation,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  }

  // Then, add the new animation options after the existing options
  const successPersonOptions = {
    loop: true,
    autoplay: true,
    animationData: successPersonAnimation,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  }

  const failurePersonOptions = {
    loop: true,
    autoplay: true,
    animationData: failurePersonAnimation,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  }

  // const pendingPersonOptions = {
  //   loop: true,
  //   autoplay: true,
  //   animationData: pendingPersonAnimation,
  //   rendererSettings: {
  //     preserveAspectRatio: "xMidYMid slice",
  //   },
  // }

  const waitingPersonOptions = {
    loop: true,
    autoplay: true,
    animationData: waitingPersonAnimation,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  }

  useEffect(() => {
    if (applicationData) {
      const appStatus = Number.parseInt(applicationData.status) - 1

      const getPhaseData = () => {
        switch (phase) {
          case "Technical Assessment":
            return {
              link: applicationData.assessment_link,
              time: applicationData.assessment_time,
            }
          case "Technical Interview":
            return {
              link: applicationData.interview_link,
              time: applicationData.interview_time,
            }
          case "Hr Interview":
            return { link: applicationData.hr_link, time: applicationData.hr_time }
          case "Offer":
            return {
              link: applicationData.offer_link,
              time: applicationData.offer_time,
            }

          default:
            return { link: null, time: null }
        }
      }

      const { link, time } = getPhaseData()
      setPhaseLink(link)

      // Convert phaseTime to Date format
      const newEventDate = time ? new Date(time) : new Date()
      setEventDate(newEventDate)

      // Automatically focus on the meeting date when phaseTime changes
      setViewDate(newEventDate)
    }
  }, [applicationData, phase])

  if (!applicationData) {
    return (
      <div className={`meeting-empty-state ${isLight ? "light-mode" : "dark-mode"}`}>
        <div className="meeting-animations">
          <div className="meeting-lottie-container">
            <Lottie options={waitingOptions} height={120} width={120} />
          </div>
          <div className="meeting-lottie-container person-animation">
            <Lottie options={waitingPersonOptions} height={120} width={120} />
          </div>
        </div>
        <Typography variant="h6">You didn't apply yet</Typography>
      </div>
    )
  }

  const appStatus = Number.parseInt(applicationData.status) - 1

  // Convert phaseTime to calendar events
  const events = eventDate
    ? [
        {
          title: `${phase} Meeting`,
          start: eventDate,
          end: new Date(eventDate.getTime() + 60 * 60 * 1000), // 1-hour duration
        },
      ]
    : []

  // Highlight the event
  const eventPropGetter = (event) => {
    return {
      className: "meeting-calendar-event",
    }
  }

  // Custom day cell renderer
  const dayPropGetter = (date) => {
    const isEventDay =
      eventDate &&
      date.getDate() === eventDate.getDate() &&
      date.getMonth() === eventDate.getMonth() &&
      date.getFullYear() === eventDate.getFullYear()

    if (isEventDay) {
      return {
        className: "meeting-event-day",
      }
    }
    return {}
  }

  // Add this function after the dayPropGetter function
  const theme = useTheme()
  const isLightMode = theme.palette.mode === "light"

  const getStatusBackground = (status) => {
    switch (status) {
      case "success":
        return {
          backgroundImage: `radial-gradient(circle at 90% 10%, ${isLightMode ? "rgba(16, 185, 129, 0.15)" : "rgba(16, 185, 129, 0.25)"} 0%, transparent 70%)`,
        }
      case "failed":
        return {
          backgroundImage: `radial-gradient(circle at 90% 10%, ${isLightMode ? "rgba(239, 68, 68, 0.15)" : "rgba(239, 68, 68, 0.25)"} 0%, transparent 70%)`,
        }
      case "active":
        return {
          backgroundImage: `radial-gradient(circle at 90% 10%, ${isLightMode ? "rgba(59, 130, 246, 0.15)" : "rgba(59, 130, 246, 0.25)"} 0%, transparent 70%)`,
        }
      case "pending":
        return {
          backgroundImage: `radial-gradient(circle at 90% 10%, ${isLightMode ? "rgba(245, 158, 11, 0.15)" : "rgba(245, 158, 11, 0.25)"} 0%, transparent 70%)`,
        }
      case "waiting":
        return {
          backgroundImage: `radial-gradient(circle at 90% 10%, ${isLightMode ? "rgba(144, 27, 38, 0.15)" : "rgba(215, 50, 62, 0.25)"} 0%, transparent 70%)`,
        }
      default:
        return {}
    }
  }

  // Replace the getPhaseIcon function with this enhanced version
  const getPhaseIcon = () => {
    switch (phase) {
      case "Technical Assessment":
        return <CalendarMonth className="phase-icon" />
      case "Technical Interview":
        return <VideoCall className="phase-icon" />
      case "Hr Interview":
        return <People className="phase-icon" />
      case "Offer":
        return <Handshake className="phase-icon" />
      default:
        return <FaCalendarAlt className="phase-icon" />
    }
  }
  return (
    <div className={`meeting-container ${isLight ? "light-mode" : "dark-mode"}`}>
      <Paper elevation={3} className="meeting-paper">
        <div className="meeting-header">
          {getPhaseIcon()}
          <Typography variant="h4" className="meeting-title">
            {phase === "Technical Assessment" ? "Technical Assessment" : `${phase} Meeting`}
          </Typography>
          <Chip label={`Phase ${clickedColumn + 1}`} className="meeting-phase-chip" />
        </div>

        <div className="meeting-content">
          {appStatus === clickedColumn && applicationData.fail ? (
            <div className="meeting-status failed" style={getStatusBackground("failed")}>
              <div className="meeting-animations">
                <div className="meeting-lottie-container">
                  <Lottie options={failureOptions} height={120} width={120} />
                </div>
                <div className="meeting-lottie-container person-animation">
                  <Lottie options={failurePersonOptions} height={120} width={120} />
                </div>
              </div>
              <div className="meeting-status-message">
                <Typography variant="h5">Unfortunately you have failed this phase</Typography>
                <Typography variant="body1">
                  Don't give up! Every setback is an opportunity to learn and grow. Keep improving your skills and try
                  again.
                </Typography>
              </div>
            </div>
          ) : appStatus === clickedColumn ? (
            <>
              {phaseLink ? (
                <div className="meeting-status active" style={getStatusBackground("active")}>
                  <div className="meeting-animations">
                    <div className="meeting-lottie-container">
                      <Lottie options={pendingOptions} height={120} width={120} />
                    </div>
                    {/* <div className="meeting-lottie-container person-animation">
                      <Lottie options={pendingPersonOptions} height={120} width={120} />
                    </div> */}
                  </div>
                  <div className="meeting-status-message">
                    <Typography variant="h5">Meeting Scheduled</Typography>
                    <Typography variant="body1">
                      Your {phase} is scheduled for{" "}
                      <span className="meeting-highlight">{format(eventDate, "EEEE, MMMM do, yyyy")}</span> at{" "}
                      <span className="meeting-highlight">{format(eventDate, "h:mm a")}</span>
                    </Typography>
                    <Typography variant="body2" className="meeting-tip">
                      Tip: Be prepared and join the meeting 5 minutes early.
                    </Typography>
                  </div>
                </div>
              ) : (
                <div className="meeting-status pending" style={getStatusBackground("pending")}>
                  <div className="meeting-animations">
                    <div className="meeting-lottie-container">
                      <Lottie options={waitingOptions} height={120} width={120} />
                    </div>
                    <div className="meeting-lottie-container person-animation">
                      <Lottie options={waitingPersonOptions} height={120} width={120} />
                    </div>
                  </div>
                  <div className="meeting-status-message">
                    <Typography variant="h5">Waiting for Schedule</Typography>
                    <Typography variant="body1">
                      You qualified to this phase but the meeting isn't assigned yet. We'll notify you once it's
                      scheduled.
                    </Typography>
                  </div>
                </div>
              )}

              {phaseLink && (
                <Box className="meeting-action">
                  <Button
                    variant="contained"
                    color="primary"
                    href={phaseLink}
                    target="_blank"
                    className="meeting-action-button"
                    startIcon={<FaLink />}
                  >
                    Access {phase} Resources
                  </Button>
                </Box>
              )}

              {/* Show Reminder Calendar */}
              {eventDate && (
                <div className="meeting-calendar-section">
                  <div className="meeting-calendar-header">
                    <Typography variant="h6" className="meeting-calendar-title">
                      <FaCalendarAlt className="meeting-calendar-icon" /> Meeting Schedule
                    </Typography>
                    <div className="meeting-view-controls">
                      <Button
                        variant={view === "day" ? "contained" : "outlined"}
                        className={`meeting-view-button ${view === "day" ? "active" : ""}`}
                        onClick={() => setView("day")}
                      >
                        Day View
                      </Button>
                      <Button
                        variant={view === "month" ? "contained" : "outlined"}
                        className={`meeting-view-button ${view === "month" ? "active" : ""}`}
                        onClick={() => setView("month")}
                      >
                        Month View
                      </Button>
                    </div>
                  </div>

                  <div className="meeting-calendar-wrapper">
                    <Calendar
                      localizer={localizer}
                      events={events}
                      startAccessor="start"
                      endAccessor="end"
                      view={view}
                      date={viewDate}
                      onNavigate={(date) => setViewDate(date)}
                      onView={setView}
                      className="meeting-calendar"
                      eventPropGetter={eventPropGetter}
                      dayPropGetter={dayPropGetter}
                      components={{
                        event: (props) => (
                          <Tooltip title={`${props.event.title} - ${format(props.event.start, "h:mm a")}`}>
                            <div className="meeting-event-content">
                              <span>{props.event.title}</span>
                              <span className="meeting-event-time">{format(props.event.start, "h:mm a")}</span>
                            </div>
                          </Tooltip>
                        ),
                      }}
                    />
                  </div>

                  <div className="meeting-time-details">
                    <div className="meeting-time-item">
                      <span className="meeting-time-label">Date:</span>
                      <span className="meeting-time-value">{format(eventDate, "MMMM do, yyyy")}</span>
                    </div>
                    <div className="meeting-time-item">
                      <span className="meeting-time-label">Time:</span>
                      <span className="meeting-time-value">{format(eventDate, "h:mm a")}</span>
                    </div>
                    <div className="meeting-time-item">
                      <span className="meeting-time-label">Duration:</span>
                      <span className="meeting-time-value">1 hour</span>
                    </div>
                  </div>
                </div>
              )}
            </>
          ) : appStatus > clickedColumn ? (
            <div className="meeting-status success" style={getStatusBackground("success")}>
              <div className="meeting-animations">
                <div className="meeting-lottie-container">
                  <Lottie options={successOptions} height={120} width={120} />
                </div>
                <div className="meeting-lottie-container person-animation">
                  <Lottie options={successPersonOptions} height={120} width={120} />
                </div>
              </div>
              <div className="meeting-status-message">
                <Typography variant="h5">Congratulations!</Typography>
                <Typography variant="body1">
                  You have successfully passed this phase. Your hard work and preparation have paid off!
                </Typography>
                <div className="meeting-confetti"></div>
              </div>
            </div>
          ) : (
            <div className="meeting-status waiting" style={getStatusBackground("waiting")}>
              <div className="meeting-animations">
                <div className="meeting-lottie-container">
                  <Lottie options={waitingOptions} height={120} width={120} />
                </div>
                <div className="meeting-lottie-container person-animation">
                  <Lottie options={waitingPersonOptions} height={120} width={120} />
                </div>
              </div>
              <div className="meeting-status-message">
                <Typography variant="h5">Not Available Yet</Typography>
                <Typography variant="body1">
                  You didn't proceed to this phase yet. Complete previous phases to continue your application journey.
                </Typography>
              </div>
            </div>
          )}
        </div>
      </Paper>
    </div>
  )
}

export default Meeting;
