import { Card, ListGroup, Image, Alert } from 'react-bootstrap';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';

const ReviewProfile = ({ formData }) => {
  const [logoUrl, setLogoUrl] = useState(null);
  const [logoError, setLogoError] = useState(false);

  useEffect(() => {
    if (!formData?.logo) {
      setLogoUrl(null);
      return;
    }

    setLogoError(false);

    try {
      // Case 1: Logo is stored as an object with preview/file
      if (formData.logo.preview) {
        setLogoUrl(formData.logo.preview);
      } 
      // Case 2: Direct file object
      else if (formData.logo instanceof Blob || formData.logo instanceof File) {
        const url = URL.createObjectURL(formData.logo);
        setLogoUrl(url);
        // Cleanup function to revoke the object URL
        return () => URL.revokeObjectURL(url);
      }
      // Case 3: Base64 string or URL string
      else if (typeof formData.logo === 'string') {
        // Check if it's already a data URL
        if (formData.logo.startsWith('data:image')) {
          setLogoUrl(formData.logo);
        } 
        // Check if it's a base64 string without prefix
        else if (/^[A-Za-z0-9+/]+={0,2}$/.test(formData.logo)) {
          setLogoUrl(`data:image/jpeg;base64,${formData.logo}`);
        }
        // Assume it's a regular URL
        else {
          setLogoUrl(formData.logo);
        }
      }
    } catch (error) {
      console.error('Error processing logo:', error);
      setLogoError(true);
      setLogoUrl(null);
    }
  }, [formData?.logo]);

  if (!formData) {
    return (
      <Alert variant="danger" className="mt-4">
        No company data found. Please complete the profile setup.
      </Alert>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="mt-4 border-0 shadow-lg">
        <Card.Header 
          className="text-center py-3" 
          style={{ backgroundColor: '#901b20', color: 'white' }}
        >
          <motion.h3
            initial={{ y: -20 }}
            animate={{ y: 0 }}
            transition={{ type: 'spring', stiffness: 300 }}
          >
            {formData.basicInfo?.companyName || 'Company Profile'}
          </motion.h3>
        </Card.Header>

        <Card.Body>
          {/* Enhanced Logo Display */}
          <motion.div
            className="text-center mb-4"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 260, damping: 20 }}
          >
            {logoUrl && !logoError ? (
              <div>
                <Image 
                  src={logoUrl}
                  rounded
                  style={{ 
                    maxWidth: '200px',
                    maxHeight: '200px',
                    border: '3px solid #901b20',
                    objectFit: 'contain'
                  }}
                  alt="Company logo"
                  onError={() => {
                    console.log('Image load error for URL:', logoUrl);
                    setLogoError(true);
                  }}
                />
                <h5 className="mt-2" style={{ color: '#901b20' }}>Company Logo</h5>
              </div>
            ) : (
              <div className="d-flex flex-column align-items-center">
                <div 
                  className="d-flex align-items-center justify-content-center"
                  style={{
                    width: '200px',
                    height: '200px',
                    border: '2px dashed #ccc',
                    borderRadius: '4px',
                    backgroundColor: '#f8f9fa'
                  }}
                >
                  <span className="text-muted">No Logo Available</span>
                </div>
                <h5 className="mt-2 text-muted">Company Logo</h5>
              </div>
            )}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="mb-3 border-0 shadow-sm">
              <Card.Header style={{ backgroundColor: '#f8f9fa' }}>
                <h5 style={{ color: '#901b20' }}>Basic Information</h5>
              </Card.Header>
              <ListGroup variant="flush">
                {[
                  { label: 'Company Name', value: formData.basicInfo.companyName },
                  { label: 'Industry', value: formData.basicInfo.industry },
                  { label: 'Founded Year', value: formData.basicInfo.foundedYear },
                  { label: 'Website', value: formData.basicInfo.website, isLink: true },
                  { label: 'Company Size', value: formData.basicInfo.companySize },
                  { label: 'Company Type', value: formData.basicInfo.companyType },
                  { label: 'Headquarters', value: formData.basicInfo.headquarters },
                  { label: 'Specialties', value: formData.basicInfo.specialties },
                  { 
                    label: 'Social Media', 
                    value: (
                      <>
                        <div>LinkedIn: {formData.basicInfo.socialMedia.linkedin || 'Not specified'}</div>
                        <div>Twitter: {formData.basicInfo.socialMedia.twitter || 'Not specified'}</div>
                        <div>Facebook: {formData.basicInfo.socialMedia.facebook || 'Not specified'}</div>
                      </>
                    ) 
                  }
                ].map((item, index) => (
                  <ListGroup.Item key={index}>
                    <strong>{item.label}:</strong> {item.isLink && item.value ? (
                      <a 
                        href={item.value.startsWith('http') ? item.value : `https://${item.value}`}
                        target="_blank" 
                        rel="noopener noreferrer"
                        style={{ color: '#901b20' }}
                      >
                        {item.value}
                      </a>
                    ) : item.value || 'Not specified'}
                  </ListGroup.Item>
                ))}
              </ListGroup>
            </Card>
          </motion.div>

          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="mb-3 border-0 shadow-sm">
              <Card.Header style={{ backgroundColor: '#f8f9fa' }}>
                <h5 style={{ color: '#901b20' }}>Contact Information</h5>
              </Card.Header>
              <ListGroup variant="flush">
                {[
                  { label: 'Email', value: formData.contactInfo.email },
                  { label: 'Phone', value: formData.contactInfo.phone },
                  { label: 'Mobile', value: formData.contactInfo.mobile },
                  { label: 'Address', value: formData.contactInfo.address },
                  { label: 'City', value: formData.contactInfo.city },
                  { label: 'State/Province', value: formData.contactInfo.state },
                  { label: 'ZIP/Postal Code', value: formData.contactInfo.zipCode },
                  { label: 'Country', value: formData.contactInfo.country },
                  { label: 'Contact Person', value: formData.contactInfo.contactPerson },
                  { label: 'Contact Position', value: formData.contactInfo.contactPosition }
                ].map((item, index) => (
                  <ListGroup.Item key={index}>
                    <strong>{item.label}:</strong> {item.value || 'Not specified'}
                  </ListGroup.Item>
                ))}
              </ListGroup>
            </Card>
          </motion.div>

          {/* About Company */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card className="mb-3 border-0 shadow-sm">
              <Card.Header style={{ backgroundColor: '#f8f9fa' }}>
                <h5 style={{ color: '#901b20' }}>About Us</h5>
              </Card.Header>
              <Card.Body>
                {[
                  { title: 'Description', content: formData.about.description },
                  { title: 'Mission', content: formData.about.mission },
                  { title: 'Vision', content: formData.about.vision },
                  { title: 'Core Values', content: formData.about.values },
                  { title: 'Company History', content: formData.about.history },
                  { title: 'Company Culture', content: formData.about.culture },
                  { title: 'Key Achievements', content: formData.about.achievements },
                  { title: 'Certifications', content: formData.about.certifications },
                  { title: 'Awards', content: formData.about.awards },
                  { title: 'Strategic Partnerships', content: formData.about.partnerships }
                ].map((section, index) => (
                  section.content && (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.5 + index * 0.05 }}
                    >
                      <h5 className="mt-3" style={{ color: '#901b20' }}>{section.title}</h5>
                      <p className="text-muted">{section.content}</p>
                    </motion.div>
                  )
                ))}
              </Card.Body>
            </Card>
          </motion.div> 
        </Card.Body>
      </Card>
    </motion.div>
  );
};

export default ReviewProfile;
         