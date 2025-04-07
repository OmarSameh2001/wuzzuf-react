import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Row, Col, ProgressBar, Button, Alert } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import BasicInfo from './BasicInfo';
import ContactInfo from './ContactInfo';
import AboutCompany from './AboutCompany';
import ReviewProfile from './ReviewProfile';
import './Company.css';
import { CheckCircleFill } from 'react-bootstrap-icons';

const CompanyProfile = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [isSubmitted, setIsSubmitted] = useState(false);
  
  // Enhanced form data state with additional fields
  const [formData, setFormData] = useState({
    logo: null,
    basicInfo: {
      companyName: '',
      industry: '',
      foundedYear: '',
      website: '',
      companySize: '',
      companyType: '', // e.g., Public, Private, Non-profit
      headquarters: '',
      specialties: '', // Comma-separated list
      socialMedia: {
        linkedin: '',
        twitter: '',
        facebook: ''
      }
    },
    contactInfo: {
      email: '',
      phone: '',
      mobile: '',
      address: '',
      city: '',
      state: '',
      zipCode: '',
      country: '',
      contactPerson: '',
      contactPosition: ''
    },
    about: {
      description: '',
      mission: '',
      vision: '',
      values: '',
      history: '',
      culture: '',
      achievements: '',
      certifications: '',
      awards: '',
      partnerships: ''
    }
  });

  const handleChange = (section, field, value) => {
    // If the field contains a dot, it means we're dealing with a nested object
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      setFormData(prev => ({
        ...prev,
        [section]: {
          ...prev[section],
          [parent]: {
            ...prev[section][parent],
            [child]: value
          }
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [section]: {
          ...prev[section],
          [field]: value
        }
      }));
    }
  };
  
  // Update how you pass the handleChange to child components
 // In CompanyProfile.jsx
const steps = [
    { 
      title: 'Basic Information', 
      component: <BasicInfo 
        formData={formData.basicInfo} 
        handleChange={(field, value) => handleChange('basicInfo', field, value)} 
      /> 
    },
    { 
      title: 'Contact Details', 
      component: <ContactInfo 
        formData={formData.contactInfo} 
        handleChange={(field, value) => handleChange('contactInfo', field, value)} 
      /> 
    },
    { 
      title: 'About Company', 
      component: <AboutCompany 
        formData={formData.about} 
        handleChange={(field, value) => handleChange('about', field, value)} 
      /> 
    },
    { title: 'Review', component: <ReviewProfile formData={formData} /> }
  ];

  // ... rest of your component remains the same ...
  const nextStep = () => step < steps.length && setStep(step + 1);
  const prevStep = () => step > 1 && setStep(step - 1);

  const handleSubmit = () => {
    setIsSubmitted(true);
    setTimeout(() => {
      navigate('/company/profile/view', { 
        state: { companyData: formData } 
      });
    }, 2000);
  };

  if (isSubmitted) {
    return (
      <Container className="py-5 text-center">
        <CheckCircleFill color="#28a745" size={64} className="mb-3" />
        <h3 style={{ color: '#28a745' }}>Profile Submitted Successfully!</h3>
        <p>Redirecting to your company profile...</p>
      </Container>
    );
  }

  const currentStep = steps[step - 1];

  return (
    <Container className="py-5">
      <h2 className="text-center mb-4" style={{ color: '#901b20' }}>Company Profile Setup</h2>
      
      {/* Progress Bar */}
      <Row className="mb-5">
        <Col>
          <ProgressBar now={(step / steps.length) * 100} className="custom-progress" />
          <div className="d-flex justify-content-between mt-2">
            {steps.map((item, index) => (
              <div 
                key={index} 
                className={`step-indicator ${step > index ? 'completed' : ''} ${step === index + 1 ? 'active' : ''}`}
                style={{ color: step >= index + 1 ? '#901b20' : '#6c757d' }}
              >
                {item.title}
              </div>
            ))}
          </div>
        </Col>
      </Row>

      {/* Current Step Content */}
      <Row className="mb-4">
        <Col>
          {currentStep.component}
        </Col>
      </Row>

      {/* Navigation Buttons */}
      <Row>
        <Col className="d-flex justify-content-between">
          <Button 
            variant="outline-primary" 
            onClick={prevStep} 
            disabled={step === 1}
            style={{ borderColor: '#901b20', color: '#901b20' }}
          >
            Previous
          </Button>
          
          {step < steps.length ? (
            <Button 
              variant="primary" 
              onClick={nextStep}
              style={{ backgroundColor: '#901b20', borderColor: '#901b20' }}
            >
              Next
            </Button>
          ) : (
            <Button 
              variant="success"
              onClick={handleSubmit}
            >
              Submit Profile
            </Button>
          )}
        </Col>
      </Row>
    </Container>
  );
};

export default CompanyProfile;