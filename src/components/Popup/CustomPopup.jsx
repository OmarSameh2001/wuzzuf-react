import CompanySchedule from "./Schedule";
import AnswerBox from "./AnswerBox";
import { GiCancel } from "react-icons/gi";
import { userContext } from "../../context/UserContext";
import { useContext } from "react";
import ContractBox from "./ContractBox";

export default function CustomPopup() {
  const { isLight, update } = useContext(userContext);
  const { answer, contract, phase, handleClose, handleNext, handleFail } = update.settings;

  const PopupPicker = () => {
    if (!update.user?.id) return null;
    
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
          onClick={handleClose}
        ></div>
        <div
          className="position-relative p-4 rounded-4 shadow-lg"
          style={{
            width: "400px",
            maxHeight: "80vh",
            overflowY: "auto",
            backdropFilter: "blur(5px)",
            backgroundColor: isLight ? "#fff" : "#121212",
            height: "fit-content",
          }}
        >
          <h2 className="text-center mb-3" style={{ color: isLight ? "#121212" : "#fff" }}>
            {answer
              ? `${update.user_name} Answers`
              : Number(phase) === 2
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
            }}
            onClick={handleClose}
          />
          <PopupPicker />
        </div>
      </div>
      )}
    </>
  );
}
