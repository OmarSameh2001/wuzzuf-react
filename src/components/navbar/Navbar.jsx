import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router";
import { userContext } from "../../context/UserContext";
import { logoutUser } from "../../services/Auth";

function Navbar() {
  const [isCollapsed, setIsCollapsed] = useState(true);
  const { user, setUser } = useContext(userContext);
  const navigate = useNavigate();
  const userType = localStorage.getItem("user_type") || "jobseeker";
  const toggleNavbar = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light">
      <div className="container-fluid">
        <Link className="navbar-brand" to="/">
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
                  <Link style={{ textDecoration: "none" }} to="/applicant/jobs">
                    Jobs
                  </Link>
                </li>
                <li className="nav-item">
                  <Link
                    style={{ textDecoration: "none" }}
                    to="/applicant/saved"
                  >
                    Saved
                  </Link>
                </li>
                <li className="nav-item">
                  <Link
                    style={{ textDecoration: "none" }}
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
                    style={{ textDecoration: "none" }}
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
              </>
            )}

            <div
              className="ms-auto d-flex align-items-center gap-2"
              style={{ position: "absolute", right: "0" }}
            >
              {user && Object.keys(user).length !== 0 && (
                <>
                  <li className="nav-item">
                    <button
                      className="btn btn-primary"
                      onClick={() => navigate(`/applicant/profile/${userType}`)}
                    >
                      Profile
                    </button>
                  </li>
                  <li className="nav-item">
                    <button
                      className="btn btn-danger me-2"
                      onClick={() => {
                        if (
                          window.confirm("Are you sure you want to logout?")
                        ) {
                          logoutUser();
                          setUser({});
                          navigate("/");
                        }
                      }}
                    >
                      Logout
                    </button>
                  </li>
                </>
              )}
              {user === null || Object.keys(user).length === 0 ? (
                <li className="nav-item">
                  <Link
                    style={{
                      textDecoration: "none",
                      padding: "10px 20px",
                      background: "#007bff",
                      color: "white",
                      borderRadius: "5px",
                    }}
                    to="/register"
                  >
                    Get Started
                  </Link>
                </li>
              ): null}
            </div>
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
