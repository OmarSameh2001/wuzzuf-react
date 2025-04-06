import { Link } from "react-router-dom";
// import React from "react";
import { Box, Button } from "@mui/material";
import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import format from "date-fns/format";
import parse from "date-fns/parse";
import startOfWeek from "date-fns/startOfWeek";
import getDay from "date-fns/getDay";
import { enUS } from "date-fns/locale";
import "react-big-calendar/lib/css/react-big-calendar.css";
import React, { useState, useEffect } from "react";

const locales = { "en-US": enUS };

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

const Meeting = ({ phase, clickedColumn, applicationData }) => {

  if (!applicationData) {
    return <p className="text-danger text-center">You didnt apply yet</p>;
  }
  console.log(applicationData)
  const appStatus = parseInt(applicationData.status) - 1;
  const getPhaseData = () => {
    switch (phase) {
      case "Technical Assessment":
        return { link: applicationData.assessment_link, time: applicationData.assessment_time };
      case "Technical Interview":
        return { link: applicationData.interview_link, time: applicationData.interview_time };
      case "Hr Interview":
        return { link: applicationData.hr_link, time: applicationData.hr_time };
      case "Offer":
        return { link: applicationData.offer_link, time: applicationData.offer_time };
        
      default:
        return { link: null, time: null };
    }
  };

  
 const { link: phaseLink, time: phaseTime } = getPhaseData();

  // Convert phaseTime to Date format
  const eventDate = phaseTime ? new Date(phaseTime) : new Date();

  // State to control the calendar view date
  const [viewDate, setViewDate] = useState(eventDate);
  const [view, setView] = useState("month");
  // Automatically focus on the meeting date when phaseTime changes
  useEffect(() => {
    if (phaseTime) {
      setViewDate(new Date(phaseTime));
    }
  }, [phaseTime]);

  // Convert phaseTime to calendar events
  const events = phaseTime
    ? [
        {
          title: `${phase} Meeting`,
          start: eventDate,
          end: new Date(eventDate.getTime() + 60 * 60 * 1000), // 1-hour duration
        },
      ]
    : [];

  // Highlight the event
  const eventPropGetter = (event) => {
    return {
      style: {
        backgroundColor: "#1976d2", // Primary blue color
        color: "#fff",
        borderRadius: "8px",
        padding: "5px",
      },
    };
  };

 console.log("Application :", appStatus ,clickedColumn);
  return (
    <div>
    <h3>{phase === "Technical Assessment" ? "Technical Assessment" : `${phase} Meeting` }</h3>

    {appStatus >= clickedColumn ? (
      <>
        {/* <p>Status is eligible for this phase.</p> */}
        {/* {console.log(phaseLink)} */}
        {phaseLink ? (
          <Box mt={2}>
            <Button variant="contained" color="primary" href={phaseLink} target="_blank">
              Access {phase} Resources
            </Button>
          </Box>
        ) : (
          <p>No resources available for this phase.</p>
        )}

        {/* Show Reminder Calendar */}
        {phaseTime && (
          <Box mt={3} style={{ height: 500 }}>
          <h4>Meeting Schedule</h4>
          <Button
            variant="outlined"
            color="primary"
            onClick={() => setView("day")}
            style={{ marginRight: "10px" }}
          >
            View by Day
          </Button>
          <Button variant="outlined" color="secondary" onClick={() => setView("month")}>
            View by Month
          </Button>
            <Calendar
                localizer={localizer}
                events={events}
                startAccessor="start"
                endAccessor="end"
                view={view} 
                date={viewDate} 
                onNavigate={(date) => setViewDate(date)} 
                onView={setView} 
                style={{ height: 400 }}
                eventPropGetter={eventPropGetter} 
              />
          </Box>
        )}
      </>
    ) : (
      <p className="text-warning">You cannot proceed to this phase yet.</p>
    )}
  </div>
  );
};

export default Meeting;
