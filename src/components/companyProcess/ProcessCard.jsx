import { Checkbox, Slider } from "@mui/material";
import ApplicantsTable from "./ApplicantsTable";
import { useContext, useEffect, useState } from "react";
import {
  updateApplicationAts,
  updateApplicationCsv,
} from "../../services/Application";
import {
  ArrowUpRight,
  FileSpreadsheet,
  Filter,
  RefreshCw,
  X,
} from "lucide-react";
import { userContext } from "../../context/UserContext";
import "../../ComponentsStyles/CompanyProcess/process_card.css";
import "../../styles/theme.css";
import {
  showErrorToast,
  showSuccessToast,
  showConfirmToast,
  showInfoToast,
} from "../../confirmAlert/toastConfirm";
import DynamicSwitcher from "./DynamicSwitcher";

function ProcessCard({ column, phases, job }) {
  const [ats, setAts] = useState(50);
  const [screening, setScreening] = useState(50);
  const [combine, setCombine] = useState(false);
  const { isLight } = useContext(userContext);
  const [fail, setFail] = useState(false);
  const [filters, setFilters] = useState(false);
  const [display, setDisplay] = useState(false);
  const [csvDisplay, setCsvDisplay] = useState(false);
  const [csvFile, setCsvFile] = useState(null);
  const [fetch, setFetch] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useContext(userContext);

  const updateAts = async () => {
    showConfirmToast({
      message:
        `Are you sure you want to send applicants with ATS score higher than ${ats}% to next phase?` +
        (fail
          ? `\nThis will also fail applicants with ATS score lower than ${ats}%.`
          : ""),
      onConfirm: async () => {
        // if (ats === 50) {
        //   showInfoToast("Please select a score", 2000, isLight);
        // }
        try {
          setIsLoading(true);
          const data = {
            ats: ats,
            new_status: column + 2,
            fail: fail,
            old_status: column + 1,
            company: user.id,
            job: job.id,
          };
          const response = await updateApplicationAts(data);
          setAts(50);
          setFail(false);
          setFetch(fetch + 1);
          setDisplay(false);
          setIsLoading(false);
          showSuccessToast(response.message, 2000, isLight);
        } catch (error) {
          showErrorToast("Failed to update by ATS", 2000, isLight);
          setIsLoading(false);
        }
      },
      isLight: isLight,
    });
  };
  const updateCsv = async () => {
    showConfirmToast({
      message:
        `Are you sure you want to send applicants in the csv with score higher than ${ats}% to next phase?` +
        (fail
          ? `\nThis will also fail applicants in csv with score lower than ${ats}%.`
          : ""),
      onConfirm: async () => {
        // if (ats === 50) {
        //   showErrorToast(
        //     "Please select a score",2000, isLight
        //   );
        // }
        setIsLoading(true);
        try {
          const dataForm = new FormData();
          dataForm.append("file", csvFile);
          dataForm.append("success", ats);
          dataForm.append("fail", fail);
          dataForm.append("new_status", column + 2);
          dataForm.append("old_status", column + 1);
          dataForm.append("company", user.id);
          dataForm.append("job", job.id);
          const response = await updateApplicationCsv(dataForm);
          setAts(50);
          setFail(false);
          setFetch(fetch + 1);
          setIsLoading(false);
          setCsvDisplay(false);
          showSuccessToast(response.message, 2000, isLight);
        } catch (error) {
          setIsLoading(false);
          showErrorToast("Failed to update by csv", 2000, isLight);
        }
      },
      isLight: isLight,
    });
  };
  //   const status = [
  //     "Applied",
  //     "Technical Assessment",
  //     "Technical Interview",
  //     "Hr Interview",
  //     "Offer",
  //   ];
  // useEffect(() => {
  //   console.log(combine);
  // }, [combine]);
  return (
    <div className={`recruitment-card ${isLight ? "light" : "dark"}`}>
      <div className="phase-header">
        <h1 className="phase-title">{phases[column - 1]}</h1>
        <div className="phase-actions">
          {column === 1 && filters && (
            <button
              className={`action-button ${display ? "active" : ""}`}
              onClick={() => setDisplay(!display)}
            >
              {display ? (
                <>
                  {/* <X size={16} /> */}
                  <span>Hide ATS Filter</span>
                </>
              ) : (
                <>
                  {/* <Filter size={16} /> */}
                  <span>Filter by ATS</span>
                </>
              )}
            </button>
          )}
          {column !== 1 && column !== 6 && filters && (
            <button
              className={`action-button ${csvDisplay ? "active" : ""}`}
              onClick={() => setCsvDisplay(!csvDisplay)}
            >
              {csvDisplay ? (
                <>
                  {/* <X size={16} /> */}
                  <span>Hide CSV Filter</span>
                </>
              ) : (
                <>
                  {/* <FileSpreadsheet size={16} /> */}
                  <span>Filter by CSV</span>
                </>
              )}
            </button>
          )}
        </div>
      </div>

      {column === 1 && filters && display && (
        <div className="filter-container">
          <div className="filter-header">
            <h2 className="filter-title">Next Phase ATS Score</h2>
            {/* {job?.questions?.find((q) => q.type === "video") && <div className="checkbox-container">
              <Checkbox
                checked={combine || false}
                onChange={(e) => setCombine(e.target.checked)}
                sx={{
                  color: "#d43132",
                  "&.Mui-checked": {
                    color: "#d43132",
                  },
                }}
              />
              <label className="checkbox-label">
                Combine ATS and Screening
              </label>
            </div>} */}
            <span className="filter-badge">{ats}%</span>
          </div>

          <div className="filter-controls">
            <div className="slider-container">
              <Slider
                defaultValue={50}
                aria-label="Default"
                valueLabelDisplay="auto"
                onChange={(e) => {
                  setAts(e.target.value);
                }}
                sx={{
                  color: "#d43132",
                  height: 8,
                  "& .MuiSlider-track": {
                    border: "none",
                  },
                  "& .MuiSlider-thumb": {
                    height: 20,
                    width: 20,
                    backgroundColor: "#d43132",
                    "&:hover, &.Mui-focusVisible": {
                      boxShadow: "0px 0px 0px 8px rgba(212, 49, 50, 0.16)",
                    },
                  },
                }}
              />
            </div>
            <div className="checkbox-container">
              <Checkbox
                checked={fail || false}
                onChange={(e) => setFail(e.target.checked)}
                sx={{
                  color: "#d43132",
                  "&.Mui-checked": {
                    color: "#d43132",
                  },
                }}
              />
              <label className="checkbox-label">
                Fail applicants under {ats}%
              </label>
            </div>
          </div>
          {/* {job?.questions?.find((q) => q.type === "video") && <><div className="filter-header">
            <h2 className="filter-title">Next Phase Screening Score</h2>
            <span className="filter-badge">{ats}%</span>
          </div>
          <div className="filter-controls">
            <div className="slider-container">
              <Slider
                defaultValue={50}
                aria-label="Default"
                valueLabelDisplay="auto"
                onChange={(e) => {
                  setScreening(e.target.value);
                }}
                sx={{
                  color: "#d43132",
                  height: 8,
                  "& .MuiSlider-track": {
                    border: "none",
                  },
                  "& .MuiSlider-thumb": {
                    height: 20,
                    width: 20,
                    backgroundColor: "#d43132",
                    "&:hover, &.Mui-focusVisible": {
                      boxShadow: "0px 0px 0px 8px rgba(212, 49, 50, 0.16)",
                    },
                  },
                }}
              />
            </div>
            <div className="checkbox-container">
              <Checkbox
                checked={fail || false}
                onChange={(e) => setFail(e.target.checked)}
                sx={{
                  color: "#d43132",
                  "&.Mui-checked": {
                    color: "#d43132",
                  },
                }}
              />
              <label className="checkbox-label">
                Fail applicants under {ats}%
              </label>
            </div>
          </div></>} */}
          <button
            className="update-button"
            onClick={() => updateAts()}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <RefreshCw className="spin" size={16} />
                <span>Updating...</span>
              </>
            ) : (
              <>
                <ArrowUpRight size={16} />
                <span>Update</span>
              </>
            )}
          </button>
        </div>
      )}

      {column !== 1 && filters && csvDisplay && (
        <div className="filter-container">
          <div className="filter-header">
            <h2 className="filter-title">Next Phase CSV Score</h2>
            <span className="filter-badge">{ats}%</span>
          </div>

          <div className="filter-controls">
            <div className="slider-container">
              <Slider
                defaultValue={50}
                aria-label="Default"
                valueLabelDisplay="auto"
                onChange={(e) => {
                  setAts(e.target.value);
                }}
                sx={{
                  color: "#d43132",
                  height: 8,
                  "& .MuiSlider-track": {
                    border: "none",
                  },
                  "& .MuiSlider-thumb": {
                    height: 20,
                    width: 20,
                    backgroundColor: "#d43132",
                    "&:hover, &.Mui-focusVisible": {
                      boxShadow: "0px 0px 0px 8px rgba(212, 49, 50, 0.16)",
                    },
                  },
                }}
              />
            </div>
            <div className="checkbox-container">
              <Checkbox
                checked={fail || false}
                onChange={(e) => setFail(e.target.checked)}
                sx={{
                  color: "#d43132",
                  "&.Mui-checked": {
                    color: "#d43132",
                  },
                }}
              />
              <label className="checkbox-label">
                Fail applicants under {ats}%
              </label>
            </div>
            <div className="file-input-container">
              <label className="file-input-label">
                <span>Upload CSV File</span>
                <input
                  type="file"
                  onChange={(e) => {
                    setCsvFile(e.target.files[0]);
                  }}
                  accept=".csv, .xlsx, .xls"
                  className="file-input"
                />
              </label>
              {csvFile && (
                <div className="file-name">
                  <FileSpreadsheet size={16} />
                  <span>{csvFile.name}</span>
                </div>
              )}
            </div>
          </div>
          <button
            className="update-button"
            onClick={() => updateCsv()}
            disabled={!csvFile || isLoading}
          >
            {isLoading ? (
              <>
                <RefreshCw className="spin" size={16} />
                <span>Updating...</span>
              </>
            ) : (
              <>
                <ArrowUpRight size={16} />
                <span>Update</span>
              </>
            )}
          </button>
        </div>
      )}

      <ApplicantsTable
        phase={column}
        setFilters={setFilters}
        fetch={fetch}
        job={job}
      />
    </div>
  );
}

export default ProcessCard;
