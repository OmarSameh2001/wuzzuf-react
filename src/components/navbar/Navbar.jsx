import { useState } from "react";
import { Link } from "react-router-dom";
import './Navbar.css';

function Navbar() {
    const [isCollapsed, setIsCollapsed] = useState(true);

    const toggleNavbar = () => {
        setIsCollapsed(!isCollapsed);
    };

    return (
        <nav className="navbar navbar-expand-lg fixed-top custom-navbar">
            <div className="container-fluid">
                <Link className="navbar-brand fw-bold text-white" to="/">Recruitment Platform</Link>
                <button
                    className="navbar-toggler"
                    type="button"
                    onClick={toggleNavbar}
                    aria-controls="navbarNav"
                    aria-expanded={!isCollapsed}
                    aria-label="Toggle navigation"
                >
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className={`collapse navbar-collapse ${isCollapsed ? '' : 'show'}`} id="navbarNav">
                    <ul className="navbar-nav me-auto mb-2 mb-lg-0 gap-3">
                        <li className="nav-item"><Link className="nav-link text-white" to="/applicant">Home</Link></li>
                        <li className="nav-item"><Link className="nav-link text-white" to="/applicant/jobs">Jobs</Link></li>
                        <li className="nav-item"><Link className="nav-link text-white" to="/applicant/saved">Saved</Link></li>
                        <li className="nav-item"><Link className="nav-link text-white" to="/applicant/applications">Applications</Link></li>
                        <li className="nav-item"><Link className="nav-link text-white" to="/company/talents">Talents</Link></li>
                        <li className="nav-item"><Link className="nav-link text-white" to="/company/jobs">My Jobs</Link></li>
                    </ul>
                    <div className="d-flex align-items-center">
                        <Link to="/applicant/profile" className="nav-link text-white">
                            <i className="bi bi-person-circle fs-4"></i>
                        </Link>
                    </div>
                </div>
            </div>
        </nav>
    );
}

export default Navbar;
