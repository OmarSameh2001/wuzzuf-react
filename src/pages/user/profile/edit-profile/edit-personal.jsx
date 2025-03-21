import React, { useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ProfileContext } from "../../../../context/ProfileContext";
import { Container, Row, Col, Card, Form, Button, Image } from "react-bootstrap";
import ProfileStepper from "../../../../components/profile/ProfileStepper";
import AOS from "aos";
import "aos/dist/aos.css";
import "./EditPersonal.css"; // Custom CSS for additional styling

const EditPersonal = () => {
  const navigate = useNavigate();
  const { profileData, updateProfile, goToNextStep } = useContext(ProfileContext);
  const [localData, setLocalData] = useState(profileData);

  useEffect(() => {
    AOS.init({ duration: 1000 });
  }, []);

  const handleChange = (e) => {
    setLocalData({ ...localData, [e.target.name]: e.target.value });
  };

  const handleSave = () => {
    Object.keys(localData).forEach((key) => updateProfile(key, localData[key]));
    goToNextStep("user/profile/edit-education");
  };

  return (
    <Container fluid className="edit-personal-container">
      {/* Stepper Navigation */}
      <ProfileStepper activeStep={0} />

      {/* Profile Section */}
      <Row className="justify-content-center text-center" data-aos="fade-down">
        <Col xs={12}>
          <Image src={localData.profileImage} roundedCircle className="profile-img" />
          <h2 className="mt-2">{localData.name || "Your Name"}</h2>
          <p className="text-muted">{localData.email || "your.email@example.com"}</p>
        </Col>
      </Row>

      {/* Edit Form Section */}
      <Row className="justify-content-center mt-4">
        <Col md={6} data-aos="fade-up">
          <Card className="edit-card">
            <Card.Body>
              <h4 className="text-center mb-3">Edit Personal Details</h4>
              <Form>
                {/* Name */}
                <Form.Group controlId="name">
                  <Form.Label>Name</Form.Label>
                  <Form.Control
                    type="text"
                    name="name"
                    value={localData.name}
                    onChange={handleChange}
                    placeholder="Enter your full name"
                  />
                </Form.Group>

                {/* Email */}
                <Form.Group controlId="email" className="mt-3">
                  <Form.Label>Email</Form.Label>
                  <Form.Control
                    type="email"
                    name="email"
                    value={localData.email}
                    onChange={handleChange}
                    placeholder="Enter your email"
                  />
                </Form.Group>

                {/* Birthday */}
                <Form.Group controlId="birthday" className="mt-3">
                  <Form.Label>Birthday</Form.Label>
                  <Form.Control
                    type="date"
                    name="birthday"
                    value={localData.birthday || ""}
                    onChange={handleChange}
                  />
                </Form.Group>

                {/* Location */}
                <Row className="mt-3">
                  <Col>
                    <Form.Group controlId="city">
                      <Form.Label>City</Form.Label>
                      <Form.Control
                        type="text"
                        name="city"
                        value={localData.city || ""}
                        onChange={handleChange}
                        placeholder="Enter your city"
                      />
                    </Form.Group>
                  </Col>
                  <Col>
                    <Form.Group controlId="country">
                      <Form.Label>Country</Form.Label>
                      <Form.Control
                        type="text"
                        name="country"
                        value={localData.country || ""}
                        onChange={handleChange}
                        placeholder="Enter your country"
                      />
                    </Form.Group>
                  </Col>
                </Row>

                {/* Phone Number */}
                <Form.Group controlId="phone" className="mt-3">
                  <Form.Label>Phone Number</Form.Label>
                  <Form.Control
                    type="tel"
                    name="phone"
                    value={localData.phone || ""}
                    onChange={handleChange}
                    placeholder="Enter your phone number"
                  />
                </Form.Group>

                {/* LinkedIn Profile */}
                <Form.Group controlId="linkedin" className="mt-3">
                  <Form.Label>LinkedIn Profile</Form.Label>
                  <Form.Control
                    type="url"
                    name="linkedin"
                    value={localData.linkedin || ""}
                    onChange={handleChange}
                    placeholder="Enter your LinkedIn profile link"
                  />
                </Form.Group>

                {/* Bio */}
                <Form.Group controlId="bio" className="mt-3">
                  <Form.Label>Short Bio</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    name="bio"
                    value={localData.bio || ""}
                    onChange={handleChange}
                    placeholder="Write a short bio about yourself"
                  />
                </Form.Group>

                <div className="text-center mt-4">
                  <Button variant="primary" onClick={handleSave}>
                    Next: Education
                  </Button>
                </div>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default EditPersonal;
