import { useParams } from 'react-router-dom';
import { Card, ListGroup, Image, Alert, Badge, Row, Col, Container, Spinner } from 'react-bootstrap';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { fetchCompanyData } from '../../../services/companyApi';
const ProfileView = () => {
  const { id } = useParams();
  const [companyData, setCompanyData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await fetchCompanyData(id);
        setCompanyData(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [id]);

  if (loading) {
    return (
      <Container className="py-5 text-center">
        <Spinner animation="border" role="status" variant="primary">
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
                <h1 className="h2 mb-1">
                  {getSafe('basicInfo.companyName', 'Company Profile')}
                </h1>
                {getSafe('basicInfo.industry') && (
                  <Badge bg="light" text="dark">
                    {getSafe('basicInfo.industry')}
                  </Badge>
                )}
              </motion.div>
            </div>
          </Card.Header>

          <Card.Body className="p-4">
            {/* Logo Section */}
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
                    onError={() => setLogoError(true)}
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
                          { icon: <Calendar />, label: 'Founded', value: getSafe('basicInfo.foundedYear') },
                          { icon: <People />, label: 'Company Size', value: getSafe('basicInfo.companySize') },
                          { icon: <Award />, label: 'Company Type', value: getSafe('basicInfo.companyType') },
                          { icon: <GeoAlt />, label: 'Headquarters', value: getSafe('basicInfo.headquarters') },
                          { icon: <Globe />, label: 'Website', value: getSafe('basicInfo.website'), isLink: true }
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
                                ) : item.value}
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
                          { icon: <Envelope />, label: 'Email', value: getSafe('contactInfo.email') },
                          { icon: <Telephone />, label: 'Phone', value: getSafe('contactInfo.phone') },
                          { icon: <Telephone />, label: 'Mobile', value: getSafe('contactInfo.mobile') },
                          { 
                            icon: <GeoAlt />, 
                            label: 'Address', 
                            value: getSafe('contactInfo.address') ? (
                              <>
                                {getSafe('contactInfo.address')}<br />
                                {getSafe('contactInfo.city') && `${getSafe('contactInfo.city')}, `}
                                {getSafe('contactInfo.state')} {getSafe('contactInfo.zipCode')}<br />
                                {getSafe('contactInfo.country')}
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
                        {getSafe('about.description', 'No description provided')}
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
                          {getSafe('about.mission') && (
                            <div className="mb-3">
                              <h6 className="text-muted">Mission</h6>
                              <p>{getSafe('about.mission')}</p>
                            </div>
                          )}
                          {getSafe('about.vision') && (
                            <div>
                              <h6 className="text-muted">Vision</h6>
                              <p>{getSafe('about.vision')}</p>
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
                          {getSafe('about.values') ? (
                            <p>{getSafe('about.values')}</p>
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
                      {getSafe('about.culture') ? (
                        <p>{getSafe('about.culture')}</p>
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
                      
                      {getSafe('about.achievements') && (
                        <div className="mb-3">
                          <h6 className="text-muted">Key Achievements</h6>
                          <p>{getSafe('about.achievements')}</p>
                        </div>
                      )}
                      
                      {getSafe('about.certifications') && (
                        <div className="mb-3">
                          <h6 className="text-muted">Certifications</h6>
                          <p>{getSafe('about.certifications')}</p>
                        </div>
                      )}
                      
                      {getSafe('about.awards') && (
                        <div className="mb-3">
                          <h6 className="text-muted">Awards</h6>
                          <p>{getSafe('about.awards')}</p>
                        </div>
                      )}
                      
                      {getSafe('about.partnerships') && (
                        <div>
                          <h6 className="text-muted">Strategic Partnerships</h6>
                          <p>{getSafe('about.partnerships')}</p>
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