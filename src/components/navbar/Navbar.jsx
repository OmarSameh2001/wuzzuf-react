import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router";
import { userContext } from "../../context/UserContext";
import { logoutUser } from "../../services/Auth";
import { Avatar, Typography } from "@mui/material";

function Navbar() {
  const [isCollapsed, setIsCollapsed] = useState(true);
  const [isProfile, setIsProfile] = useState(false);
  const { user, setUser } = useContext(userContext);
  const navigate = useNavigate();
  const toggleNavbar = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <nav
      className="navbar navbar-expand-lg navbar-light"
      style={{ backgroundColor: "#dedede", color: "#901b20" }}
    >
      <div className="container-fluid">
        <Link className="navbar-brand" to={"/"} style={{ color: "#901b20" }}>
          Recruitment Platform
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          onClick={toggleNavbar}
          aria-controls="navbarSupportedContent"
          aria-expanded={!isCollapsed}
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div
          className={`collapse navbar-collapse ${isCollapsed ? "" : "show"}`}
          id="navbarSupportedContent"
        >
          <ul className="navbar-nav me-auto mb-2 mb-lg-0 gap-2">
            {user?.user_type?.toLowerCase() === "jobseeker" && (
              <>
                <li className="nav-item">
                  <Link
                    style={{ textDecoration: "none", color: "#901b20" }}
                    to="/applicant/jobs"
                  >
                    Jobs
                  </Link>
                </li>
                <li className="nav-item">
                  <Link
                    style={{ textDecoration: "none", color: "#901b20" }}
                    to="/applicant/saved"
                  >
                    Saved
                  </Link>
                </li>
                <li className="nav-item">
                  <Link
                    style={{ textDecoration: "none", color: "#901b20" }}
                    to="/applicant/applications"
                  >
                    Applications
                  </Link>
                </li>
              </>
            )}
            {user?.user_type?.toLowerCase() === "company" && (
              <>
                <li className="nav-item">
                  <Link
                    style={{ textDecoration: "none", color: "#901b20" }}
                    to="/company/talents"
                  >
                    Talents
                  </Link>
                </li>
                <li className="nav-item">
                  <Link style={{ textDecoration: "none" }} to="/company/jobs">
                    My Jobs
                  </Link>
                </li>
                {/* <li className="nav-item">
                <Link style={{ textDecoration: 'none' }} to="jobCreate">Create Job</Link>
            </li> */}
              </>
            )}

<div
  className="ms-auto d-flex align-items-center gap-2"
  style={{
    position: "absolute",
    right: "10px",
    top: "10px",
    cursor: "pointer",
  }}
  onClick={() => setIsProfile(!isProfile)}
>
  {user && Object.keys(user).length !== 0 ? (
    <>
      {/* Dropdown menu */}
      {isProfile && (
        <div
          style={{
            position: "absolute",
            top: "40px",
            right: "10px",
            backgroundColor: "white",
            boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
            borderRadius: "8px",
            padding: "10px",
            zIndex: 1000,
          }}
        >
          <ul style={{ listStyle: "none", margin: 0, padding: 0 }}>
            <li style={{ padding: "8px 0", cursor: "pointer" }}>
              <Link
                to="/applicant/profile"
                style={{ textDecoration: "none", color: "#901b20" }}
              >
                Profile
              </Link>
            </li>
            <li
              style={{ padding: "8px 0", cursor: "pointer", color: "red" }}
              onClick={(e) => {
                e.stopPropagation();
                if (window.confirm("Are you sure you want to logout?")) {
                  logoutUser();
                  setUser({});
                  navigate("/");
                }
              }}
            >
              Logout
            </li>
          </ul>
        </div>
      )}

      {/* Avatar and Username */}
      <div className="d-flex align-items-center gap-2">
        <Typography>{user?.name}</Typography>
        <Avatar
          src={user?.img}
          alt="Profile"
          sx={{ width: 40, height: 40, backgroundColor: "#901b20" }}
        />
      </div>
    </>
  ) : (
    // When no user is logged in
    <li className="nav-item" style={{ marginTop: "10px" }}>
      <Link
        to="/register"
        style={{
          textDecoration: "none",
          padding: "10px 20px",
          background: "#007bff",
          color: "white",
          borderRadius: "5px",
        }}
      >
        Get Started
      </Link>
    </li>
  )}
</div>

          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
