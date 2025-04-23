import React, { useState, useEffect } from "react";
import {
  TextField,
  Button,
  Typography,
  useMediaQuery,
  Dialog,
  Slide,
  DialogContent,
  IconButton,
  AppBar,
  Toolbar,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import axios from "axios";
import { toast } from "react-hot-toast";
import { showConfirmToast } from "../../confirmAlert/toastConfirm";
//import { useMediaQuery } from "@mui/material";
import "../../ComponentsStyles/companyProcess/schedule.css";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Dialog {...props} ref={ref} TransitionComponent={Transition} />;
});

const CompanySchedule = ({ applicant, phase, handleClose }) => {
  const [selectedDateTime, setSelectedDateTime] = useState(null);
  const [meetingLink, setMeetingLink] = useState("");
  const [loading, setLoading] = useState(false);
  console.log(phase)
  const isMobile = useMediaQuery("(max-width:768px)");
  // Populate state with applicant's existing interview details
  useEffect(() => {
    if (phase === 3) {
      setSelectedDateTime(
        applicant.interview_time ? dayjs(applicant.interview_time) : null
      );
      setMeetingLink(applicant.interview_link || "");
    } else if (phase === 4) {
      setSelectedDateTime(applicant.hr_time ? dayjs(applicant.hr_time) : null);
      setMeetingLink(applicant.hr_link || "");
    } else if (phase === 2) {
      setMeetingLink(applicant.assessment_link || "");
    } else if (phase === 5) {
      setSelectedDateTime(applicant.offer_time ? dayjs(applicant.offer_time) : null);
      setMeetingLink(applicant.offer_link || "");
    } 
  }, [applicant, phase]);

  // Handle form submission
  const handleSubmit = async () => {
    if (!selectedDateTime || !meetingLink) {
      toast.error("Please fill in all fields: date & time, and meeting link.");
      return;
    }
    try {
      setLoading(true);

      const updateData = {
        interview_time: dayjs(selectedDateTime).format("YYYY-MM-DD HH:mm"),
        interview_link: meetingLink,
        phase,
      };
      // if (phase === 3) {
      //   updateData.interview_link = meetingLink;
      //   updateData.interview_time =
      //     dayjs(selectedDateTime).format("YYYY-MM-DD HH:mm");
      // } else if (phase === 4) {
      //   updateData.hr_link = meetingLink;
      //   updateData.hr_time = dayjs(selectedDateTime).format("YYYY-MM-DD HH:mm");
      // } else if (phase === 5) {
      //   updateData.offer_link = meetingLink;
      //   updateData.offer_time = dayjs(selectedDateTime).format("YYYY-MM-DD HH:mm");
      // }
      console.log(updateData)
      const response = await axios.patch(
        `http://127.0.0.1:8000/applications/${applicant.id}/schedule_interview/`,
        updateData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      console.log("Update successful:", response.data);
      toast.success(
        `Interview scheduled for ${applicant.user_name} on ${dayjs(
          selectedDateTime
        ).format("YYYY-MM-DD HH:mm")}.\nMeeting Link: ${meetingLink}`
      );
      handleClose();
    } catch (error) {
      console.error("Error updating interview details:", error);
      toast.error("Failed to schedule interview. Please try again.");
    } finally {
      setLoading(false);
    }
  };
  const handleAssessment = async () => {
    if (!meetingLink) {
      toast.error("Assessment link is required.");
      return;
    }
    try {
      setLoading(true);

      const response = await axios.patch(
        `http://127.0.0.1:8000/applications/${applicant.id}/set_assessment_link/`,
        { assessment_link: meetingLink },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      console.log("Assessment link updated successfully:", response.data);
      toast.success("Assessment link updated successfully.");
      handleClose();
    } catch (error) {
      console.error("Error updating assessment link:", error);
      toast.error("Failed to update assessment link. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const content = (
    <div className="schedule-container fade-in">
      <Typography variant="h6" className="applicant-name">
        <strong>{phase !== 2 ? "Schedule Interview" : "Assign Assessment"} for:</strong> {applicant.user_name || "Applicant"}
      </Typography>

      {phase !== 2 && (
        <div className="datetime-section">
          <Typography variant="h6" className="section-title">
            Select Date & Time:
          </Typography>
          <DateTimePicker
            label="Pick a Date & Time"
            value={selectedDateTime}
            onChange={setSelectedDateTime}
            sx={{ width: "100%" }}
          />
        </div>
      )}

      <div className="link-section">
        <Typography variant="h6" className="section-title">
          {phase !== 2 ? "Meeting Link:" : "Assessment Link:"}
        </Typography>
        <TextField
          fullWidth
          value={meetingLink}
          onChange={(e) => setMeetingLink(e.target.value)}
          placeholder={phase === 2 ? "Enter assessment link" : "Enter meeting link (e.g., Zoom, Google Meet)"}
        />
      </div>

      <Button
        variant="contained"
        fullWidth
        onClick={phase === 2 ? handleAssessment : handleSubmit}
        disabled={loading}
        className="submit-button"
      >
        {loading ? "Processing..." : phase === 2 ? "Assign Assessment" : "Schedule Interview"}
      </Button>
    </div>
  );

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      {isMobile ? (
        <Dialog open onClose={handleClose} fullScreen TransitionComponent={Transition}>
          <AppBar sx={{ position: 'relative' }}>
            <Toolbar>
              <IconButton edge="start" color="inherit" onClick={handleClose} aria-label="close">
                <CloseIcon />
              </IconButton>
              <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
                {phase !== 2 ? "Schedule Interview" : "Assign Assessment"}
              </Typography>
            </Toolbar>
          </AppBar>
          <DialogContent>
            {content}
          </DialogContent>
        </Dialog>
      ) : (
        content
      )}
    </LocalizationProvider>
  );
    // <LocalizationProvider dateAdapter={AdapterDayjs}>
    //   <div
    //     style={{
    //       padding: 20,
    //       maxWidth: 600,
    //       margin: "auto",
    //       textAlign: "left",
    //       // display: phase != 3 && phase != 4 ? "none" : "initial",
    //     }}
    //   >
    //     {/* Applicant Name Input */}
    //     <Typography variant="h6" gutterBottom>
    //       <strong>
    //         {phase != 2 ? "Schedule Interview" : "Assign Assessment"} for:
    //       </strong>{" "}
    //       {applicant.user_name || null}
    //     </Typography>

    //     {/* Date & Time Picker */}
    //     {/* {console.log(phase === 2)} */}
    //     {phase != 2 && (
    //       <>
    //         <Typography variant="h6" gutterBottom>
    //           Select Date & Time:
    //         </Typography>
    //         <DateTimePicker
    //           label="Pick a Date & Time"
    //           value={selectedDateTime}
    //           onChange={setSelectedDateTime}
    //           renderInput={(params) => <TextField {...params} fullWidth />}
    //         />
    //       </>
    //     )}

    //     {/* Meeting Link Input */}
    //     <Typography variant="h6" gutterBottom>
    //       {phase != 2 ? "Meeting Link:" : "Assessment Link:"}
    //     </Typography>
    //     <TextField
    //       fullWidth
    //       value={meetingLink}
    //       onChange={(e) => setMeetingLink(e.target.value)}
    //       placeholder={phase === 2 ? "Enter assessment link" : "Enter meeting link (e.g., Zoom, Google Meet)"}
    //     />

    //     {/* Submit Button */}
    //     <Button
    //       variant="contained"
    //       color="primary"
    //       fullWidth
    //       onClick={(event) => {
    //         if (phase === 2) {
    //           handleAssessment(event);
    //         } else {
    //           handleSubmit(event);
    //         }
    //       }}
    //       disabled={loading}
    //     >
    //       {loading ? "Scheduling..." : phase === 2 ? "Assign Assessment" : "Schedule Interview"}
    //     </Button>
    //   </div>
    // </LocalizationProvider>
  // );
};

export default CompanySchedule;
