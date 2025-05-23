import { useContext, useRef, useState,useEffect } from "react";
import { userContext } from "../../context/UserContext";
import {
  GitHub,
  InsertLink,
  LinkedIn,
  
} from "@mui/icons-material"
import '../../ComponentsStyles/CompanyProcess/companyJobBox.css'
const CompanyBox = ({ profileData }) => {
  const { isLight } = useContext(userContext);
  const detailsRef = useRef(null)
  const socialsRef = useRef(null)
  // const textColor = isLight ? "#121212" : "#fff";
  // const style = {
  //   card: {
  //     backgroundColor: isLight ? "#fff" : "#121212",
  //     color: textColor,
  //     padding: "0.5rem",
  //     borderRadius: "0.75rem",
  //     //   margin: "auto",
  //     width: "100%",
  //     maxHeight: "fit-content",
  //     boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
  //   },
  //   button: {
  //     background: "transparent",
  //     border: `2px solid ${textColor}`,
  //     color: textColor,
  //     padding: "0.5rem 1rem",
  //     borderRadius: "0.5rem",
  //     cursor: "pointer",
  //     transition: "background 0.3s, color 0.3s",
  //   },
  //   icon: { fill: textColor, width: "24px", height: "24px" },
  // };
   // Details to display
  const detailFields = ["industry", "location", "phone", "est", "about"]
  // Helper function to format label
  const formatLabel = (label) => {
    return label.charAt(0).toUpperCase() + label.slice(1)
  }
  useEffect(() => {
    if (detailsRef.current) {
      const detailItems = detailsRef.current.querySelectorAll(".detail-item")
      detailItems.forEach((item, index) => {
        item.style.setProperty("--index", index)
      })
    }

    if (socialsRef.current) {
      const socialLinks = socialsRef.current.querySelectorAll(".social-link")
      socialLinks.forEach((link, index) => {
        link.style.setProperty("--index", index)
      })
    }
  }, [profileData])
  // return (
  //   <div style={style.card} className="mt-2 rounded-lg p-4">
  //       <div>
  //         <h1 style={{ fontSize: "1.5rem", fontWeight: "bold", color: textColor }}>
  //           About {profileData?.name}
  //         </h1>
  //         {/* <p style={{ fontSize: "1rem", color: textColor }}>{profileData?.est}</p> */}
  //       </div>
        
  //       {Object.keys(profileData?.accounts || {}).length > 0 && <div className="flex items-center gap-2">
  //         <div className="flex items-center gap-1">
  //           <span style={{ fontSize: "1rem", color: textColor }}>Follow us on:</span>
  //           {Object.keys(profileData?.accounts || {}).map((type) => (
  //             <a
  //               key={type}
  //               href={profileData.accounts[type]}
  //               target="_blank"
  //               rel="noopener noreferrer"
  //               className="company-social-link"
  //               title={type}
  //             >
  //               {type === "linkedin" && <LinkedIn />}
  //               {type === "github" && <GitHub />}
  //               {type === "personal website" && <InsertLink />}
  //               {type === "leetcode" && <SiLeetcode />}
  //             </a>
  //           ))}
  //         </div>
  //       </div>}
  //     <div className="mt-4">
  //       <h2 style={{ fontSize: "1.25rem",color: textColor }}>Company Profile</h2>
  //       {["industry", "location", "phone", "est", "about"].map((label, i) =>
  //         profileData?.[label] ? (
  //           <div key={i} className="mt-2">
  //             <span style={{ fontSize: "1rem" }}>
  //               {label.charAt(0).toUpperCase() + label.slice(1)}:{" "}
  //             </span>
  //             <span style={{ fontSize: "1rem" }}>{profileData[label]}</span>
  //           </div>
  //         ) : null
  //       )}
  //     </div>
  //   </div>
  // );
  
  return (
    <div className={`company-box ${isLight ? "light-mode" : "dark-mode"}`}>
      <div className="company-box-header">
        <h2 className="company-box-title">About {profileData?.name}</h2>
      </div>

      <div className="company-box-content">
        {Object.keys(profileData?.accounts || {}).length > 0 && (
          <div className="social-links" ref={socialsRef}>
            <span className="social-links-label">Follow us on:</span>
            {Object.keys(profileData?.accounts || {}).map((type) => (
              <a
                key={type}
                href={profileData.accounts[type] || null}
                target="_blank"
                rel="noopener noreferrer"
                className="social-link"
                title={type}
                style={{display: type === "linkedin" || type === "github" || type === "website" || type === "leetcode" ? "flex" : "none"}}
              >
                {type === "linkedin" && <LinkedIn />}
                {type === "github" && <GitHub />}
                {type === "website" && <InsertLink />}
                {type === "leetcode" && <SiLeetcode />}
              </a>
            ))}
          </div>
        )}

        <div className="company-details" ref={detailsRef}>
          <h3 className="section-title">Company Profile</h3>

          {detailFields.map((field) =>
            profileData?.[field] ? (
              <div key={field} className="detail-item">
                <span className="detail-label">{formatLabel(field)}</span>
                <span className="detail-value">{profileData[field]}</span>
              </div>
            ) : null,
          )}

          {detailFields.every((field) => !profileData?.[field]) && <p>No company details available</p>}
        </div>
      </div>
    </div>
  )
};

export default CompanyBox;
