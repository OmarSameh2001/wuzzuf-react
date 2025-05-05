import {
  Banknote,
  BanknoteX,
  CalendarDays,
  Clock,
  FileSignature,
  Shield,
} from "lucide-react";
import { userContext } from "../../../context/UserContext";
import { useContext } from "react";
import Lottie from "react-lottie";
import { Box, Button, Typography } from "@mui/material";
import "../../../ComponentsStyles/CompanyProcess/meetings_user.css";
import successAnimation from "../../../assets/animations/success-animation.json";
import successPersonAnimation from "../../../assets/animations/success-person.json";
import waitingAnimation from "../../../assets/animations/waiting-animation.json";
import waitingPersonAnimation from "../../../assets/animations/waiting-person.json";
// import blobStream from "blob-stream";
import { jsPDF } from "jspdf";

const Contract = ({ applicationData, company, clickedColumn }) => {
  const { isLight } = useContext(userContext);
  const successOptions = {
    loop: true,
    autoplay: true,
    animationData: successAnimation,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };
  const successPersonOptions = {
    loop: true,
    autoplay: true,
    animationData: successPersonAnimation,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };
  const waitingOptions = {
    loop: true,
    autoplay: true,
    animationData: waitingAnimation,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };
  const waitingPersonOptions = {
    loop: true,
    autoplay: true,
    animationData: waitingPersonAnimation,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

  // Extract relevant data from applicationData
  const {
    job_details: { title, company_name, attend, type_of_job, company_email },
    user_name,
    salary,
    insurance,
    termination,
  } = applicationData;

  // Calculate termination value
  const terminationValue =
    termination === "0 months"
      ? "N/A"
      : `${termination} (${
          Number.parseInt(termination?.split(" ")[0]) *
          Number.parseInt(salary?.split(" ")[0].replace(/,/g, ""))
        } ${salary?.split(" ")[1]})`;

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        gap: "20px",
        flexDirection: "column",
      }}
    >
      {applicationData.status === '7' ? (
        <>
          <div
            className="meeting-status success"
            style={{
              backgroundImage: `radial-gradient(circle at 90% 10%, ${
                isLight
                  ? "rgba(16, 185, 129, 0.15)"
                  : "rgba(16, 185, 129, 0.25)"
              } 0%, transparent 70%)`,
            }}
          >
            <div className="meeting-animations">
              <div className="meeting-lottie-container">
                <Lottie options={successOptions} height={120} width={120} />
              </div>
              <div className="meeting-lottie-container person-animation">
                <Lottie
                  options={successPersonOptions}
                  height={120}
                  width={120}
                />
              </div>
            </div>
            <div
              className="meeting-status-message"
              style={{ color: isLight ? "#2f3744" : "#fff" }}
            >
              <Typography variant="h5">Congratulations!</Typography>
              <Typography variant="body1">
                You have successfully passed all the phases. Here is a virtual
                representation of your contract.
              </Typography>
              <Typography variant="body1" className="mt-4">
                Check your email for the physical copy.
              </Typography>
            </div>
          </div>
          <div
            className="mx-auto my-8"
            style={{
              maxWidth: "800px",
              backgroundColor: isLight ? "#f5e7c1" : "#242424",
              backgroundSize: "cover",
              backgroundPosition: "center",
              color: isLight ? "black" : "rgb(202, 172, 0)",
              fontFamily: "serif",
              padding: "2rem",
              boxShadow: "6px 6px 12px rgba(0,0,0,0.1)",
              borderRadius: "12px",
              border: "2px solid rgb(202, 172, 0)",
            }}
          >
            {/* Header */}
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold mb-2 tracking-wide">
                {company_name}
              </h1>
              <div className="w-full max-w-xs mx-auto h-px bg-amber-900 mb-4"></div>
              <h2 className="text-xl font-semibold uppercase tracking-widest">
                Employment Contract
              </h2>
              <div className="w-full max-w-xs mx-auto h-px bg-amber-900 mt-4"></div>
            </div>
            {/* Company Environment */}
            <div className="mb-6 text-justify leading-relaxed px-3">
              <p className="indent-8">
                Dear {user_name}, We are pleased to offer you a position at{" "}
                {company_name}, a company known for innovation, inclusivity, and
                fostering professional growth. Our team thrives in a
                collaborative environment with modern tools, flexible work
                policies, and a commitment to employee well-being.
              </p>
            </div>
            {/* Contract Details */}
            <div className="mb-6 px-3">
              <h3 className="text-lg font-semibold mb-3 border-b border-amber-900 pb-1">
                Contract Details:
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <div className="flex items-start gap-2">
                  <FileSignature className="w-5 h-5 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-semibold">Position: {title}</p>
                  </div>
                </div>

                <div className="flex items-start gap-2">
                  <CalendarDays className="w-5 h-5 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-semibold">Attendance: {attend}</p>
                  </div>
                </div>

                <div className="flex items-start gap-2">
                  <Clock />
                  <div>
                    <p className="font-semibold">Type: {type_of_job}</p>
                  </div>
                </div>

                <div className="flex items-start gap-2">
                  <Banknote />
                  <div>
                    <p className="font-semibold">Salary: {salary}</p>
                  </div>
                </div>

                <div className="flex items-start gap-2">
                  <Shield className="w-5 h-5 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-semibold">
                      Insurance Coverage: {insurance}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-2">
                  <BanknoteX />
                  <div>
                    <p className="font-semibold">
                      Termination Clause: {terminationValue}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      ) : (
        <div
          className="meeting-status waiting"
          style={{
            backgroundImage: `radial-gradient(circle at 90% 10%, ${
              isLight ? "rgba(144, 27, 38, 0.15)" : "rgba(215, 50, 62, 0.25)"
            } 0%, transparent 70%)`,
          }}
        >
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
              You didn't proceed to this phase yet. Complete previous phases to
              continue your application journey.
            </Typography>
          </div>
        </div>
      )}
    </div>
  );
};

export default Contract;
