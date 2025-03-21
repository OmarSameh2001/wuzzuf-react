import { Link, useNavigate } from "react-router-dom";
import { logoutUser } from "../../services/api";
import { useState, useEffect } from "react";
import { getUser } from "../../services/api";


function Navbar() {
    const [isCollapsed, setIsCollapsed] = useState(true);
    const [user, setUser] = useState(null);
    const navigate = useNavigate();
      
    useEffect(() => {
        const fetchUser = async () => {
            try {
              const userData = await getUser();
              setUser(userData);
            } catch (error) {
              console.error("Error fetching user:", error);
            }
          };
      
          if (localStorage.getItem("token")) {
            fetchUser();
          }
    }, []);
      
    const handleLogout = () => {
          logoutUser();
          setUser(null);
          navigate("/login");
    };

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
                <div>
                    {user ? (
                    <>
                        <span>Welcome, {user.name}!</span>
                        <button onClick={handleLogout}>Logout</button>
                    </>
                    ) : (
                    <>
                        <Link to="/login">Login</Link>
                        <br />
                        <Link to="/signup">Signup</Link>
                    </>
                    )}
                </div>
                    <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                        <li className="nav-item">

                            <Link to="/applicant"><a className="nav-link active" aria-current="page">Home</a></Link>
                        </li>
                        <li className="nav-item">
                            <Link to="/applicant/jobs"><a className="nav-link active" aria-current="page">Jobs</a></Link>
                        </li>
                        <li className="nav-item">
                            <Link to="/applicant/saved"><a className="nav-link active" aria-current="page">Saved</a></Link>
                        </li>
                        <li className="nav-item">
                            <Link to="/applicant/applications"><a className="nav-link active" aria-current="page">Applications</a></Link>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
    );
}

export default Navbar;
