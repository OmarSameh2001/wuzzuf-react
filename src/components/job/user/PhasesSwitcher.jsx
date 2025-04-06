// import React from "react";
// import ApplicationForm from "../../pages/user/jobs/ApplicationForm";
// import TechnicalInterviewUserJob from "./TechnicalInterviewUserJob";
// import { ButtonGroup, Button } from "@mui/material";

// const PhasesSwitcher =  ({ phase, questions }) => {
//     // Define all the phases and their corresponding components
//     const phaseComponentsMap = {
//         "Applied": ApplicationForm,
//         // "Technical Assessment": TechnicalAssessment,
//         "Technical Interview": TechnicalInterviewUserJob,
//         // "Hr Interview": HRInterview,
//         // "Offer": OfferPhase
//     };

//     // Get the correct component from the map
//     const PhaseComponent = phaseComponentsMap[phase] || (() => <p>Select a phase to proceed</p>);

//     // If it's the ApplicationForm phase, pass the questions prop
//     return (
//         <div style={{ marginTop: "20px", padding: "20px", border: "1px solid #ccc", borderRadius: "8px", boxShadow: "2px 2px 10px rgba(0,0,0,0.1)" }}>
//             {phase === "Applied" ? <PhaseComponent questions={questions} /> : <PhaseComponent />}
//         </div>
//     );
// };

// export default PhasesSwitcher;
import { useNavigate } from "react-router-dom";
import { Button } from "@mui/material";

const PhasesSwitcher = ({ phase }) => {
    const navigate = useNavigate();

    const phaseRoutes = {
        "Applied": "/application-form",
        "Technical Interview": "/technical-interview",
    };

    const goToPhase = () => {
        if (phaseRoutes[phase]) {
            navigate(phaseRoutes[phase]);
        }
    };

    return (
        <Button variant="contained" onClick={goToPhase} sx={{ mt: 2 }}>
            Go to {phase} Page
        </Button>
    );
};

export default PhasesSwitcher;
