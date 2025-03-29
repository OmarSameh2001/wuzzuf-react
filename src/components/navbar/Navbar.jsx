import { useState } from "react";
import { Link } from "react-router";

function Navbar() {
    const [isCollapsed, setIsCollapsed] = useState(true);

    const toggleNavbar = () => {
        setIsCollapsed(!isCollapsed);
    };

    return (
        <nav className="navbar navbar-expand-lg navbar-light bg-light">
            <div className="container-fluid">
                <Link className="navbar-brand" to="/">Recruitment Platform</Link>
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
                <div className={`collapse navbar-collapse ${isCollapsed ? '' : 'show'}`} id="navbarSupportedContent">
                    <ul className="navbar-nav me-auto mb-2 mb-lg-0 gap-2">
                        <li className="nav-item">

                            <Link style={{ textDecoration: 'none' }} to="/applicant">Home</Link>
                        </li>
                        <li className="nav-item">
                            <Link style={{ textDecoration: 'none' }} to="/applicant/jobs">Jobs</Link>
                        </li>
                        <li className="nav-item">
                            <Link style={{ textDecoration: 'none' }} to="/applicant/saved">Saved</Link>
                        </li>
                        <li className="nav-item">
                            <Link style={{ textDecoration: 'none' }} to="/applicant/applications">Applications</Link>
                        </li>
                        <li className="nav-item">
                            <Link style={{ textDecoration: 'none' }} to="/company/talents">Talents</Link>
                        </li>
                        <li className="nav-item">
                            <Link style={{ textDecoration: 'none' }} to="/company/jobs">My Jobs</Link>
                        </li>
                        <li className="nav-item">
                            <Link
                                style={{ textDecoration: "none", padding: "10px 20px", background: "#007bff", color: "white", borderRadius: "5px" }}
                                to="/register"
                            >
                                Get Started
                            </Link>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
    );
}

export default Navbar;
