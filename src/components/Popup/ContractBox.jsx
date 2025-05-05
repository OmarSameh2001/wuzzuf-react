import {
  Box,
  Button,
  Checkbox,
  FormControl,
  FormControlLabel,
  TextField,
  Typography,
} from "@mui/material";
import { useContext, useState } from "react";
import CustomAutoComplete from "../autoComplete/CustomAutoComplete";
import { showConfirmToast, showErrorToast, showSuccessToast } from "../../confirmAlert/toastConfirm";
import { CheckBox } from "@mui/icons-material";
import { userContext } from "../../context/UserContext";
import { setContract } from "../../services/Application";
const ContractBox = ({ applicant, handleClose }) => {
  const [salary, setSalary] = useState(applicant?.salary?.split(" ")[0] || 0);
  const [currency, setCurrency] = useState(applicant?.salary?.split(" ")[1] || "EGP");
  const [termination, setTermination] = useState(applicant?.termination || "1 month");
  const [pension, setPension] = useState(applicant?.insurance?.includes("Pension"));
  const [health, setHealth] = useState(applicant?.insurance?.includes("Health"));
  const { isLight } = useContext(userContext);

  const handleSalary = async () => {
    const insurance = `${pension ? "Pension" : ""}${
      pension && health ? ", " : ""
    }${health ? "Health" : ""}`;

    try {
      const response = await setContract(applicant.id, {
        salary: salary + " " + currency,
        termination,
        insurance: insurance,
      });
      showSuccessToast("Contract set successfully.\n Email will be sent to the applicant.", 2000, isLight);
      handleClose();
    } catch (err) {
      showErrorToast("Failed to set contract", 2000, isLight);
    }
  };
  const handleChange = (e) => {
    try {
      let input = e.target.value.replace(/,/g, "");
      if (input === "") {
        setSalary(0);
        return;
      }

      if (!/^\d+(\.\d{0,2})?$/.test(input)) {
        return;
      }

      const value = parseFloat(input);
      if (isNaN(value)) {
        return;
      }

      const formattedValue = new Intl.NumberFormat().format(value);
      setSalary(formattedValue);
    } catch (error) {
      console.log(error);
    }
  };

  const handleSubmit = () => {
    showConfirmToast({
      message: `Are you sure you want to send this offer? \n This will send an email to ${applicant.user_name}`,
      onConfirm: handleSalary,
      isLight: isLight,
    });
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
      <Typography variant="h6">Contract {applicant.name}</Typography>
      <TextField
        label="Contract"
        value={salary}
        onChange={(e) => handleChange(e)}
      />
      <CustomAutoComplete
        getter={currency}
        setter={setCurrency}
        options={["EGP", "USD", "EUR", "GBP", "SAR", "AED"]}
        label={"Currency"}
      />
      <CustomAutoComplete
        getter={termination}
        setter={setTermination}
        options={[0, 1, 2, 3, 4, 5, 6].map((month) =>
          month === 1 ? "1 month" : `${month} months`
        )}
        label={"Termination Clause"}
      />
      <FormControl>
        <FormControlLabel
          control={
            <Checkbox
              checked={pension || false}
              onChange={(e) => setPension(!pension)}
              name="pension"
            />
          }
          label="Pension Insurance (Retirement)"
        />
        <FormControlLabel
          control={
            <Checkbox
              checked={health || false}
              onChange={(e) => setHealth(!health)}
              name="health"
            />
          }
          label="Health Insurance"
        />
      </FormControl>
      <Button
        variant="contained"
        onClick={handleSubmit}
        disabled={!salary || !currency}
      >
        Submit
      </Button>
    </Box>
  );
};

export default ContractBox;
