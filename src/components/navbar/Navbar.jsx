import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { userContext } from "../../context/UserContext";
import { logoutUser } from "../../services/Auth";
import { Avatar, Typography, AppBar, Toolbar, IconButton, Menu, MenuItem, Box, Button } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";

function Navbar() {
  const [isCollapsed, setIsCollapsed] = useState(true);
  const [isProfile, setIsProfile] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [mobileAnchorEl, setMobileAnchorEl] = useState(null);
  const { user, setUser } = useContext(userContext);
  const navigate = useNavigate();

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMobileMenuOpen = (event) => {
    setMobileAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setMobileAnchorEl(null);
  };

  return (
    <AppBar position="static" sx={{ backgroundColor: "#f8f9fa", color: "#901b20", boxShadow: "none" }}>
      <Toolbar sx={{ justifyContent: "space-between" }}>
        {/* Left side - Brand and Navigation */}
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <Typography
            variant="h6"
            component={Link}
            to="/"
            sx={{
              textDecoration: "none",
              color: "#901b20",
              fontWeight: "bold",
              mr: 4
            }}
          >
            Recruitment Platform
          </Typography>

          {/* Desktop Navigation */}
          <Box sx={{ display: { xs: "none", md: "flex" }, gap: 3 }}>
            {user?.user_type?.toLowerCase() === "jobseeker" && (
              <>
                <Button
                  component={Link}
                  to="/applicant/jobs"
                  sx={{ color: "#901b20", textTransform: "none" }}
                >
                  Jobs
                </Button>
                <Button
                  component={Link}
                  to="/applicant/saved"
                  sx={{ color: "#901b20", textTransform: "none" }}
                >
                  Saved
                </Button>
                <Button
                  component={Link}
                  to="/applicant/applications"
                  sx={{ color: "#901b20", textTransform: "none" }}
                >
                  Applications
                </Button>
              </>
            )}
            {user?.user_type?.toLowerCase() === "company" && (
              <>
                <Button
                  component={Link}
                  to="/company/talents"
                  sx={{ color: "#901b20", textTransform: "none" }}
                >
                  Talents
                </Button>
                <Button
                  component={Link}
                  to="/company/jobs"
                  sx={{ color: "#901b20", textTransform: "none" }}
                >
                  My Jobs
                </Button>
              </>
            )}
          </Box>
        </Box>

        {/* Right side - User profile/Login */}
        <Box sx={{ display: "flex", alignItems: "center" }}>
          {user && Object.keys(user).length !== 0 ? (
            <>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <Typography sx={{ display: { xs: "none", sm: "block" } }}>
                  {user?.name}
                </Typography>
                <IconButton
                  onClick={handleProfileMenuOpen}
                  sx={{ p: 0 }}
                >
                  <Avatar
                    src={user?.img}
                    alt="Profile"
                    sx={{ width: 40, height: 40, bgcolor: "#901b20" }}
                  />
                </IconButton>
              </Box>

              {/* Profile Menu */}
              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
                PaperProps={{
                  sx: {
                    mt: 1.5,
                    "& .MuiMenuItem-root": {
                      color: "#901b20",
                      "&:hover": {
                        backgroundColor: "rgba(144, 27, 32, 0.1)"
                      }
                    }
                  }
                }}
              >
                <MenuItem
                  component={Link}
                  to="/applicant/profile"
                  onClick={handleMenuClose}
                >
                  Profile
                </MenuItem>
                <MenuItem
                  onClick={() => {
                    handleMenuClose();
                    if (window.confirm("Are you sure you want to logout?")) {
                      logoutUser();
                      setUser({});
                      navigate("/");
                    }
                  }}
                  sx={{ color: "#901b20" }}
                >
                  Logout
                </MenuItem>
              </Menu>
            </>
          ) : (
            <Button
              component={Link}
              to="/register"
              variant="contained"
              sx={{
                backgroundColor: "#901b20",
                "&:hover": {
                  backgroundColor: "#7a161b"
                }
              }}
            >
              Get Started
            </Button>
          )}

          {/* Mobile menu button */}
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            onClick={handleMobileMenuOpen}
            sx={{ display: { md: "none" }, ml: 2 }}
          >
            <MenuIcon sx={{ color: "#901b20" }} />
          </IconButton>

          {/* Mobile menu */}
          <Menu
            anchorEl={mobileAnchorEl}
            open={Boolean(mobileAnchorEl)}
            onClose={handleMenuClose}
            PaperProps={{
              sx: {
                "& .MuiMenuItem-root": {
                  color: "#901b20",
                  "&:hover": {
                    backgroundColor: "rgba(144, 27, 32, 0.1)"
                  }
                }
              }
            }}
          >
            {user?.user_type?.toLowerCase() === "jobseeker" && (
              <>
                <MenuItem
                  component={Link}
                  to="/applicant/jobs"
                  onClick={handleMenuClose}
                >
                  Jobs
                </MenuItem>
                <MenuItem
                  component={Link}
                  to="/applicant/saved"
                  onClick={handleMenuClose}
                >
                  Saved
                </MenuItem>
                <MenuItem
                  component={Link}
                  to="/applicant/applications"
                  onClick={handleMenuClose}
                >
                  Applications
                </MenuItem>
              </>
            )}
            {user?.user_type?.toLowerCase() === "company" && (
              <>
                <MenuItem
                  component={Link}
                  to="/company/talents"
                  onClick={handleMenuClose}
                >
                  Talents
                </MenuItem>
                <MenuItem
                  component={Link}
                  to="/company/jobs"
                  onClick={handleMenuClose}
                >
                  My Jobs
                </MenuItem>
              </>
            )}
          </Menu>
        </Box>
      </Toolbar>
    </AppBar>
  );
}

export default Navbar;