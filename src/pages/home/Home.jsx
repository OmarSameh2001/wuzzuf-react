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
      description: "Sign up easily with your email and start exploring job opportunities.",
      icon: "assets/images/step1.png", // Replace with actual icons
    },
    {
      title: "Build Your Profile",
      description: "Add your experience, skills, and preferences to help us match you better.",
      icon: "/images/step2.png",
    },
    {
      title: "Search for Jobs",
      description: "Browse thousands of job listings tailored to your profile.",
      icon: "/images/step3.png",
    },
    {
      title: "Apply in One Click",
      description: "Submit applications easily using your pre-filled resume and cover letter.",
      icon: "/images/step4.png",
    },
  ];

  return (
    <Container fluid className="home-container">
      {/* Hero Section */}
      <Row
        className="hero-section"
        style={{ minHeight: "100vh" }}
      >
        <Col>
          <motion.h1
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            Find Your Dream Job Easily
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            Connect with top companies and land your ideal job today!
          </motion.p>
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 1, duration: 0.5 }}
          >
            <Button variant="primary" className="me-3">Get Started</Button>
            <Button variant="outline-primary">Post a Job</Button>
          </motion.div>
        </Col>
      </Row>

      {/* How It Works Section */}
      <Row className="text-center my-5">
        <Col>
          <h2>How It Works</h2>
          <p>Follow these simple steps to get started with your job hunt</p>
        </Col>
      </Row>

      <Row className="justify-content-center px-5">
        <Col md={10}>
          <Slider {...settings}>
            {steps.map((step, index) => (
              <div key={index}>
                <Card className="text-center p-4 border-0 shadow-sm">
                  <Card.Img
                    variant="top"
                    src={step.icon}
                    alt={step.title}
                    style={{ width: "120px", height: "120px", objectFit: "contain", margin: "0 auto" }}
                  />
                  <Card.Body>
                    <Card.Title>{step.title}</Card.Title>
                    <Card.Text>{step.description}</Card.Text>
                    <Button variant="primary">Get Started</Button>
                  </Card.Body>
                </Card>
              </div>
            ))}
          </Slider>
        </Col>
      </Row>
       {/* Browse by Career Level */}
       <Row className="text-center my-5">
        <Col>
          <h2>Browse by Career Level</h2>
        </Col>
      </Row>

      <Row className="justify-content-center px-5 mb-5">
        {[
          // { name: "Internship", image: intern },
          // { name: "Entry Level", image: entry },
          // { name: "Mid Level", image: senior },
          // { name: "Senior Level", image: manager },
          // { name: "Executive", image: expert },
        ].map((career, index) => (
          <Col key={index} xs={6} sm={4} md={2} className="mb-4">
            <Card className="text-center border-0 shadow-sm">
              <Card.Img
                variant="top"
                src={career.image}
                alt={career.name}
                style={{ height: "100px", objectFit: "contain", margin: "20px auto 0" }}
              />
              <Card.Body>
                <Card.Title className="fs-6">{career.name}</Card.Title>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
  </Container>

  );
};

export default Home;
