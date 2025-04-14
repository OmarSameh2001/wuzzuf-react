import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { userContext } from "../../context/UserContext";
import { logoutUser } from "../../services/Auth";
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
  Badge
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import NotificationsNoneIcon from "@mui/icons-material/NotificationsNone";

// Custom color palette based on #882024
const theme = {
  primary: "#882024",
  primaryLight: "#a83236",
  primaryDark: "#6c1519",
  secondary: "#f5f5f5",
  textPrimary: "#2d2d2d",
  textSecondary: "#555555",
  background: "#ffffff",
  divider: "#e0e0e0"
};

function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const { user, setUser, setToken } = useContext(userContext);
  const navigate = useNavigate();

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleProfileToggle = () => {
    setIsProfileOpen(!isProfileOpen);
  };

  const handleLogout = (e) => {
    e.stopPropagation();
    if (window.confirm("Are you sure you want to logout?")) {
      logoutUser();
      setUser({});
      setToken(null);
      setIsProfileOpen(false);
      navigate("/");
    }
  };

  const drawer = (
    <Box
      sx={{
        width: 300,
        height: "100%",
        backgroundColor: theme.background,
        display: "flex",
        flexDirection: "column"
      }}
    >
      <Box sx={{ 
        display: "flex", 
        justifyContent: "space-between",
        alignItems: "center",
        p: 3,
        borderBottom: `1px solid ${theme.divider}`
      }}>
        <Typography variant="h6" sx={{ 
          fontWeight: 700,
          color: theme.primary,
          letterSpacing: "-0.5px"
        }}>
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
              <NavDrawerItem to="/applicant/profile/recom" text="Recommended" icon="📌" />
              <NavDrawerItem to="/applicant/jobs" text="Jobs" icon="💼" />
              <NavDrawerItem to="/applicant/saved" text="Saved" icon="🔖" />
              <NavDrawerItem to="/applicant/applications" text="Applications" icon="📩" />
            </>
          )}
          {user?.user_type?.toLowerCase() === "company" && (
            <>
              <NavDrawerItem to="/company/talents" text="Talents" icon="👥" />
              <NavDrawerItem to="/company/jobs" text="My Jobs" icon="🏢" />
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
                backgroundColor: "rgba(136, 32, 36, 0.04)"
              }
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
                boxShadow: "0 4px 12px rgba(136, 32, 36, 0.2)"
              }
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
                backgroundColor: "rgba(136, 32, 36, 0.04)"
              }
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
          position: "relative",
          zIndex: 1100
        }}
      >
        <Container maxWidth="xl">
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              height: "72px"
            }}
          >
            {/* Logo/Brand */}
            <Box sx={{ display: "flex", alignItems: "center", gap: 4 }}>
              <Link 
                to="/" 
                style={{ textDecoration: "none" }}
              >
                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: 700,
                    color: theme.primary,
                    letterSpacing: "-0.5px",
                    fontSize: "1.5rem",
                    "&:hover": { opacity: 0.9 }
                  }}
                >
                  RecruitHub
                </Typography>
              </Link>

              {/* Desktop Navigation */}
              <Box sx={{ display: { xs: "none", lg: "flex" }, gap: 1 }}>
                {user?.user_type?.toLowerCase() === "jobseeker" && (
                  <>
                    <NavLink to="/applicant/profile/recom" text="Recommended" />
                    <NavLink to="/applicant/jobs" text="Jobs" />
                    <NavLink to="/applicant/saved" text="Saved" />
                    <NavLink to="/applicant/applications" text="Applications" />
                  </>
                )}
                {user?.user_type?.toLowerCase() === "company" && (
                  <>
                    <NavLink to="/company/talents" text="Talents" />
                    <NavLink to="/company/jobs" text="My Jobs" />
                  </>
                )}
              </Box>
            </Box>

            {/* User/Auth Section */}
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              {user && Object.keys(user).length>0 ? (
                <>
                  {/* <IconButton sx={{ color: theme.textPrimary }}>
                    <Badge badgeContent={3} color="error">
                      <NotificationsNoneIcon />
                    </Badge>
                  </IconButton> */}
                  
                  <Box sx={{ position: "relative" }}>
                    <Box
                      sx={{
                        display: user && Object.keys(user).length>0 ? "flex" : "none",
                        alignItems: "center",
                        gap: 1.5,
                        cursor: "pointer",
                        p: 1,
                        borderRadius: "8px",
                        "&:hover": {
                          backgroundColor: "rgba(136, 32, 36, 0.05)"
                        }
                      }}
                      onClick={handleProfileToggle}
                    >
                      <Box sx={{ textAlign: "right", display: { xs: "none", md: "block" } }}>
                        <Typography variant="subtitle2" sx={{ 
                          fontWeight: 600,
                          color: theme.textPrimary
                        }}>
                          {user?.name}
                        </Typography>
                        <Typography variant="caption" sx={{ 
                          color: theme.textSecondary,
                          lineHeight: 1
                        }}>
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
                            boxShadow: `0 0 0 2px ${theme.background}, 0 0 0 4px ${theme.primary}`
                          }
                        }}
                      />
                    </Box>

                    {/* Profile Dropdown */}
                    <Slide direction="down" in={isProfileOpen} mountOnEnter unmountOnExit>
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
                          border: `1px solid ${theme.divider}`
                        }}
                      >
                        <Box sx={{ p: 2, borderBottom: `1px solid ${theme.divider}` }}>
                          <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                            {user?.name}
                          </Typography>
                          <Typography variant="caption" sx={{ color: theme.textSecondary }}>
                            {user?.email}
                          </Typography>
                        </Box>
                        <List sx={{ py: 0 }}>
                        <ListItem 
                             // button 
                              component={Link} 
                              to={user?.user_type?.toLowerCase() === "company" ? "/company/profile/edit-personal" : "/applicant/profile"}
                              sx={{
                                "&:hover": {
                                  backgroundColor: "rgba(136, 32, 36, 0.05)"
                                }
                              }}
                            >
                              <ListItemText 
                                primary="My Profile" 
                                primaryTypographyProps={{ 
                                  color: theme.textPrimary,
                                  fontWeight: 500 
                                }}
                              />
                            </ListItem>

                          <ListItem 
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
                          </ListItem>
                        </List>
                        <Divider />
                        <ListItem 
                          // button 
                          onClick={handleLogout}
                          sx={{
                            "&:hover": {
                              backgroundColor: "rgba(136, 32, 36, 0.05)"
                            }
                          }}
                        >
                          <ListItemText 
                            primary="Sign Out" 
                            primaryTypographyProps={{ 
                              color: theme.primary,
                              fontWeight: 600 
                            }}
                          />
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
                        backgroundColor: "transparent"
                      }
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
                        boxShadow: `0 4px 12px rgba(136, 32, 36, 0.3)`
                      },
                      transition: "all 0.2s ease"
                    }}
                  >
                    Join Now
                  </Button>
                </>
              )}

              {/* Mobile Menu Button */}
              {user&& Object.keys(user).length > 0 && <IconButton 
                
                onClick={handleDrawerToggle}
                sx={{ 
                  ml: 1,
                  display: { lg: "none" },
                  color: theme.textPrimary,
                }}
              >
                <MenuIcon />
              </IconButton>}
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

