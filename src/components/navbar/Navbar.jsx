import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { userContext } from "../../context/UserContext";
import { logoutUser } from "../../services/Auth";
import { NavLink as RouterNavLink } from "react-router-dom";
import logo from '../../assets/logo.png';
import {
  Avatar,
  Typography,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Divider,
  Box,
  Slide,
  Button,
  Container,
  Badge,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import NotificationsNoneIcon from "@mui/icons-material/NotificationsNone";
import DynamicSwitcher from "../companyProcess/DynamicSwitcher";
import { MdSunny } from "react-icons/md";
import {
  showConfirmToast,
  showSuccessToast,
} from "../../confirmAlert/toastConfirm";

function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [hover, setHover] = useState(false);
  const { user, setUser, setToken, isLight, setIsLight } =
    useContext(userContext);
  const navigate = useNavigate();

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleProfileToggle = () => {
    setIsProfileOpen(!isProfileOpen);
  };
  const handleProfile = () => {
    setIsProfileOpen(false);
    navigate(
      user?.user_type?.toLowerCase() === "company"
        ? "/company/profile"
        : user?.user_type?.toLowerCase() === "admin"
        ? "/admin/itians"
        : "/applicant/profile"
    );
  };

  const handleSidebar = (path) => {
    setMobileOpen(false);
    navigate(path);
  };

  const handleLogout = (e) => {
    e.stopPropagation();
    showConfirmToast({
      title: "Logout Confirmation",
      message: "Are you sure you want to logout?",
      onConfirm: () => {
        logoutUser();
        setUser({});
        setToken(null);
        setIsProfileOpen(false);
        showSuccessToast("Successfully logged out!", 2000, isLight);
        setMobileOpen(false);
        navigate("/", { replace: true });
      },
      isLight: isLight,
    });
  }; //rgb(0, 0, 0)
  // Custom color palette based on #882024
  const theme = {
    primary: isLight ? "#882024" : "#a83236",
    primaryLight: isLight ? "#a83236" : "#882024",
    primaryDark: "#6c1519",
    secondary: "#f5f5f5",
    textPrimary: isLight ? "#2d2d2d" : "#a83236",
    textSecondary: isLight ? "#555555" : "#a83236",
    background: isLight ? "#ffffff" : "rgb(0, 0, 0)",
    divider: isLight ? "#e0e0e0" : "#a83236",
  };
  // Custom NavLink component for desktop
  const NavLink = ({ to, text }) => (
    <RouterNavLink
      to={to}
      style={({ isActive }) => ({
        textDecoration: "none",
      })}
    >
      {({ isActive }) => (
        <Box
          sx={{
            px: 2,
            py: 1.5,
            borderRadius: "6px",
            backgroundColor: isActive
              ? isLight
                ? "rgba(136, 32, 36, 0.15)"
                : "rgba(255, 0, 0, 0.15)"
              : "transparent",
            transition: "all 0.2s ease",
            "&:hover": {
              backgroundColor: isLight
                ? "rgba(136, 32, 36, 0.05)"
                : "rgba(255, 0, 0, 0.05)",
              "& .nav-text": {
                color: isLight ? "#882024" : "#ff0000",
                fontWeight: 600,
              },
            },
          }}
        >
          <Typography
            className="nav-text"
            variant="body1"
            sx={{
              fontWeight: isActive ? 600 : 500,
              color: isActive
                ? isLight
                  ? "#882024"
                  : "#ff0000"
                : theme.textSecondary,
              transition: "all 0.2s ease",
            }}
          >
            {text}
          </Typography>
        </Box>
      )}
    </RouterNavLink>
  );

  // Custom NavDrawerItem component
  const NavDrawerItem = ({ to, text, icon }) => (
    <ListItem
      // button
      // component={Link}
      // to={to}
      onClick={() => handleSidebar(to)}
      sx={{
        borderRadius: "8px",
        cursor: "pointer",
        mb: 0.5,
        "&:hover": {
          backgroundColor: "rgba(136, 32, 36, 0.05)",
          "& .drawer-text": {
            color: "#882024",
            fontWeight: 600,
          },
        },
      }}
    >
      <Typography variant="body1" sx={{ mr: 1.5 }}>
        {icon}
      </Typography>
      <ListItemText
        primary={text}
        primaryTypographyProps={{
          className: "drawer-text",
          color: theme.textPrimary,
          fontWeight: 500,
        }}
      />
    </ListItem>
  );

  const drawer = (
    <Box
      sx={{
        width: 300,
        height: "100%",
        backgroundColor: theme.background,
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          p: 3,
          borderBottom: `1px solid ${theme.divider}`,
        }}
      >
        <Typography
          variant="h6"
          sx={{
            fontWeight: 700,
            color: theme.primary,
            letterSpacing: "-0.5px",
          }}
        >
          RecruitHub
        </Typography>
        <IconButton
          onClick={handleDrawerToggle}
          sx={{
            color: theme.textPrimary,
          }}
        >
          <CloseIcon />
        </IconButton>
      </Box>

      <Box sx={{ flexGrow: 1, p: 2 }}>
        <List sx={{ py: 0 }}>
          {user?.user_type?.toLowerCase() === "jobseeker" && (
            <>
              <NavDrawerItem
                to="/applicant/recommended"
                text="Recommended"
                icon="📌"
              />
              <NavDrawerItem to="/applicant/jobs" text="Jobs" icon="💼" />
              <NavDrawerItem to="/applicant/saved" text="Saved" icon="🔖" />
              <NavDrawerItem
                to="/applicant/applications"
                text="Applications"
                icon="📩"
              />
            </>
          )}
          {user?.user_type?.toLowerCase() === "company" && (
            <>
              <NavDrawerItem to="/company/talents" text="Talents" icon="👥" />
              <NavDrawerItem to="/company/jobs" text="My Jobs" icon="🏢" />
              {/* <NavDrawerItem to="/company/jobs/jobsDashboard" text="Job Dashboard" icon="📊" /> */}
            </>
          )}
          {user?.user_type?.toLowerCase() === "admin" && (
            <>
              {/* <NavLink to="/admin/users" text="Manage Users" /> */}
              <NavDrawerItem to="/admin/itians" text="Manage Itians" />
              <NavDrawerItem to="/admin/companies" text="Manage Companies" />
              <NavDrawerItem to="/admin/rag" text="Manage Rag files" />
            </>
          )}
        </List>
      </Box>

      {user ? (
        <Box sx={{ p: 2, borderTop: `1px solid ${theme.divider}` }}>
          <Button
            fullWidth
            variant="outlined"
            onClick={handleLogout}
            sx={{
              py: 1.5,
              borderRadius: "8px",
              borderColor: theme.divider,
              color: theme.textPrimary,
              "&:hover": {
                borderColor: theme.primary,
                backgroundColor: "rgba(136, 32, 36, 0.04)",
              },
            }}
          >
            Sign Out
          </Button>
        </Box>
      ) : (
        <Box sx={{ p: 2, borderTop: `1px solid ${theme.divider}` }}>
          <Button
            component={Link}
            to="/register"
            fullWidth
            variant="contained"
            sx={{
              py: 1.5,
              borderRadius: "8px",
              backgroundColor: theme.primary,
              "&:hover": {
                backgroundColor: theme.primaryLight,
                boxShadow: "0 4px 12px rgba(136, 32, 36, 0.2)",
              },
            }}
          >
            Get Started
          </Button>
          <Button
            component={Link}
            to="/login"
            fullWidth
            sx={{
              mt: 1.5,
              py: 1.5,
              borderRadius: "8px",
              color: theme.primary,
              "&:hover": {
                backgroundColor: "rgba(136, 32, 36, 0.04)",
              },
            }}
          >
            Already have an account? Sign In
          </Button>
        </Box>
      )}
    </Box>
  );

  return (
    <>
      <Box
        component="nav"
        sx={{
          backgroundColor: theme.background,
          boxShadow: "0 2px 10px rgba(0,0,0,0.08)",
          // position: "relative",
          zIndex: 98,
          height: "90px", // Or increase padding instead
          alignItems: "center", // Ensure vertical alignment of children
          py: 1, // optional horizontal padding
          position: "sticky", // Make the navbar sticky
          top: 0, 
        }}
      >
        <Container maxWidth="xl">
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              height: "72px",
            }}
          >
            {/* Logo/Brand */}
            <Box sx={{ display: "flex", alignItems: "center", gap: 4 }}>
            <img
              src={logo}
              alt="Logo"
              onClick={() => navigate("/")}
              style={{ height: '130px', marginRight: '8px', cursor: 'pointer' }} // adjust as needed
            />

              {/* Desktop Navigation */}
              <Box sx={{ display: { xs: "none", lg: "flex" }, gap: 1 }}>
                {user?.user_type?.toLowerCase() === "jobseeker" && (
                  <>
                    <NavLink to="/applicant/recommended" text="Recommended" />
                    <NavLink to="/applicant/jobs" text="Jobs" />
                    <NavLink to="/applicant/saved" text="Saved" />
                    <NavLink to="/applicant/applications" text="Applications" />
                  </>
                )}
                {user?.user_type?.toLowerCase() === "company" && (
                  <>
                    <NavLink to="/company/talents" text="Talents" />
                    <NavLink to="/company/jobs" text="My Jobs" />
                    {/* <NavLink to="/company/jobs/jobsDashboard" text="Job Dashboard"/> */}
                  </>
                )}
                {user?.user_type?.toLowerCase() === "admin" && (
                  <>
                    {/* <NavLink to="/admin/users" text="Manage Users" /> */}
                    <NavLink to="/admin/itians" text="Manage Itians" />
                    <NavLink to="/admin/companies" text="Manage Companies" />
                    <NavLink to="/admin/rag" text="Manage Rag Files" />
                    <NavLink to="/admin/iti-info" text="Manage ITI Info" />

                  </>
                )}
              </Box>
            </Box>

            {/* User/Auth Section */}
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <MdSunny
                onClick={() => setIsLight(!isLight)}
                style={{
                  color: isLight ? "yellow" : "white",
                  transform: "scale(2)",
                  cursor: "pointer",
                  transition: "transform 0.3s ease, color 0.3s ease",
                  ...(hover && {
                    transform: "scale(2.5)",
                  }),
                }}
                onMouseEnter={() => setHover(true)}
                onMouseLeave={() => setHover(false)}
              />
              {user && Object.keys(user).length > 0 ? (
                <>
                  {/* <IconButton sx={{ color: theme.textPrimary }}>
                    <Badge badgeContent={3} color="error">
                      <NotificationsNoneIcon />
                    </Badge>
                  </IconButton> */}

                  <Box sx={{ position: "relative" }}>
                    <Box
                      sx={{
                        display:
                          user && Object.keys(user).length > 0
                            ? "flex"
                            : "none",
                        alignItems: "center",
                        gap: 1.5,
                        cursor: "pointer",
                        p: 1,
                        borderRadius: "8px",
                        "&:hover": {
                          backgroundColor: "rgba(136, 32, 36, 0.05)",
                        },
                      }}
                      onClick={handleProfileToggle}
                    >
                      <Box
                        sx={{
                          textAlign: "right",
                          display: { xs: "none", md: "block" },
                        }}
                      >
                        <Typography
                          variant="subtitle2"
                          sx={{
                            fontWeight: 600,
                            color: theme.textPrimary,
                          }}
                        >
                          {user?.name}
                        </Typography>
                        <Typography
                          variant="caption"
                          sx={{
                            color: theme.textSecondary,
                            lineHeight: 1,
                          }}
                        >
                          {user?.user_type}
                        </Typography>
                      </Box>
                      <Avatar
                        src={user?.img}
                        alt="Profile"
                        sx={{
                          width: 40,
                          height: 40,
                          backgroundColor: theme.primary,
                          "&:hover": {
                            boxShadow: `0 0 0 2px ${theme.background}, 0 0 0 4px ${theme.primary}`,
                          },
                        }}
                      />
                    </Box>

                    {/* Profile Dropdown */}
                    <Slide
                      direction="down"
                      in={isProfileOpen}
                      mountOnEnter
                      unmountOnExit
                    >
                      <Box
                        sx={{
                          position: "absolute",
                          top: "60px",
                          right: 0,
                          backgroundColor: theme.background,
                          boxShadow: "0 10px 30px rgba(0, 0, 0, 0.1)",
                          borderRadius: "12px",
                          overflow: "hidden",
                          minWidth: "220px",
                          border: `1px solid ${theme.divider}`,
                        }}
                      >
                        <Box
                          sx={{
                            p: 2,
                            borderBottom: `1px solid ${theme.divider}`,
                          }}
                        >
                          <Typography
                            variant="subtitle2"
                            sx={{ fontWeight: 600, color: theme.textPrimary }}
                          >
                            {user?.name}
                          </Typography>
                          <Typography
                            variant="caption"
                            sx={{ color: theme.textSecondary }}
                          >
                            {user?.email}
                          </Typography>
                        </Box>
                        <List sx={{ py: 0 }}>
                          <ListItem
                            // button
                            onClick={() => handleProfile()}
                            sx={{
                              "&:hover": {
                                backgroundColor: "rgba(136, 32, 36, 0.05)",
                                "& .drawer-text-profile": {
                                  color: isLight ? "#882024" : "#ff0000",
                                  fontWeight: 700,
                                },
                              },
                              cursor: "pointer",
                              display:
                                user?.user_type?.toLowerCase() === "admin"
                                  ? "none"
                                  : "flex",
                            }}
                          >
                            <Typography
                              className="drawer-text-profile"
                              primary="My Profile"
                              sx={{
                                color: theme.primary,
                                fontWeight: 600,
                                transition: "all 0.2s ease",
                              }}
                            >
                              My Profile
                            </Typography>
                          </ListItem>

                          {/* <ListItem
                            button
                            component={Link}
                            to="/settings"
                            sx={{
                              "&:hover": {
                                backgroundColor: "rgba(136, 32, 36, 0.05)"
                              }
                            }}
                          >
                            <ListItemText
                              primary="Settings"
                              primaryTypographyProps={{
                                color: theme.textPrimary,
                                fontWeight: 500
                              }}
                            />
                          </ListItem> */}
                        </List>
                        <Divider />
                        <ListItem
                          // button
                          onClick={handleLogout}
                          sx={{
                            "&:hover": {
                              backgroundColor: "rgba(136, 32, 36, 0.05)",
                              "& .drawer-text-signout": {
                                color: isLight ? "#882024" : "#ff0000",
                                fontWeight: 700,
                              },
                            },
                            cursor: "pointer",
                          }}
                        >
                          <Typography
                            className="drawer-text-signout"
                            primary="Sign Out"
                            sx={{
                              color: theme.primary,
                              fontWeight: 600,
                              transition: "all 0.2s ease",
                            }}
                          >
                            Sign Out
                          </Typography>
                        </ListItem>
                      </Box>
                    </Slide>
                  </Box>
                </>
              ) : (
                <>
                  <Button
                    component={Link}
                    to="/login"
                    variant="text"
                    sx={{
                      display: { xs: "none", sm: "inline-flex" },
                      color: theme.textPrimary,
                      fontWeight: 500,
                      "&:hover": {
                        color: theme.primary,
                        backgroundColor: "transparent",
                      },
                    }}
                  >
                    Sign In
                  </Button>
                  <Button
                    component={Link}
                    to="/register"
                    variant="contained"
                    sx={{
                      borderRadius: "8px",
                      px: 3,
                      py: 1.5,
                      backgroundColor: theme.primary,
                      "&:hover": {
                        backgroundColor: theme.primaryLight,
                        boxShadow: `0 4px 12px rgba(136, 32, 36, 0.3)`,
                      },
                      transition: "all 0.2s ease",
                      color: isLight ? "#fff" : "black",
                    }}
                  >
                    Join Now
                  </Button>
                </>
              )}

              {/* Mobile Menu Button */}
              {user && Object.keys(user).length > 0 && (
                <IconButton
                  onClick={handleDrawerToggle}
                  sx={{
                    ml: 1,
                    display: { lg: "none" },
                    color: theme.textPrimary,
                  }}
                >
                  <MenuIcon />
                </IconButton>
              )}
            </Box>
          </Box>
        </Container>
      </Box>

      {/* Mobile Drawer */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true,
        }}
        sx={{
          display: { xs: "block", lg: "none" },
          "& .MuiDrawer-paper": {
            boxSizing: "border-box",
            width: 300,
          },
        }}
      >
        {drawer}
      </Drawer>
    </>
  );
}

export default Navbar;
