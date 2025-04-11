import { Checkbox, Slider } from "@mui/material";
import ApplicantsTable from "./ApplicantsTable";
import { use, useContext, useState } from "react";
import { set } from "date-fns";
import {
  updateApplicationAts,
  updateApplicationCsv,
} from "../../services/Application";
import { userContext } from "../../context/UserContext";

function ProcessCard({ column, phases }) {
  const [ats, setAts] = useState(50);
  const [fail, setFail] = useState(false);
  const [display, setDisplay] = useState(false);
  const [csvDisplay, setCsvDisplay] = useState(false);
  const [csvFile, setCsvFile] = useState(null);
  const { user } = useContext(userContext);
  const updateAts = async () => {
    if (
      !confirm(
        `Are you sure you want to send applicants with ATS score higher than ${ats}% to next phase?` +
          (fail
            ? `\nThis will also fail applicants with ATS score lower than ${ats}%.`
            : "")
      )
    ) {
      return;
    }
    const data = {
      ats: ats,
      new_status: column + 2,
      fail: fail,
      old_status: column + 1,
      company: user.id,
    };
    const response = await updateApplicationAts(data);
    console.log(response);
    setTimeout(() => {
      alert(response.message);
    }, 1000);
  };
  const updateCsv = async () => {
    if (
      !confirm(
        `Are you sure you want to send applicants in the csv with score higher than ${ats}% to next phase?` +
          (fail
            ? `\nThis will also fail applicants in csv with score lower than ${ats}%.`
            : "")
      )
    ) {
      return;
    }
    const dataForm = new FormData();
    dataForm.append("file", csvFile);
    dataForm.append("success", ats);
    dataForm.append("fail", fail);
    dataForm.append("new_status", column + 2);
    dataForm.append("old_status", column + 1);
    dataForm.append("company", user.id);
    const response = await updateApplicationCsv(dataForm);
    console.log(response);
    setTimeout(() => {
      alert(response.message);
    }, 1000);
  };
  //   const status = [
  //     "Applied",
  //     "Technical Assessment",
  //     "Technical Interview",
  //     "Hr Interview",
  //     "Offer",
  //   ];
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        maxWidth: "inherit",
      }}
    >
      <div style={{ display: "flex", alignItems: "center" }}>
        <h1 style={{ fontSize: "2rem", margin: "1rem" }}>
          {phases[column - 1]}
        </h1>
        {column === 1 && (
          <button
            className="btn btn-primary"
            onClick={() => setDisplay(!display)}
          >
            Filter by ats
          </button>
        )}
        {column != 1 && (
          <button
            className="btn btn-primary"
            onClick={() => setCsvDisplay(!csvDisplay)}
          >
            Filter by CSV file
          </button>
        )}
      </div>
      {column === 1 && display && (
        <div
          style={{
            width: "60%",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            marginBottom: "1rem",
          }}
        >
          <h2 style={{ fontSize: "1.5rem" }}>Next Phase ATS Score</h2>

          <div style={{ display: "flex", alignItems: "center", gap: "5rem" }}>
            <Slider
              defaultValue={50}
              aria-label="Default"
              valueLabelDisplay="auto"
              onChange={(e) => {
                setAts(e.target.value);
              }}
            />
            <div style={{ display: "flex" }}>
              <Checkbox
                checked={fail || false}
                onChange={(e) => setFail(e.target.checked)}
              ></Checkbox>
              <label className="text-sm">Fail applicants under {ats}%</label>
            </div>
          </div>
          <button className="btn btn-primary" onClick={() => updateAts()}>
            Update
          </button>
        </div>
      )}
      {column != 1 && csvDisplay && (
        <div
          style={{
            width: "100%",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            marginBottom: "1rem",
          }}
        >
          <h2 style={{ fontSize: "1.5rem" }}>Next Phase CSV Score</h2>

          <div style={{ display: "flex", alignItems: "center", gap: "2rem", marginBottom: "1rem" }}>
            <Slider
              defaultValue={50}
              aria-label="Default"
              valueLabelDisplay="auto"
              onChange={(e) => {
                setAts(e.target.value);
              }}
            />
            <div style={{ display: "flex" }}>
              <Checkbox
                checked={fail || false}
                onChange={(e) => setFail(e.target.checked)}
              ></Checkbox>
              <label className="text-sm">Fail applicants under {ats}%</label>
            </div>
            <input
              type="file"
              onChange={(e) => {
                setCsvFile(e.target.files[0]);
              }}
              accept=".csv, .xlsx, .xls"
              className="form-control"
            ></input>
          </div>
          <button className="btn btn-primary" onClick={() => updateCsv()}>
            Update
          </button>
        </div>
      )}
      <ApplicantsTable phase={column} />
    </div>
  );
}

export default ProcessCard;