// Custom NavLink component for desktop
const NavLink = ({ to, text }) => (
  <Link
    to={to}
    style={{ textDecoration: "none" }}
  >
    <Box
      sx={{
        px: 2,
        py: 1.5,
        borderRadius: "6px",
        transition: "all 0.2s ease",
        "&:hover": {
          backgroundColor: "rgba(136, 32, 36, 0.05)",
          "& .nav-text": {
            color: "#882024",
            fontWeight: 600
          }
        }
      }}
    >
      <Typography
        className="nav-text"
        variant="body1"
        sx={{
          fontWeight: 500,
          color: theme.textSecondary,
          transition: "all 0.2s ease"
        }}
      >
        {text}
      </Typography>
    </Box>
  </Link>
);

// Custom NavDrawerItem component
const NavDrawerItem = ({ to, text, icon }) => (
  <ListItem 
    // button 
    component={Link} 
    to={to}
    sx={{
      borderRadius: "8px",
      mb: 0.5,
      "&:hover": {
        backgroundColor: "rgba(136, 32, 36, 0.05)",
        "& .drawer-text": {
          color: "#882024",
          fontWeight: 600
        }
      }
    }}
  >
    <Typography variant="body1" sx={{ mr: 1.5 }}>{icon}</Typography>
    <ListItemText 
      primary={text}
      primaryTypographyProps={{
        className: "drawer-text",
        color: theme.textPrimary,
        fontWeight: 500
      }} 
    />
  </ListItem>
);

export default Navbar;