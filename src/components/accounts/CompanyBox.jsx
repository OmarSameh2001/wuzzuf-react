import { useContext } from "react";
import { userContext } from "../../context/UserContext";
import {
  GitHub,
  InsertLink,
  LinkedIn,
} from "@mui/icons-material"
const CompanyBox = ({ profileData }) => {
  const { isLight } = useContext(userContext);
  const textColor = isLight ? "#121212" : "#fff";
  const style = {
    card: {
      backgroundColor: isLight ? "#fff" : "#121212",
      color: textColor,
      padding: "0.5rem",
      borderRadius: "0.75rem",
      //   margin: "auto",
      width: "100%",
      maxHeight: "fit-content",
      boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
    },
    button: {
      background: "transparent",
      border: `2px solid ${textColor}`,
      color: textColor,
      padding: "0.5rem 1rem",
      borderRadius: "0.5rem",
      cursor: "pointer",
      transition: "background 0.3s, color 0.3s",
    },
    icon: { fill: textColor, width: "24px", height: "24px" },
  };


  return (
    <div style={style.card} className="mt-2 rounded-lg p-4">
        <div>
          <h1 style={{ fontSize: "1.5rem", fontWeight: "bold", color: textColor }}>
            About {profileData?.name}
          </h1>
          {/* <p style={{ fontSize: "1rem", color: textColor }}>{profileData?.est}</p> */}
        </div>
        
        {Object.keys(profileData?.accounts || {}).length > 0 && <div className="flex items-center gap-2">
          <div className="flex items-center gap-1">
            <span style={{ fontSize: "1rem", color: textColor }}>Follow us on:</span>
            {Object.keys(profileData?.accounts || {}).map((type) => (
              <a
                key={type}
                href={profileData.accounts[type]}
                target="_blank"
                rel="noopener noreferrer"
                className="company-social-link"
                title={type}
              >
                {type === "linkedin" && <LinkedIn />}
                {type === "github" && <GitHub />}
                {type === "website" && <InsertLink />}
                {type === "leetcode" && <SiLeetcode />}
              </a>
            ))}
          </div>
        </div>}
      {["industry", "location", "phone", "est", "about"].some((key) => profileData?.[key]) && <div className="mt-4">
        <h2 style={{ fontSize: "1.25rem",color: textColor }}>Company Profile</h2>
        {["industry", "location", "phone", "est", "about"].map((label, i) =>
          profileData?.[label] ? (
            <div key={i} className="mt-2">
              <span style={{ fontSize: "1rem" }}>
                {label.charAt(0).toUpperCase() + label.slice(1)}:{" "}
              </span>
              <span style={{ fontSize: "1rem" }}>{profileData[label]}</span>
            </div>
          ) : null
        )}
      </div>}
    </div>
  );
};

export default CompanyBox;
