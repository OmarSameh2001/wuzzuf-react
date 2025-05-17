import CompanySchedule from "./Schedule";
import AnswerBox from "./AnswerBox";
import { GiCancel } from "react-icons/gi";
import { userContext } from "../../context/UserContext";
import { useContext } from "react";
import ContractBox from "./ContractBox";
import VideoInterview from "./VideoInterview";
import Summary from "./Summary";

export default function CustomPopup() {
  const { isLight, update, setUpdate } = useContext(userContext);
  const { answer, contract, video, summary, phase, handleClose, handleNext, handleFail, refetch } = update.settings;
  // console.log(update)
  const PopupPicker = () => {
    console.log(update)
    if (!update.user?.id) return null;
    console.log(update)
    console.log(update.user.id)
    console.log(update.user)
    
    
    if(contract) return (
      <ContractBox
        applicant={update.user}
        handleClose={handleClose}
      />
    )
    if (answer)
      return (
        <AnswerBox
          applicant={update.user}
          phase={phase}
          next={handleNext}
          fail={handleFail}
        />
      );

    if (video) return (
      <VideoInterview
        application={update.user}
        question_id={update?.user?.job_details?.questions?.find((q) => q.type === "video")?.id || null}
        handleClose={handleClose}
        question={update?.user?.job_details?.questions?.find((q) => q.type === "video")?.text || null}
        refetch={refetch}
      />
    );
    if (summary) return (
      <Summary
        aboutSummary={summary}
        refetch={refetch}
        />
    );
    
    return (
      <CompanySchedule
        applicant={update.user}
        phase={phase}
        handleClose={handleClose}
      />
    );
  };
  
  return (
    <>
      {update?.user?.id && (
        <div
        className="position-fixed top-0 start-0 w-100 h-100 d-flex justify-content-center align-items-center"
        style={{ zIndex: 99 }}
      >
        <div
          className="position-absolute top-0 start-0 w-100 h-100 bg-dark opacity-50"
          style={{ backdropFilter: "blur(10px)" }}
          onClick={()=>video || summary ? null : handleClose() || setUpdate({ user: {}, settings: {} })}
        ></div>
        <div
          className="position-relative p-4 rounded-4 shadow-lg"
          style={{
            width: video ? "90vw" : "400px",
            maxHeight: video ? "100vh" : "80vh",
            overflowY: "auto",
            backdropFilter: "blur(5px)",
            backgroundColor: isLight ? "#fff" : "#121212",
            height: "fit-content",
          }}
        >
          <h2 className="text-center mb-3" style={{ color: isLight ? "#121212" : "#fff", display: video ? "none" : "block" }}>
            {answer
              ? `${update.user_name} Answers`
              : summary ? "Summary and About Comparison" :
              video ? "Video Interview" : Number(phase) === 2
              ? "Assessment Link"
              : Number(phase) === 6 ? "Offer Letter" : "Set Schedule"}
          </h2>
          <GiCancel
            style={{
              position: "absolute",
              top: 20,
              right: 20,
              scale: 2,
              cursor: "pointer",
              color: "red",
              display: video ? "none" : "block",
            }}
            onClick={()=>handleClose() || setUpdate({ user: {}, settings: {} })}
          />
          <PopupPicker />
        </div>
      </div>
      )}
    </>
  );
}
