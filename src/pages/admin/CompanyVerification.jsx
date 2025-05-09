import { useState, useContext } from "react";
import { Button } from "@mui/material";
import { verifyCompany } from "../../services/Auth";
import { showErrorToast, showSuccessToast } from "../../confirmAlert/toastConfirm";
import { userContext } from "../../context/UserContext";

const CompanyVerification = ({ companyId, onSuccess, buttonProps = {}}) => {
  const { isLight } = useContext(userContext);
  const [status, setStatus] = useState("");
  const token = localStorage.getItem("token");

  const handleVerify = async () => {
    try {
      await verifyCompany(companyId, token);
      setStatus("Company verified successfully ✅");
      showSuccessToast("Company verified successfully ✅", 2000, isLight);
      if (onSuccess) onSuccess();
    } catch (err) {
      setStatus(`Error: Company verification failed`);
      showErrorToast(`Verification failed`, 2000, isLight);
    }
  };

  return (
    <div>
      <Button onClick={handleVerify} {...buttonProps}>Verify Company</Button>
      {status && <p>{status}</p>}
    </div>
  );
};

export default CompanyVerification;
