import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Container, Row, Col, ProgressBar, Button, Alert, Spinner } from 'react-bootstrap';
import BasicInfo from './BasicInfo';
import ContactInfo from './ContactInfo';
import AboutCompany from './AboutCompany';
import ReviewProfile from './ReviewProfile';
import { CheckCircleFill } from 'react-bootstrap-icons';
import { saveCompanyData, fetchCompanyData } from '../../../services/companyApi';
import './Company.css'; // Assuming you have some CSS for styling
const CompanyProfile = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [step, setStep] = useState(1);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  
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

  // Load existing data if editing
  useEffect(() => {
    if (id) {
      const loadData = async () => {
        setIsLoading(true);
        try {
          const data = await fetchCompanyData(id);
          setFormData(data);
        } catch (err) {
          setError(err.message);
        } finally {
          setIsLoading(false);
        }
      };
      loadData();
    }
  }, [id]);

  const handleChange = (section, field, value) => {
    // Special handling for logo
    if (section === 'logo') {
      setFormData(prev => ({
        ...prev,
        logo: value // value should be { file, preview, name } or null
      }));
      return;
    }

    // Handle nested fields (like socialMedia.linkedin)
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

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      const savedData = await saveCompanyData(formData);
      setIsSubmitted(true);
      setTimeout(() => {
        navigate(`/company/profile/view/${savedData.id}`);
      }, 2000);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

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
      {isLoading && <Spinner animation="border" />}
      {error && <Alert variant="danger">{error}</Alert>}
      <h2 className="text-center mb-4" style={{ color: '#901b20' }}>Company Profile Setup</h2>
      
      {/* Progress Bar */}
      <Row className="mb-5">
        <Col>
        <ProgressBar 
              now={(step / steps.length) * 100} 
              className="custom-progress"
              style={{ 
                backgroundColor: '#f8f9fa', // Light background
                height: '10px' 
              }}
            />          
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

