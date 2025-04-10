import { useParams, Link } from 'react-router-dom';
import { Card, ListGroup, Image, Alert, Badge, Row, Col, Container, Spinner } from 'react-bootstrap';
import { 
  Envelope, 
  Telephone, 
  GeoAlt, 
  Globe, 
  Building, 
  Calendar, 
  People, 
  Award,
  Briefcase,
  PatchCheck,
  Trophy,
  Handshake
} from 'react-bootstrap-icons';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import axios from 'axios';

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1, 
    transition: { 
      duration: 0.5,
      when: "beforeChildren",
      staggerChildren: 0.1
    } 
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

const logoVariants = {
  hidden: { scale: 0, opacity: 0 },
  visible: { 
    scale: 1, 
    opacity: 1,
    transition: { type: 'spring', stiffness: 260, damping: 20 }
  }
};

const ProfileView = () => {
  const { id } = useParams();
  const [companyData, setCompanyData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [logoUrl, setLogoUrl] = useState(null);
  const [logoError, setLogoError] = useState(false);

  useEffect(() => {
    const fetchCompanyData = async () => {
      try {
        const response = await axios.get(`/user/company/${id}/`);
        setCompanyData(response.data);
        
        // Handle logo if present in response
        if (response.data.logo) {
          setLogoError(false);
          // Handle different logo formats
          if (response.data.logo instanceof Blob || response.data.logo instanceof File) {
            const url = URL.createObjectURL(response.data.logo);
            setLogoUrl(url);
            return () => URL.revokeObjectURL(url);
          } else if (typeof response.data.logo === 'string') {
            // Handle both URL and base64 strings
            if (response.data.logo.startsWith('data:image') || 
                /^[A-Za-z0-9+/]+={0,2}$/.test(response.data.logo)) {
              setLogoUrl(response.data.logo.startsWith('data:') ? 
                response.data.logo : `data:image/jpeg;base64,${response.data.logo}`);
            } else {
              setLogoUrl(response.data.logo);
            }
          }
        }
      } catch (err) {
        console.error('Error fetching company data:', err);
        setError(err.message || 'Failed to fetch company data');
      } finally {
        setLoading(false);
      }
    };

    fetchCompanyData();
  }, [id]);

  if (loading) {
    return (
      <Container className="py-5 text-center">
        <Spinner animation="border" role="status" style={{ color: '#901b20' }}>
          <span className="visually-hidden">Loading...</span>
        </Spinner>
        <p className="mt-3">Loading company profile...</p>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="py-5 text-center">
        <Alert variant="danger">
          <h3>Error Loading Profile</h3>
          <p>{error}</p>
          <Link 
            to="/" 
            className="btn px-4 py-2 mt-3"
            style={{ backgroundColor: '#901b20', color: 'white' }}
          >
            Return Home
          </Link>
        </Alert>
      </Container>
    );
  }

  if (!companyData) {
    return (
      <Container className="py-5 text-center">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <Alert variant="light" className="shadow-sm">
            <h3 className="text-muted mb-3">No Profile Data Found</h3>
            <Link 
              to="/company/profile" 
              className="btn px-4 py-2 mt-3"
              style={{ backgroundColor: '#901b20', color: 'white' }}
            >
              Go to Profile Setup
            </Link>
          </Alert>
        </motion.div>
      </Container>
    );
  }

  return (
    <Container className="py-4">
      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        <Card className="border-0 shadow-lg">
          {/* Header Section */}
          <Card.Header 
            className="text-white py-4"
            style={{ backgroundColor: '#901b20' }}
          >
            <div className="d-flex justify-content-between align-items-center">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
              >
                <h1 className="h2 mb-1">{companyData.basicInfo.companyName}</h1>
                {companyData.basicInfo.industry && (
                  <Badge bg="light" text="dark">
                    {companyData.basicInfo.industry}
                  </Badge>
                )}
              </motion.div>
            </div>
          </Card.Header>

          <Card.Body className="p-4">
            {/* Dedicated Logo Section */}
            <motion.div 
              className="text-center mb-4"
              variants={logoVariants}
              initial="hidden"
              animate="visible"
            >
              {logoUrl && !logoError ? (
                <div>
                  <Image 
                    src={logoUrl}
                    roundedCircle
                    style={{
                      width: '150px',
                      height: '150px',
                      objectFit: 'cover',
                      border: '4px solid #901b20',
                      boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
                    }}
                    alt="Company logo"
                    onError={() => {
                      console.log('Failed to load logo:', logoUrl);
                      setLogoError(true);
                    }}
                  />
                  <h4 className="mt-3" style={{ color: '#901b20' }}>Company Logo</h4>
                </div>
              ) : (
                <div className="d-flex flex-column align-items-center">
                  <div 
                    className="d-flex align-items-center justify-content-center rounded-circle"
                    style={{
                      width: '150px',
                      height: '150px',
                      backgroundColor: '#f0f0f0',
                      border: '4px dashed #901b20'
                    }}
                  >
                    <span className="text-muted">No Logo</span>
                  </div>
                  <h4 className="mt-3 text-muted">Company Logo</h4>
                </div>
              )}
            </motion.div>

            <Row>
              {/* Left Column - Basic Info */}
              <Col md={4}>
                <motion.div variants={itemVariants}>
                  <Card className="mb-4 border-0 shadow-sm">
                    <Card.Body>
                      <h5 className="mb-3" style={{ color: '#901b20' }}>
                        <Building className="me-2" />
                        Company Details
                      </h5>
                      
                      <ListGroup variant="flush" className="small">
                        {[
                          { icon: <Calendar />, label: 'Founded', value: companyData.basicInfo.foundedYear },
                          { icon: <People />, label: 'Company Size', value: companyData.basicInfo.companySize },
                          { icon: <Award />, label: 'Company Type', value: companyData.basicInfo.companyType },
                          { icon: <GeoAlt />, label: 'Headquarters', value: companyData.basicInfo.headquarters },
                          { icon: <Globe />, label: 'Website', value: companyData.basicInfo.website, isLink: true }
                        ].map((item, index) => (
                          <ListGroup.Item key={index} className="d-flex align-items-center py-2">
                            <span className="text-muted me-2">{item.icon}</span>
                            <div>
                              <div className="text-muted">{item.label}</div>
                              <div>
                                {item.isLink && item.value ? (
                                  <a 
                                    href={item.value.startsWith('http') ? item.value : `https://${item.value}`} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    style={{ color: '#901b20' }}
                                  >
                                    {item.value}
                                  </a>
                                ) : item.value || 'Not specified'}
                              </div>
                            </div>
                          </ListGroup.Item>
                        ))}
                      </ListGroup>
                    </Card.Body>
                  </Card>
                </motion.div>

                {/* Contact Info Card */}
                <motion.div variants={itemVariants}>
                  <Card className="border-0 shadow-sm">
                    <Card.Body>
                      <h5 className="mb-3" style={{ color: '#901b20' }}>
                        <Telephone className="me-2" />
                        Contact Information
                      </h5>
                      
                      <ListGroup variant="flush" className="small">
                        {[
                          { icon: <Envelope />, label: 'Email', value: companyData.contactInfo.email },
                          { icon: <Telephone />, label: 'Phone', value: companyData.contactInfo.phone },
                          { icon: <Telephone />, label: 'Mobile', value: companyData.contactInfo.mobile },
                          { 
                            icon: <GeoAlt />, 
                            label: 'Address', 
                            value: companyData.contactInfo.address ? (
                              <>
                                {companyData.contactInfo.address}<br />
                                {companyData.contactInfo.city && `${companyData.contactInfo.city}, `}
                                {companyData.contactInfo.state} {companyData.contactInfo.zipCode}<br />
                                {companyData.contactInfo.country}
                              </>
                            ) : null
                          }
                        ].map((item, index) => (
                          <ListGroup.Item key={index} className="d-flex align-items-center py-2">
                            <span className="text-muted me-2">{item.icon}</span>
                            <div>
                              <div className="text-muted">{item.label}</div>
                              <div>{item.value || 'Not specified'}</div>
                            </div>
                          </ListGroup.Item>
                        ))}
                      </ListGroup>
                    </Card.Body>
                  </Card>
                </motion.div>
              </Col>

              {/* Right Column - About Company */}
              <Col md={8}>
                <motion.div variants={itemVariants}>
                  <Card className="border-0 shadow-sm mb-4">
                    <Card.Body>
                      <h5 className="mb-3" style={{ color: '#901b20' }}>Company Description</h5>
                      <p className="text-muted">
                        {companyData.about.description || 'No description provided'}
                      </p>
                    </Card.Body>
                  </Card>
                </motion.div>

                <Row>
                  <Col md={6}>
                    <motion.div variants={itemVariants}>
                      <Card className="border-0 shadow-sm mb-4 h-100">
                        <Card.Body>
                          <h5 style={{ color: '#901b20' }}>Mission & Vision</h5>
                          {companyData.about.mission && (
                            <div className="mb-3">
                              <h6 className="text-muted">Mission</h6>
                              <p>{companyData.about.mission}</p>
                            </div>
                          )}
                          {companyData.about.vision && (
                            <div>
                              <h6 className="text-muted">Vision</h6>
                              <p>{companyData.about.vision}</p>
                            </div>
                          )}
                        </Card.Body>
                      </Card>
                    </motion.div>
                  </Col>
                  
                  <Col md={6}>
                    <motion.div variants={itemVariants}>
                      <Card className="border-0 shadow-sm mb-4 h-100">
                        <Card.Body>
                          <h5 style={{ color: '#901b20' }}>Core Values</h5>
                          {companyData.about.values ? (
                            <p>{companyData.about.values}</p>
                          ) : (
                            <p className="text-muted">No values specified</p>
                          )}
                        </Card.Body>
                      </Card>
                    </motion.div>
                  </Col>
                </Row>

                <motion.div variants={itemVariants}>
                  <Card className="border-0 shadow-sm mb-4">
                    <Card.Body>
                      <h5 style={{ color: '#901b20' }}>Company Culture</h5>
                      {companyData.about.culture ? (
                        <p>{companyData.about.culture}</p>
                      ) : (
                        <p className="text-muted">No culture description provided</p>
                      )}
                    </Card.Body>
                  </Card>
                </motion.div>

                <motion.div variants={itemVariants}>
                  <Card className="border-0 shadow-sm">
                    <Card.Body>
                      <h5 style={{ color: '#901b20' }}>
                        <Briefcase className="me-2" />
                        Achievements & Partnerships
                      </h5>
                      
                      {companyData.about.achievements && (
                        <div className="mb-3">
                          <h6 className="text-muted">
                            <Trophy className="me-1" />
                            Key Achievements
                          </h6>
                          <p>{companyData.about.achievements}</p>
                        </div>
                      )}
                      
                      {companyData.about.certifications && (
                        <div className="mb-3">
                          <h6 className="text-muted">
                            <PatchCheck className="me-1" />
                            Certifications
                          </h6>
                          <p>{companyData.about.certifications}</p>
                        </div>
                      )}
                      
                      {companyData.about.awards && (
                        <div className="mb-3">
                          <h6 className="text-muted">
                            <Award className="me-1" />
                            Awards
                          </h6>
                          <p>{companyData.about.awards}</p>
                        </div>
                      )}
                      
                      {companyData.about.partnerships && (
                        <div>
                          <h6 className="text-muted">
                            <Handshake className="me-1" />
                            Strategic Partnerships
                          </h6>
                          <p>{companyData.about.partnerships}</p>
                        </div>
                      )}
                    </Card.Body>
                  </Card>
                </motion.div>
              </Col>
            </Row>
          </Card.Body>

          <Card.Footer className="text-center py-3" style={{ backgroundColor: '#f8f9fa' }}>
            <small className="text-muted">
              Last updated: {new Date().toLocaleDateString()}
            </small>
          </Card.Footer>
        </Card>
      </motion.div>
    </Container>
  );
};

export default ProfileView;