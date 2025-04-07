import React, { useState } from "react";
import "./register.css";

const CompanyRegister = () => {
  const [formData, setFormData] = useState({
    companyName: "",
    firstName: "",
    lastName: "",
    mobileNumber: "",
    businessEmail: "",
    password: "",
    role: "",
    confirmed: false,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form Submitted:", formData);
  };

  return (
    <div className="register-container animate-fadeIn">
      <h1 className="animate-slideUp">
        <i className="bi bi-building"></i> Create a company account
      </h1>
      <p className="animate-slideUp">Start posting jobs. No credit card needed.</p>

      <form className="register-form animate-scaleUp" onSubmit={handleSubmit}>
        <label><i className="bi bi-building"></i> Company name</label>
        <input type="text" name="companyName" value={formData.companyName} onChange={handleChange} required />

        <div className="input-group">
          <div>
            <label><i className="bi bi-person"></i> First name</label>
            <input type="text" name="firstName" value={formData.firstName} onChange={handleChange} required />
          </div>
          <div>
            <label><i className="bi bi-person"></i> Last name</label>
            <input type="text" name="lastName" value={formData.lastName} onChange={handleChange} required />
          </div>
        </div>

        <label><i className="bi bi-telephone"></i> Mobile number</label>
        <input type="tel" name="mobileNumber" value={formData.mobileNumber} onChange={handleChange} required />

        <label><i className="bi bi-envelope"></i> Business email</label>
        <input type="email" name="businessEmail" value={formData.businessEmail} onChange={handleChange} required />

        <label><i className="bi bi-key"></i> Create your password</label>
        <input type="password" name="password" value={formData.password} onChange={handleChange} required />

        <label><i className="bi bi-briefcase"></i> Which role are you hiring for?</label>
        <input type="text" name="role" value={formData.role} onChange={handleChange} placeholder="E.g. Account Manager" required />

        <div className="checkbox-container">
          <input type="checkbox" name="confirmed" checked={formData.confirmed} onChange={handleChange} />
          <label>
            <i className="bi bi-check-circle"></i> I confirm that I am authorized to use ..... services.
          </label>
        </div>

        <button type="submit" className="animate-bounce">
          <i className="bi bi-person-plus"></i> Register
        </button>
      </form>
    </div>
  );
};

export default CompanyRegister;
