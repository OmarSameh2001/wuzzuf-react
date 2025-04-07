import React from "react";
import { motion } from "framer-motion";
import { Container, Row, Col, Button, Card } from "react-bootstrap";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
// import './home.css';
// import intern from '../../assets/image/intern.jpg';
// import entry from '../../assets/image/entry.jpg';
// import senior from '../../assets/image/senior.jpg';
// import manager from '../../assets/image/manger.jpg';
// import expert from '../../assets/image/expert.jpg';

const Home = () => {
  const settings = {
    dots: true,
    infinite: true,
    speed: 1000,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    arrows: false,
  };
  const steps = [
    {
      title: "Create an Account",
      description:
        "Sign up easily with your email and start exploring job opportunities.",
      icon: "assets/images/step1.png", // Replace with actual icons
    },
    {
      title: "Build Your Profile",
      description:
        "Add your experience, skills, and preferences to help us match you better.",
      icon: "/images/step2.png",
    },
    {
      title: "Search for Jobs",
      description: "Browse thousands of job listings tailored to your profile.",
      icon: "/images/step3.png",
    },
    {
      title: "Apply in One Click",
      description:
        "Submit applications easily using your pre-filled resume and cover letter.",
      icon: "/images/step4.png",
    },
  ];

  return (
    <Container fluid className="p-0">
      {/* Hero Section */}
      <Row
        className="hero-section mx-auto"
        style={{
          minHeight: "100vh",
          backgroundImage:
            "url('https://knowledgecity.iti.gov.eg/assets/images/slider/Web%20capture_18-1-2023_4417_.jpeg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          color: "#901b20",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
          // padding: "20px",
          maxWidth: "100vw",
        }}
      >
        <Col style={{backgroundColor: "#ffffff73", padding: "20px", maxWidth: "fit-content", borderRadius: "10px"}}>
          <motion.h1
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            style={{ fontSize: "3rem", fontWeight: "bold" }}
          >
            Recruitment Platform
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            style={{ fontSize: "1.5rem", margin: "20px 0" }}
          >
            Connecting Graduates to the World of Work
          </motion.p>
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 1, duration: 0.5 }}
          >
            <Button
              variant="primary"
              className="me-3"
              style={{
                padding: "10px 20px",
                fontSize: "1rem",
                backgroundColor: "#901b20",
                border: "none",
              }}
            >
              Get Started
            </Button>
            <Button
              style={{
                padding: "10px 20px",
                fontSize: "1rem",
                backgroundColor: "#901b20",
                border: "none",
              }}
            >
              Post a Job
            </Button>
          </motion.div>
        </Col>
      </Row>
      {/* Split Section for Applicants and Recruiters */}
      <Row
        className="split-section mx-auto"
        style={{ padding: "50px 0", textAlign: "center" }}
      >
        <Col
          md={6}
          style={{
            backgroundColor: "#f8f9fa",
            padding: "30px",
            borderRight: "1px solid #ddd",
          }}
        >
          <h2 style={{ color: "#901b20", fontWeight: "bold" }}>
            For ITI Graduates
          </h2>
          <p style={{ margin: "20px 0", fontSize: "1.2rem" }}>
            Discover job opportunities tailored to your skills and expertise.
            Build your career with ease and confidence.
          </p>
          <Button
            variant="primary"
            style={{
              padding: "10px 20px",
              fontSize: "1rem",
              backgroundColor: "#901b20",
              border: "none",
            }}
          >
            Join Itians
          </Button>
        </Col>
        <Col
          md={6}
          style={{
            backgroundColor: "#ffffff",
            padding: "30px",
          }}
        >
          <h2 style={{ color: "#901b20", fontWeight: "bold" }}>
            For Recruiters
          </h2>
          <p style={{ margin: "20px 0", fontSize: "1.2rem" }}>
            Find top talent from ITI graduates. Post jobs and connect with the
            right candidates effortlessly.
          </p>
          <Button
            variant="primary"
            style={{
              padding: "10px 20px",
              fontSize: "1rem",
              backgroundColor: "#901b20",
              border: "none",
            }}
          >
            Become Recruiter
          </Button>
        </Col>
      </Row>
      {/* Job Types Section */}
      <Row
        className="job-types-section mx-auto"
        style={{ padding: "50px 0", textAlign: "center" }}
      >
        <h2
          style={{ color: "#901b20", fontWeight: "bold", marginBottom: "30px" }}
        >
          Explore Job Types
        </h2>
        <Row className="justify-content-center">
          <Col md={6} lg={3} style={{ padding: "15px" }}>
            <Card style={{ border: "none" }}>
              <Card.Img
                variant="top"
                src="https://img.freepik.com/premium-photo/text-full-time-job-written-lightbox-with-alarm-clock-colorfull-stickers-blue-background_132358-5491.jpg"
                alt="Full-Time"
                style={{ borderRadius: "10px" }}
              />
              <Card.Body>
                <Card.Title style={{ color: "#901b20", fontWeight: "bold" }}>
                  Full-Time
                </Card.Title>
              </Card.Body>
            </Card>
          </Col>
          <Col md={6} lg={3} style={{ padding: "15px" }}>
            <Card style={{ border: "none" }}>
              <Card.Img
                variant="top"
                src="https://img.freepik.com/premium-photo/red-alarm-clock-with-text-parttime-job_132358-5465.jpg"
                alt="Part-Time"
                style={{ borderRadius: "10px" }}
              />
              <Card.Body>
                <Card.Title style={{ color: "#901b20", fontWeight: "bold" }}>
                  Part-Time
                </Card.Title>
              </Card.Body>
            </Card>
          </Col>
        </Row>
        <Row className="justify-content-center">
          <Col md={6} lg={3} style={{ padding: "15px" }}>
            <Card style={{ border: "none" }}>
              <Card.Img
                variant="top"
                src="https://img.freepik.com/premium-photo/business-people-group_780838-13844.jpg"
                alt="Internship"
                style={{ borderRadius: "10px" }}
              />
              <Card.Body>
                <Card.Title style={{ color: "#901b20", fontWeight: "bold" }}>
                  Internship
                </Card.Title>
              </Card.Body>
            </Card>
          </Col>
          <Col md={6} lg={3} style={{ padding: "15px" }}>
            <Card style={{ border: "none" }}>
              <Card.Img
                variant="top"
                src="https://img.freepik.com/free-photo/side-view-entrepreneur-working-laptop_23-2148446302.jpg"
                alt="Freelance"
                style={{ borderRadius: "10px" }}
              />
              <Card.Body>
                <Card.Title style={{ color: "#901b20", fontWeight: "bold" }}>
                  Freelance
                </Card.Title>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Row>
      <div className="numbers" style={{ marginBottom: "30px" }}>
        <div className="header" style={{ marginBottom: "20px" }}>
          <div
            className="vertical-line"
            style={{
              width: "5px",
              height: "50px",
              backgroundColor: "#901b20",
              margin: "0 auto",
            }}
          ></div>
          <div className="title" style={{ textAlign: "center" }}>
            <h2 style={{ margin: "10px 0", fontSize: "24px", color: "#333" }}>
              ITI in numbers
            </h2>
            <h3 style={{ margin: "0", fontSize: "18px", color: "#555" }}>
              Quick facts about ITI
            </h3>
          </div>
        </div>
        <div
          className="cards"
          style={{
            display: "flex",
            justifyContent: "center",
            gap: "20px",
            flexWrap: "wrap",
          }}
        >
          <div
            className="card"
            style={{
              textAlign: "center",
              padding: "10px",
              border: "1px solid #ddd",
              borderRadius: "8px",
              width: "150px",
              backgroundColor: "#fff",
            }}
          >
            <h1
              className="number"
              style={{ fontSize: "36px", color: "#901b20", margin: "0" }}
            >
              32
            </h1>
            <h2 style={{ fontSize: "16px", color: "#333", margin: "10px 0 0" }}>
              IT Specializations
            </h2>
          </div>
          <div
            className="card"
            style={{
              textAlign: "center",
              padding: "10px",
              border: "1px solid #ddd",
              borderRadius: "8px",
              width: "150px",
              backgroundColor: "#fff",
            }}
          >
            <h1
              className="number"
              style={{ fontSize: "36px", color: "#901b20", margin: "0" }}
            >
              85%
            </h1>
            <h2 style={{ fontSize: "16px", color: "#333", margin: "10px 0 0" }}>
              Annual Employment Rate
            </h2>
          </div>
          <div
            className="card"
            style={{
              textAlign: "center",
              padding: "10px",
              border: "1px solid #ddd",
              borderRadius: "8px",
              width: "150px",
              backgroundColor: "#fff",
            }}
          >
            <h1
              className="number"
              style={{ fontSize: "36px", color: "#901b20", margin: "0" }}
            >
              500+
            </h1>
            <h2 style={{ fontSize: "16px", color: "#333", margin: "10px 0 0" }}>
              Companies
            </h2>
          </div>
          <div
            className="card"
            style={{
              textAlign: "center",
              padding: "10px",
              border: "1px solid #ddd",
              borderRadius: "8px",
              width: "150px",
              backgroundColor: "#fff",
            }}
          >
            <h1
              className="number"
              style={{ fontSize: "36px", color: "#901b20", margin: "0" }}
            >
              80+
            </h1>
            <h2 style={{ fontSize: "16px", color: "#333", margin: "10px 0 0" }}>
              Universities & Faculties
            </h2>
          </div>
        </div>
      </div>
    </Container>
  );
};

export default Home;
