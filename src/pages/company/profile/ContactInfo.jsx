import { Form } from 'react-bootstrap';

const ContactInfo = ({ formData, handleChange }) => {
  return (
    <div className="form-section">
      <h4 className="mb-4">Contact Details</h4>
      <Form>
        <Form.Group className="mb-3">
          <Form.Label>Email</Form.Label>
          <Form.Control
            type="email"
            value={formData?.email || ''}
            onChange={(e) => handleChange('email', e.target.value)}
            placeholder="contact@company.com"
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Phone Number</Form.Label>
          <Form.Control
            type="tel"
            value={formData?.phone || ''}
            onChange={(e) => handleChange('phone', e.target.value)}
            placeholder="+1 (123) 456-7890"
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Mobile Number</Form.Label>
          <Form.Control
            type="tel"
            value={formData?.mobile || ''}
            onChange={(e) => handleChange('mobile', e.target.value)}
            placeholder="Mobile phone number"
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Address</Form.Label>
          <Form.Control
            type="text"
            value={formData?.address || ''}
            onChange={(e) => handleChange('address', e.target.value)}
            placeholder="Street address"
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>City</Form.Label>
          <Form.Control
            type="text"
            value={formData?.city || ''}
            onChange={(e) => handleChange('city', e.target.value)}
            placeholder="City"
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>State/Province</Form.Label>
          <Form.Control
            type="text"
            value={formData?.state || ''}
            onChange={(e) => handleChange('state', e.target.value)}
            placeholder="State or province"
          />
        </Form.Group>
      </Form>
    </div>
  );
};

export default ContactInfo;