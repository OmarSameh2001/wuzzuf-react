import { Autocomplete, Checkbox, TextField } from "@mui/material";
import { useContext } from "react";
import { userContext } from "../../context/UserContext";
import CheckBoxOutlineBlankIcon from "@mui/icons-material/CheckBoxOutlineBlank";
import CheckBoxIcon from "@mui/icons-material/CheckBox";

const CustomAutoComplete = ({
  setter,
  getter,
  options,
  border,
  value,
  label,
  background,
  multiple,
  direction = "down",
  type,
  required = false,
  error = false,
}) => {
  const { isLight } = useContext(userContext);
  const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
  const checkedIcon = <CheckBoxIcon fontSize="small" />;

  // Ensure getter is always an array when multiple is true
  const currentValue = multiple
    ? Array.isArray(getter)
      ? getter
      : []
    : getter ?? [];
  const placement = direction === "up" ? "top-start" : "bottom-start";

  if (type === "egypt") {
    options = [
      "Abroad (Outside Egypt)",
      "Alexandria",
      "Aswan",
      "Asyut",
      "Beheira",
      "Beni Suef",
      "Cairo",
      "Dakahlia",
      "Damietta",
      "Fayoum",
      "Gharbia",
      "Giza",
      "Ismailia",
      "Kafr El-Sheikh",
      "Luxor",
      "Matrouh",
      "Minya",
      "Monufia",
      "New Valley",
      "North Sinai",
      "Port Said",
      "Qalyubia",
      "Qena",
      "Red Sea",
      "Sharqia",
      "Sohag",
      "South Sinai",
      "Suez",
    ];
  }else if(type === "experience") {
    options = 
    [
      "Intern",
      "Junior",
      "Mid-Level",
      "Senior",
      "Lead",
      "Manager",
  ]
  }else if(!options){
    options = [
      "Game Development",
      "Graphic Design",
      "Embedded Systems",
      "System Administration & Cloud",
      "Cybersecurity",
      "Geographic Information Systems",
      "ERP and CRM Development",
      "Data Science & AI",
      "Web Development",
      "Mobile App Development",
      "UI/UX Design",
      "Software Testing",
    ];
  }
  return (
    <Autocomplete
      multiple={multiple || false}
      options={options || specializationOptions}
      PopperProps={{
        placement: placement,
      }}
      sx={{
        width: "100%",
        "& .MuiOutlinedInput-root": {
          // height: 50,
          // maxHeight: 200,
          borderRadius: 2,
          background: background ? background : isLight ? "#fff" : "#242424",
          color: isLight ? "black" : "white",
          "& fieldset": {
            borderColor: border ? border : isLight ? "#ddd5d6" : "#2a2b2f",
          },
          "&:hover fieldset": {
            borderColor: "#901b20",
          },
        },
        "& .MuiInputLabel-root": {
          color: isLight ? "black" : "white",
        },
        "& .MuiInputBase-input": {
          backgroundColor: background
            ? background
            : isLight
            ? "rgba(255, 255, 255, 0.95)"
            : "#242424",
          color: isLight ? "black" : "white",
          paddingLeft: 1,
        },
        ".css-1umw9bq-MuiSvgIcon-root": {
          color: isLight ? "black" : "white",
        },
        ".MuiAutocomplete-tag": {
          color: isLight ? "black" : "white",
          background: isLight ? null : "#242424",
        },
        "& .MuiAutocomplete-option": {
          backgroundColor: background || "red",
          color: isLight ? "black" : "white",
          "&:hover": {
            backgroundColor: isLight
              ? "rgba(0, 0, 0, 0.04)"
              : "rgba(255, 0, 0, 0.08)",
          },
        },
        "& .MuiAutocomplete-option[aria-selected='true']": {
          backgroundColor: isLight
            ? "rgba(0, 0, 0, 0.08)"
            : "rgba(255, 0, 0, 0.16)",
          "&:hover": {
            backgroundColor: isLight
              ? "rgba(0, 0, 0, 0.12)"
              : "rgba(255, 255, 255, 0.24)",
          },
        },
      }}
      renderOption={(props, option) => (
        <li {...props}>
          {multiple && (
            <Checkbox
              icon={icon}
              checkedIcon={checkedIcon}
              style={{ marginRight: 8 }}
              checked={currentValue.includes(option)}
            />
          )}
          {option}
        </li>
      )}
      renderInput={(params) => (
        <TextField
          {...params}
          label={label || "Specialization"}
          required={required}
          error={error}
          helperText={required ? `${label || label || "Specialization"} is required` : ""}
        />
      )}
      value={currentValue}
      onChange={(event, newInputValue) => {
        {value ? setter((prev) => ({
          ...prev,
          [value]: newInputValue,
        })) : setter(newInputValue)}
      }}
    />
  );
};

export default CustomAutoComplete;
