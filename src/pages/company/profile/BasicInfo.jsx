import { Form } from 'react-bootstrap';
import { useState } from 'react';


const BasicInfo = ({ formData, handleChange }) => {
  const [previewUrl, setPreviewUrl] = useState(null);

  const handleLogoChange = async (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      
      try {
        const base64String = await convertToBase64(file);
        setPreviewUrl(base64String);
        handleChange('logo', {
          file: file,
          preview: base64String,
          name: file.name
        });
      } catch (error) {
        console.error("Error processing logo:", error);
      }
    } else {
      setPreviewUrl(null);
      handleChange('logo', null);
    }
  };

  const convertToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = error => reject(error);
    });
  };

  return (
    <div className="form-section">
      <h4 className="mb-4">Basic Information</h4>
      <Form.Group className="mb-3">
        <Form.Label>Company Logo</Form.Label>
        <Form.Control 
          type="file"
          accept="image/*"
          onChange={handleLogoChange}
        />
        {/* Show preview if available */}
        {previewUrl && (
          <div className="mt-3 text-center">
            <img 
              src={previewUrl}
              alt="Logo preview"
              style={{
                maxWidth: '200px',
                maxHeight: '200px',
                border: '1px solid #ddd',
                borderRadius: '4px'
              }}
            />
            <div className="mt-1">
              <small>Selected file: {formData?.logo?.name}</small>
            </div>
          </div>
        )}
      </Form.Group>
      <Form>
        <Form.Group className="mb-3">
          <Form.Label>Company Name</Form.Label>
          <Form.Control
            type="text"
            value={formData?.companyName || ''}
            onChange={(e) => handleChange('companyName', e.target.value)}
            placeholder="Salma"
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Industry</Form.Label>
          <Form.Control
            type="text"
            value={formData?.industry || ''}
            onChange={(e) => handleChange('industry', e.target.value)}
            placeholder="e.g. Technology, Healthcare, Retail"
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Founded Year</Form.Label>
          <Form.Control
            type="number"
            value={formData?.foundedYear || ''}
            onChange={(e) => handleChange('foundedYear', e.target.value)}
            placeholder="e.g. 2020"
            min="1900"
            max={new Date().getFullYear()}
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Website</Form.Label>
          <Form.Control
            type="url"
            value={formData?.website || ''}
            onChange={(e) => handleChange('website', e.target.value)}
            placeholder="https://example.com"
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Company Size</Form.Label>
          <Form.Select
            value={formData?.companySize || ''}
            onChange={(e) => handleChange('companySize', e.target.value)}
          >
            <option value="">Select company size</option>
            <option value="1-10">1-10 employees</option>
            <option value="11-50">11-50 employees</option>
            <option value="51-200">51-200 employees</option>
            <option value="201-500">201-500 employees</option>
            <option value="501-1000">501-1000 employees</option>
            <option value="1001+">1001+ employees</option>
          </Form.Select>
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Company Type</Form.Label>
          <Form.Select
            value={formData?.companyType || ''}
            onChange={(e) => handleChange('companyType', e.target.value)}
          >
            <option value="">Select company type</option>
            <option value="Public">Public</option>
            <option value="Private">Private</option>
            <option value="Non-profit">Non-profit</option>
            <option value="Government">Government</option>
          </Form.Select>
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Headquarters Location</Form.Label>
          <Form.Control
            type="text"
            value={formData?.headquarters || ''}
            onChange={(e) => handleChange('headquarters', e.target.value)}
            placeholder="City, Country"
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Specialties</Form.Label>
          <Form.Control
            type="text"
            value={formData?.specialties || ''}
            onChange={(e) => handleChange('specialties', e.target.value)}
            placeholder="Comma separated list of specialties"
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>LinkedIn</Form.Label>
          <Form.Control
            type="url"
            value={formData?.socialMedia?.linkedin || ''}
            onChange={(e) => handleChange('socialMedia.linkedin', e.target.value)}
            placeholder="https://linkedin.com/company/your-company"
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Twitter</Form.Label>
          <Form.Control
            type="url"
            value={formData?.socialMedia?.twitter || ''}
            onChange={(e) => handleChange('socialMedia.twitter', e.target.value)}
            placeholder="https://twitter.com/yourcompany"
          />
        </Form.Group>
      </Form>
    </div>
  );
};

export default BasicInfo;
