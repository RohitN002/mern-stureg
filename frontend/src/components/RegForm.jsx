import React, { useState } from 'react';
import { Form, Button } from 'react-bootstrap';
import axios from 'axios';

const RegistrationForm = () => {
  const [formData, setFormData] = useState({
    studentName: '',
    dob: '',
    fatherName: '',
    mobileNumber: '',
    collegeName: '',
    courseDetails: '',
    areaOfInterest: [], // array for multi-select
    programmingSkills: [], // array for multi-select
    address: '',
    yearOfPassingOut: '',
    email: '',
    resume: null,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleMultiSelectChange = (e) => {
    const { name, options } = e.target;
    const values = [];
    for (let i = 0; i < options.length; i++) {
      if (options[i].selected) {
        values.push(options[i].value);
      }
    }
    setFormData({ ...formData, [name]: values });
  };

  const handleFileChange = (e) => {
    setFormData({ ...formData, resume: e.target.files[0] });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const data = new FormData();
    for (const key in formData) {
      if (Array.isArray(formData[key])) {
        formData[key].forEach(value => {
          data.append(key, value);
        });
      } else {
        data.append(key, formData[key]);
      }
    }
    axios.post('https://backend-srf.onrender.com/register', data)
      .then(response => {
        console.log('Success:', response.data);
      })
      .catch(error => {
        console.error('Error:', error);
      });
  };

  return (
    <Form onSubmit={handleSubmit}>
      <Form.Group controlId="studentName">
        <Form.Label>Student Name</Form.Label>
        <Form.Control type="text" name="studentName" value={formData.studentName} onChange={handleChange} required />
      </Form.Group>

      <Form.Group controlId="dob">
        <Form.Label>Date of Birth (dd/mm/yy)</Form.Label>
        <Form.Control type="date" name="dob" value={formData.dob} onChange={handleChange} required />
      </Form.Group>

      <Form.Group controlId="fatherName">
        <Form.Label>Father Name</Form.Label>
        <Form.Control type="text" name="fatherName" value={formData.fatherName} onChange={handleChange} required />
      </Form.Group>

      <Form.Group controlId="mobileNumber">
        <Form.Label>Mobile Number with Country Code</Form.Label>
        <Form.Control type="tel" name="mobileNumber" pattern="\+\d{1,4}[-\s]\d{10}" value={formData.mobileNumber} onChange={handleChange} required />
      </Form.Group>

      <Form.Group controlId="collegeName">
        <Form.Label>College Name</Form.Label>
        <Form.Control type="text" name="collegeName" value={formData.collegeName} onChange={handleChange} required />
      </Form.Group>

      <Form.Group controlId="courseDetails">
        <Form.Label>Course Details</Form.Label>
        <Form.Control as="select" name="courseDetails" value={formData.courseDetails} onChange={handleChange} required>
          <option value="">Select Course</option>
          <option value="BA">BA</option>
          <option value="BE">BE</option>
          <option value="B.COM">B.COM</option>
          <option value="BCA">BCA</option>
          <option value="MCA">MCA</option>
          <option value="MBA">MBA</option>
          <option value="M.COM">M.COM</option>
          <option value="BSC">BSC</option>
          <option value="MSC">MSC</option>
          <option value="ME">ME</option>
        </Form.Control>
      </Form.Group>

      <Form.Group controlId="areaOfInterest">
        <Form.Label>Area of Interest</Form.Label>
        <Form.Control as="select" multiple name="areaOfInterest" value={formData.areaOfInterest} onChange={handleMultiSelectChange} required>
          <option value="AI">AI</option>
          <option value="machine learning">Machine Learning</option>
          <option value="testing">Testing</option>
          <option value="devops">DevOps</option>
          <option value="web development">Web Development</option>
        </Form.Control>
      </Form.Group>

      <Form.Group controlId="programmingSkills">
        <Form.Label>Programming Skills</Form.Label>
        <Form.Control as="select" multiple name="programmingSkills" value={formData.programmingSkills} onChange={handleMultiSelectChange} required>
          <option value="javascript">JavaScript</option>
          <option value="java">Java</option>
          <option value="python">Python</option>
          <option value=".net">.NET</option>
          <option value="c++">C++</option>
          <option value="go">Go</option>
          <option value="php">PHP</option>
        </Form.Control>
      </Form.Group>

      <Form.Group controlId="address">
        <Form.Label>Address</Form.Label>
        <Form.Control as="textarea" name="address" value={formData.address} onChange={handleChange} required />
      </Form.Group>

      <Form.Group controlId="yearOfPassingOut">
        <Form.Label>Year of Passing Out</Form.Label>
        {/* <Form.Control as="select" name="yearOfPassingOut" value={formData.yearOfPassingOut} onChange={handleChange} required>
          {[...Array(16).keys()].map(i => (
            <option key={2013 + i} value={2013 + i}>{2013 + i}</option>
          ))}
        </Form.Control> */}
        <Form.Control as="textarea" name="yearOfPassingOut" value={formData.yearOfPassingOut} onChange={handleChange} required />
      </Form.Group>

      <Form.Group controlId="email">
        <Form.Label>Email ID</Form.Label>
        <Form.Control type="email" name="email" value={formData.email} onChange={handleChange} required />
      </Form.Group>

      <Form.Group controlId="resume">
        <Form.Label>Upload Resume</Form.Label>
        <Form.Control type="file" name="resume" onChange={handleFileChange} required />
      </Form.Group>

      <Button variant="primary" type="submit">Register</Button>
    </Form>
  );
};

export default RegistrationForm;
