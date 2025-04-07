import { Form } from 'react-bootstrap';

const AboutCompany = ({ formData, handleChange }) => {
  return (
    <div className="form-section">
      <h4 className="mb-4">About Company</h4>
      <Form>
        <Form.Group className="mb-3">
          <Form.Label>Company Description</Form.Label>
          <Form.Control 
            as="textarea" 
            rows={5}
            value={formData?.description || ''}
            onChange={(e) => handleChange('description', e.target.value)}
            placeholder="Tell us about your company"
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Mission Statement</Form.Label>
          <Form.Control 
            as="textarea" 
            rows={3}
            value={formData?.mission || ''}
            onChange={(e) => handleChange('mission', e.target.value)}
            placeholder="Your company's mission"
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Vision Statement</Form.Label>
          <Form.Control 
            as="textarea" 
            rows={3}
            value={formData?.vision || ''}
            onChange={(e) => handleChange('vision', e.target.value)}
            placeholder="Your company's vision"
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Core Values</Form.Label>
          <Form.Control 
            as="textarea" 
            rows={3}
            value={formData?.values || ''}
            onChange={(e) => handleChange('values', e.target.value)}
            placeholder="List your core values"
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Company History</Form.Label>
          <Form.Control 
            as="textarea" 
            rows={3}
            value={formData?.history || ''}
            onChange={(e) => handleChange('history', e.target.value)}
            placeholder="Company history timeline"
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Company Culture</Form.Label>
          <Form.Control 
            as="textarea" 
            rows={3}
            value={formData?.culture || ''}
            onChange={(e) => handleChange('culture', e.target.value)}
            placeholder="Describe your work culture"
          />
        </Form.Group>
      </Form>
    </div>
  );
};

export default AboutCompany;