import { useContext, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router";
import { userContext } from "../../context/UserContext";

export default function Home() {
  const { user, refetchUser, token, isLight } = useContext(userContext);
  // Mock navigation function
  const navigate = useNavigate();

  // Toggle theme function for demo purposes
  // const toggleTheme = () => setIsLight(!isLight);

  const handleClick = () => {
    if (!user) {
      navigate("/login");
    } else if (user?.user_type === "JOBSEEKER") {
      navigate("/applicant/jobs");
    } else if (user?.user_type === "COMPANY") {
      navigate("/company/jobs");
    } else if (user?.user_type === "ADMIN") {
      navigate("/admin/itians");
    } else {
      navigate("/login");
    }
  };

  const isJobSeeker = user && user.user_type === "JOBSEEKER";
  const isCompany = user && user.user_type === "COMPANY";
  const isAdmin = user && user.user_type === "ADMIN";

  // Modern color palette
  const colors = {
    light: {
      background: "#ffffff",
      cardBg: "#ffffff",
      sectionBg: "#f8f9fa",
      text: "#333333",
      accent: "#e63946", // Modern red
      accentHover: "#d62b3a",
      secondary: "#457b9d", // Blue accent
      muted: "#6c757d",
      border: "#dee2e6",
    },
    dark: {
      background: "#121212",
      cardBg: "#1e1e1e",
      sectionBg: "#242424",
      text: "#f8f9fa",
      accent: "#e63946", // Same red accent for consistency
      accentHover: "#f25d69",
      secondary: "#64b5f6", // Lighter blue for dark mode
      muted: "#adb5bd",
      border: "#343a40",
    },
  };

  // Get current theme colors
  const theme = isLight ? colors.light : colors.dark;
  useEffect(() => {
    refetchUser();
  }, [token]);
  return (
    <div
      style={{
        backgroundColor: theme.background,
        color: theme.text,
        fontFamily:
          "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
        transition: "all 0.3s ease",
        width: "100%",
      }}
    >
      {/* Theme Toggle Button */}
      {/* <button
        onClick={toggleTheme}
        style={{
          position: "fixed",
          top: "20px",
          right: "20px",
          zIndex: 1000,
          backgroundColor: theme.accent,
          color: "#fff",
          border: "none",
          borderRadius: "50%",
          width: "50px",
          height: "50px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: "pointer",
          boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
          transition: "all 0.3s ease",
        }}
      >
        {isLight ? "🌙" : "☀️"}
      </button> */}

      {/* Hero Section */}
      <div
        style={{
          position: "relative",
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            zIndex: 0,
          }}
        >
          <img
            src="https://knowledgecity.iti.gov.eg/assets/images/slider/Web%20capture_18-1-2023_4417_.jpeg"
            alt="Background"
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              filter: isLight
                ? "brightness(0.9)"
                : "brightness(0.4) saturate(0.8)",
              transition: "filter 0.5s ease",
            }}
          />
          {/* <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              background: isLight
                ? "linear-gradient(rgba(255,255,255,0.2), rgba(255,255,255,0.4))"
                : "linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.7))",
              zIndex: 1,
            }}
          /> */}
        </div>

        <div
          style={{
            maxWidth: "800px",
            padding: "40px",
            borderRadius: "16px",
            background: isLight
              ? "rgba(255, 255, 255, 0.85)"
              : "#242424",
            backdropFilter: "blur(10px)",
            boxShadow: "0 10px 30px rgba(0, 0, 0, 0.2)",
            zIndex: 2,
            transition: "all 0.3s ease",
          }}
        >
          <motion.h1
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            style={{
              fontSize: "4rem",
              fontWeight: "800",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              marginBottom: "24px",
              backgroundColor: isLight ? "black" : "white",
            }}
          >
            HireGenius AI
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            style={{
              fontSize: "1.5rem",
              margin: "20px 0 40px",
              fontWeight: "500",
              color: theme.text,
              maxWidth: "600px",
              marginLeft: "auto",
              marginRight: "auto",
            }}
          >
            Connecting {isCompany ? "Companies" : "ITI Graduates"} to the World
            of {isCompany ? "Talents" : "Work"}
          </motion.p>

          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 1, duration: 0.5 }}
            style={{
              display: "flex",
              gap: "16px",
              justifyContent: "center",
              flexWrap: "wrap",
            }}
          >
            <button
              style={{
                padding: "14px 28px",
                fontSize: "1rem",
                fontWeight: "600",
                backgroundColor: theme.accent,
                color: "white",
                border: "none",
                borderRadius: "8px",
                cursor: "pointer",
                transition: "all 0.2s ease",
                boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
              }}
              onClick={() => handleClick()}
              onMouseOver={(e) =>
                (e.currentTarget.style.backgroundColor = theme.accentHover)
              }
              onMouseOut={(e) =>
                (e.currentTarget.style.backgroundColor = theme.accent)
              }
            >
              Get Started
            </button>

            <button
              style={{
                padding: "14px 28px",
                fontSize: "1rem",
                fontWeight: "600",
                backgroundColor: "transparent",
                color: theme.accent,
                border: `2px solid ${theme.accent}`,
                borderRadius: "8px",
                cursor: "pointer",
                transition: "all 0.2s ease",
              }}
              onClick={() => handleClick()}
              onMouseOver={(e) => {
                e.currentTarget.style.backgroundColor = theme.accent;
                e.currentTarget.style.color = "white";
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.backgroundColor = "transparent";
                e.currentTarget.style.color = theme.accent;
              }}
            >
              {!user
                ? "Login"
                : isJobSeeker
                ? "Browse Jobs"
                : isCompany
                ? "Post a Job"
                : "Manage Website"}
            </button>
          </motion.div>
        </div>
      </div>

      {/* Split Section for Applicants and Recruiters */}
      {!user?.id && (
        <div
          style={{
            padding: "80px 20px",
            backgroundColor: theme.sectionBg,
            transition: "background-color 0.3s ease",
          }}
        >
          <div
            style={{
              maxWidth: "1200px",
              margin: "0 auto",
              display: "flex",
              flexDirection: "row",
              flexWrap: "wrap",
              gap: "30px",
            }}
          >
            <div
              style={{
                flex: "1 1 400px",
                padding: "40px",
                borderRadius: "16px",
                backgroundColor: theme.cardBg,
                boxShadow: "0 10px 30px rgba(0, 0, 0, 0.05)",
                transition: "all 0.3s ease",
                border: `1px solid ${theme.border}`,
              }}
            >
              <h2
                style={{
                  color: theme.accent,
                  fontWeight: "700",
                  fontSize: "2rem",
                  marginBottom: "24px",
                }}
              >
                For ITI Graduates
              </h2>
              <p
                style={{
                  margin: "20px 0 30px",
                  fontSize: "1.1rem",
                  lineHeight: "1.6",
                  color: theme.text,
                }}
              >
                Discover job opportunities tailored to your skills and
                expertise. Build your career with ease and confidence.
              </p>
              <button
                style={{
                  padding: "14px 28px",
                  fontSize: "1rem",
                  fontWeight: "600",
                  backgroundColor: theme.accent,
                  color: "white",
                  border: "none",
                  borderRadius: "8px",
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                  boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
                }}
                onClick={() => handleClick()}
                onMouseOver={(e) =>
                  (e.currentTarget.style.backgroundColor = theme.accentHover)
                }
                onMouseOut={(e) =>
                  (e.currentTarget.style.backgroundColor = theme.accent)
                }
              >
                Join Itians
              </button>
            </div>

            <div
              style={{
                flex: "1 1 400px",
                padding: "40px",
                borderRadius: "16px",
                backgroundColor: theme.cardBg,
                boxShadow: "0 10px 30px rgba(0, 0, 0, 0.05)",
                transition: "all 0.3s ease",
                border: `1px solid ${theme.border}`,
              }}
            >
              <h2
                style={{
                  color: theme.accent,
                  fontWeight: "700",
                  fontSize: "2rem",
                  marginBottom: "24px",
                }}
              >
                For Recruiters
              </h2>
              <p
                style={{
                  margin: "20px 0 30px",
                  fontSize: "1.1rem",
                  lineHeight: "1.6",
                  color: theme.text,
                }}
              >
                Find top talent from ITI graduates. Post jobs and connect with
                the right candidates effortlessly.
              </p>
              <button
                style={{
                  padding: "14px 28px",
                  fontSize: "1rem",
                  fontWeight: "600",
                  backgroundColor: theme.accent,
                  color: "white",
                  border: "none",
                  borderRadius: "8px",
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                  boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
                }}
                onClick={() => handleClick()}
                onMouseOver={(e) =>
                  (e.currentTarget.style.backgroundColor = theme.accentHover)
                }
                onMouseOut={(e) =>
                  (e.currentTarget.style.backgroundColor = theme.accent)
                }
              >
                Become Recruiter
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Job Types Section */}
      {(isJobSeeker || !user?.id) && (
        <div
          style={{
            padding: "80px 20px",
            backgroundColor: theme.background,
            transition: "background-color 0.3s ease",
          }}
        >
          <div
            style={{
              maxWidth: "1200px",
              margin: "0 auto",
              textAlign: "center",
            }}
          >
            <h2
              style={{
                color: theme.accent,
                fontWeight: "700",
                fontSize: "2.5rem",
                marginBottom: "50px",
                position: "relative",
                display: "inline-block",
              }}
            >
              Find Your Dream Job
              <span
                style={{
                  position: "absolute",
                  bottom: "-10px",
                  left: "50%",
                  transform: "translateX(-50%)",
                  width: "80px",
                  height: "4px",
                  backgroundColor: theme.accent,
                  borderRadius: "2px",
                }}
              ></span>
            </h2>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
                gap: "30px",
                marginBottom: "40px",
              }}
            >
              {[
                {
                  title: "Full-Time",
                  image:
                    "https://img.freepik.com/premium-photo/text-full-time-job-written-lightbox-with-alarm-clock-colorfull-stickers-blue-background_132358-5491.jpg",
                },
                {
                  title: "Part-Time",
                  image:
                    "https://img.freepik.com/premium-photo/red-alarm-clock-with-text-parttime-job_132358-5465.jpg",
                },
                {
                  title: "Internship",
                  image:
                    "https://img.freepik.com/premium-photo/business-people-group_780838-13844.jpg",
                },
                {
                  title: "Freelance",
                  image:
                    "https://img.freepik.com/free-photo/side-view-entrepreneur-working-laptop_23-2148446302.jpg",
                },
              ].map((job, index) => (
                <div
                  key={index}
                  style={{
                    borderRadius: "16px",
                    overflow: "hidden",
                    backgroundColor: theme.cardBg,
                    boxShadow: "0 10px 30px rgba(0, 0, 0, 0.1)",
                    transition: "all 0.3s ease",
                    transform: "translateY(0)",
                    cursor: "pointer",
                    border: `1px solid ${theme.border}`,
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.transform = "translateY(-10px)";
                    e.currentTarget.style.boxShadow =
                      "0 20px 40px rgba(0, 0, 0, 0.15)";
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow =
                      "0 10px 30px rgba(0, 0, 0, 0.1)";
                  }}
                >
                  <div
                    style={{
                      height: "200px",
                      overflow: "hidden",
                      position: "relative",
                    }}
                  >
                    <img
                      src={job.image || "/placeholder.svg"}
                      alt={job.title}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                        transition: "transform 0.5s ease",
                      }}
                      onMouseOver={(e) =>
                        (e.currentTarget.style.transform = "scale(1.1)")
                      }
                      onMouseOut={(e) =>
                        (e.currentTarget.style.transform = "scale(1)")
                      }
                    />
                    <div
                      style={{
                        position: "absolute",
                        bottom: 0,
                        left: 0,
                        right: 0,
                        background:
                          "linear-gradient(transparent, rgba(0,0,0,0.7))",
                        height: "50%",
                      }}
                    ></div>
                  </div>
                  <div
                    style={{
                      padding: "20px",
                      textAlign: "center",
                    }}
                  >
                    <h3
                      style={{
                        color: theme.accent,
                        fontWeight: "600",
                        fontSize: "1.3rem",
                        margin: "0",
                      }}
                    >
                      {job.title}
                    </h3>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ITI Graduates Section */}
      {(isCompany || !user?.id) && (
        <div
          style={{
            padding: "80px 20px",
            backgroundColor: theme.sectionBg,
            transition: "background-color 0.3s ease",
          }}
        >
          <div
            style={{
              maxWidth: "1200px",
              margin: "0 auto",
              textAlign: "center",
            }}
          >
            <h2
              style={{
                color: theme.accent,
                fontWeight: "700",
                fontSize: "2.5rem",
                marginBottom: "50px",
                position: "relative",
                display: "inline-block",
              }}
            >
              ITI Graduates
              <span
                style={{
                  position: "absolute",
                  bottom: "-10px",
                  left: "50%",
                  transform: "translateX(-50%)",
                  width: "80px",
                  height: "4px",
                  backgroundColor: theme.accent,
                  borderRadius: "2px",
                }}
              ></span>
            </h2>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
                gap: "30px",
                marginBottom: "40px",
              }}
            >
              {[
                {
                  title: "Data Scientists",
                  image:
                    "https://www.ue-germany.com/uploads/sites/9/2022/07/digital-business-data-sience-960x540-1.jpg",
                },
                {
                  title: "Cyber Security",
                  image:
                    "https://thecyberexpress.com/wp-content/uploads/2022/12/How-to-Become-a-Cyber-Security-Engineer-750x375.jpg?crop=1",
                },
                {
                  title: "Software Developers",
                  image:
                    "https://img.freepik.com/premium-photo/business-people-group_780838-13844.jpg",
                },
                {
                  title: "Graphic Designers",
                  image:
                    "https://img.freepik.com/free-photo/logo-designer-working-computer-desktop_23-2149142153.jpg?ga=GA1.1.2112067204.1743957977&semt=ais_hybrid&w=740",
                },
              ].map((grad, index) => (
                <div
                  key={index}
                  style={{
                    borderRadius: "16px",
                    overflow: "hidden",
                    backgroundColor: theme.cardBg,
                    boxShadow: "0 10px 30px rgba(0, 0, 0, 0.1)",
                    transition: "all 0.3s ease",
                    transform: "translateY(0)",
                    cursor: "pointer",
                    border: `1px solid ${theme.border}`,
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.transform = "translateY(-10px)";
                    e.currentTarget.style.boxShadow =
                      "0 20px 40px rgba(0, 0, 0, 0.15)";
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow =
                      "0 10px 30px rgba(0, 0, 0, 0.1)";
                  }}
                >
                  <div
                    style={{
                      height: "200px",
                      overflow: "hidden",
                      position: "relative",
                    }}
                  >
                    <img
                      src={grad.image || "/placeholder.svg"}
                      alt={grad.title}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                        transition: "transform 0.5s ease",
                      }}
                      onMouseOver={(e) =>
                        (e.currentTarget.style.transform = "scale(1.1)")
                      }
                      onMouseOut={(e) =>
                        (e.currentTarget.style.transform = "scale(1)")
                      }
                    />
                    <div
                      style={{
                        position: "absolute",
                        bottom: 0,
                        left: 0,
                        right: 0,
                        background:
                          "linear-gradient(transparent, rgba(0,0,0,0.7))",
                        height: "50%",
                      }}
                    ></div>
                  </div>
                  <div
                    style={{
                      padding: "20px",
                      textAlign: "center",
                    }}
                  >
                    <h3
                      style={{
                        color: theme.accent,
                        fontWeight: "600",
                        fontSize: "1.3rem",
                        margin: "0",
                      }}
                    >
                      {grad.title}
                    </h3>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ITI in numbers */}
      <div
        style={{
          padding: "80px 20px",
          backgroundColor: theme.background,
          transition: "background-color 0.3s ease",
        }}
      >
        <div
          style={{
            maxWidth: "1200px",
            margin: "0 auto",
            textAlign: "center",
          }}
        >
          <div
            style={{
              marginBottom: "50px",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <div
              style={{
                width: "5px",
                height: "50px",
                backgroundColor: theme.accent,
                marginBottom: "20px",
                borderRadius: "2px",
              }}
            ></div>

            <h2
              style={{
                margin: "10px 0",
                fontSize: "2.5rem",
                color: theme.accent,
                fontWeight: "700",
              }}
            >
              ITI in numbers
            </h2>

            <h3
              style={{
                margin: "0",
                fontSize: "1.2rem",
                color: theme.muted,
                fontWeight: "500",
              }}
            >
              Quick facts about ITI
            </h3>
          </div>

          <div
            style={{
              display: "flex",
              justifyContent: "center",
              gap: "30px",
              flexWrap: "wrap",
            }}
          >
            {[
              { number: "32", text: "IT Specializations" },
              { number: "85%", text: "Annual Employment Rate" },
              { number: "500+", text: "Companies" },
              { number: "80+", text: "Universities & Faculties" },
            ].map((stat, index) => (
              <div
                key={index}
                style={{
                  textAlign: "center",
                  padding: "30px",
                  borderRadius: "16px",
                  width: "200px",
                  backgroundColor: theme.cardBg,
                  boxShadow: "0 10px 30px rgba(0, 0, 0, 0.1)",
                  transition: "all 0.3s ease",
                  border: `1px solid ${theme.border}`,
                  transform: "translateY(0)",
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.transform = "translateY(-10px)";
                  e.currentTarget.style.boxShadow =
                    "0 20px 40px rgba(0, 0, 0, 0.15)";
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow =
                    "0 10px 30px rgba(0, 0, 0, 0.1)";
                }}
              >
                <h1
                  style={{
                    fontSize: "3rem",
                    color: theme.accent,
                    margin: "0",
                    fontWeight: "800",
                  }}
                >
                  {stat.number}
                </h1>
                <h2
                  style={{
                    fontSize: "1.1rem",
                    color: theme.text,
                    margin: "10px 0 0",
                    fontWeight: "500",
                  }}
                >
                  {stat.text}
                </h2>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
