import React, { useContext, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ProfileContext } from "../../../context/ProfileContext";
import { Container, Row, Col, Card, Button, Image, Form } from "react-bootstrap";
import { FaPen } from "react-icons/fa";
import AOS from "aos";
import "aos/dist/aos.css";
import "./userProfile.css";

const UserProfile = () => {
  const navigate = useNavigate();
  const { profileData, updateProfile } = useContext(ProfileContext);
  const [profileImage, setProfileImage] = useState(profileData.profileImage || "");
  const [editingTitle, setEditingTitle] = useState(false);
  const [title, setTitle] = useState(profileData.title || "No title added");
  const fileInputRef = useRef(null);

  useEffect(() => {
    AOS.init({ duration: 1000 });
  }, []);


  // Handle image upload
  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const fileUrl = URL.createObjectURL(file);
      setProfileImage(fileUrl);
      updateProfile("profileImage", fileUrl);
    }
  };

  // Open file picker
  const openFilePicker = () => {
    fileInputRef.current.click();
  };

  // Handle title editing
  const handleTitleClick = () => setEditingTitle(true);
  const handleTitleChange = (e) => setTitle(e.target.value);
  const handleTitleBlur = () => {
    setEditingTitle(false);
    updateProfile("title", title);
  };

  return (
    <Container fluid className="user-profile-container">
      {/* Profile Image, Name, and Title */}
      <Row className="profile-header text-center">
        <Col xs={12} data-aos="fade-down">
          <div className="profile-img-container" onClick={openFilePicker}>
            <Image src={profileImage} roundedCircle className="profile-img" />
            <div className="edit-icon">
              <FaPen size={15} color="#fff" />
            </div>
          </div>
          <input type="file" accept="image/*" ref={fileInputRef} onChange={handleImageUpload} className="d-none" />
          
          {/* Name Below Image */}
          <h2 className="mt-2">{profileData.name}</h2>

          {/* Editable Title */}
          {editingTitle ? (
            <Form.Control
              type="text"
              value={title}
              onChange={handleTitleChange}
              onBlur={handleTitleBlur}
              autoFocus
              className="title-input"
            />
          ) : (
            <h5 className="text-muted title-text" onClick={handleTitleClick}>
              {title} <FaPen className="title-edit-icon" />
            </h5>
          )}

          <Button variant="primary" className="mt-3" onClick={() => navigate("/applicant/profile/edit-personal")}>
            Edit Profile
          </Button>
        </Col>
      </Row>

      {/* Main Content */}
      <Row className="content-section">
        <Col md={8} className="left-section" data-aos="fade-right">
          {/* Education */}
          <Card className="mb-3">
            <Card.Body>
              <h4>Education</h4>
              {profileData.education.length > 0 ? (
                profileData.education.map((edu, index) => (
                  <p key={index}>{`${edu.degree} at ${edu.university}`}</p>
                ))
              ) : (
                <p className="text-muted">No education added</p>
              )}
              <Button variant="outline-primary" onClick={() => navigate("/applicant/profile/edit-education")}>
                Edit Education
              </Button>
            </Card.Body>
          </Card>

          {/* Experience */}
          <Card className="mb-3">
            <Card.Body>
              <h4>Experience</h4>
              {profileData.experience.length > 0 ? (
                profileData.experience.map((exp, index) => (
                  <p key={index}>{`${exp.jobTitle} at ${exp.company}`}</p>
                ))
              ) : (
                <p className="text-muted">No experience added</p>
              )}
              <Button variant="outline-primary" onClick={() => navigate("/applicant/profile/edit-experience")}>
                Edit Experience
              </Button>
            </Card.Body>
          </Card>

          {/* Skills */}
          <Card className="mb-3">
            <Card.Body>
              <h4>Skills</h4>
              {profileData.skills.length > 0 ? (
                profileData.skills.map((skill, index) => <span key={index} className="skill-badge">{skill}</span>)
              ) : (
                <p className="text-muted">No skills added</p>
              )}
              <Button variant="outline-primary" onClick={() => navigate("/applicant/profile/edit-skills")} className="mt-2">
                Edit Skills
              </Button>
            </Card.Body>
          </Card>
        </Col>

        {/* CV Section */}
        <Col md={4} className="cv-section" data-aos="fade-left">
          <Card>
            <Card.Body className="text-center">
              <h4>CV</h4>
              {profileData.cv ? (
                <a href={profileData.cv} target="_blank" rel="noopener noreferrer" className="cv-link">
                  View CV
                </a>
              ) : (
                <p className="text-muted">No CV uploaded</p>
              )}
              <Button variant="outline-primary" onClick={() => navigate("/applicant/profile/edit-cv")} className="mt-2">
                Upload / Edit CV
              </Button>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default UserProfile;
