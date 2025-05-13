import React, { useContext, useState } from "react";
import { userContext } from "../../context/UserContext";
import Loading from "../../pages/helpers/Loading";
import { Checkbox, FormControlLabel } from "@mui/material";
import { patchUser } from "../../services/Auth";
import { showSuccessToast } from "../../confirmAlert/toastConfirm";

const Summary = ({ aboutSummary, refetch }) => {
  const { user, loading, isLight, setUpdate } = useContext(userContext);
  const [isAbout, setIsAbout] = useState(false);
  const [isSummary, setIsSummary] = useState(false);

  const oldAbout = user.about || "";
  const oldSummary = user.summary || "";
  const newAbout = aboutSummary.about || "";
  const newSummary = aboutSummary.summary || "";

  const handleSubmit = async () => {
    const user = {};
    if (isAbout) {
      user.about = newAbout;
    }
    if (isSummary) {
      user.summary = newSummary;
    }
    await patchUser(user.id, user);
    showSuccessToast("Summary updated successfully", 2000, isLight);
    refetch();
    setUpdate({ user: {}, settings: {} });
  };

  if (loading) return <Loading />;
  return (
    <div>
      <h4>About Comparison</h4>
      <p>Old About:</p>
      <p>{oldAbout}</p>
      <p>New About:</p>
      <p>{newAbout}</p>
      <FormControlLabel
        control={
          <Checkbox
            name="active"
            checked={isAbout}
            onChange={() => setIsAbout(!isAbout)}
            sx={{ cursor: "pointer" }}
          />
        }
        label="Accept new about"
        sx={{ color: isLight ? "#000" : "#fff" }}
      />

      <h4>Summary Comparison</h4>
      <p>Old Summary:</p>
      <p>{oldSummary}</p>
      <p>New Summary:</p>
      <p>{newSummary}</p>
      <FormControlLabel
        control={
          <Checkbox
            name="active"
            checked={isSummary}
            onChange={() => setIsSummary(!isSummary)}
            sx={{ cursor: "pointer" }}
          />
        }
        label="Accept new summary"
        sx={{ color: isLight ? "#000" : "#fff" }}
      />
      <div style={{ display: "flex", flexDirection: "row-reverse", gap:'10px' }}>
        <button
          onClick={handleSubmit}
          className="btn btn-primary"
          disabled={!isAbout && !isSummary}
        >
          Submit
        </button>
        <button
          onClick={() => setUpdate({ user: {}, settings: {} })}
          className="btn btn-danger"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default Summary;
