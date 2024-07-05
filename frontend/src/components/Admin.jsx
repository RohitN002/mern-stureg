import React, { useState, useEffect } from 'react';
import { Table, Form, Button, Pagination, Modal } from 'react-bootstrap';
import axios from 'axios';
import { saveAs } from 'file-saver';
import * as XLSX from 'xlsx';

const AdminDashboard = () => {
  const [students, setStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [filters, setFilters] = useState({
    studentName: '',
    dob: '',
    fatherName: '',
    mobileNumber: '',
    collegeName: '',
    courseDetails: '',
    areaOfInterest: '',
    programmingSkills: '',
    address: '',
    yearOfPassingOut: '',
    email: ''
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [appliedFilters, setAppliedFilters] = useState({});
  const [showResumeModal, setShowResumeModal] = useState(false);
  const [selectedResumePath, setSelectedResumePath] = useState('');

  const itemsPerPage = 10;

  useEffect(() => {
    axios.get('http://localhost:5000/students')
      .then(response => {
        setStudents(response.data);
        setFilteredStudents(response.data);
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      });
  }, []);

  useEffect(() => {
    applyFilters();
  }, [filters]);

  const debounce = (func, delay) => {
    let timer;
    return function() {
      const context = this;
      const args = arguments;
      clearTimeout(timer);
      timer = setTimeout(() => {
        func.apply(context, args);
      }, delay);
    };
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters({ ...filters, [name]: value });
  };

  const applyFilters = () => {
    const filtered = students.filter(student => {
      return Object.keys(filters).every(key =>
        student[key].toString().toLowerCase().includes(filters[key].toString().toLowerCase())
      );
    });
    setFilteredStudents(filtered);
    setCurrentPage(1);
    setAppliedFilters(filters); // Update applied filters state
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleDownloadSelected = () => {
    const selectedData = filteredStudents.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
    const worksheet = XLSX.utils.json_to_sheet(selectedData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Students');
    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const data = new Blob([excelBuffer], { type: 'application/octet-stream' });
    saveAs(data, 'students.xlsx');
  };

  const handleDownloadResume = (path) => {
    axios.get(`https://backend-srf.onrender.com/download-resume/${path}`, { responseType: 'blob' })
      .then(response => {
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', path);
        document.body.appendChild(link);
        link.click();
      })
      .catch(error => {
        console.error('Error downloading resume:', error);
      });
  };

  const handleViewResume = (path) => {
    setSelectedResumePath(path);
    setShowResumeModal(true);
  };

  const handleModalClose = () => {
    setShowResumeModal(false);
    setSelectedResumePath('');
  };

  const handleClearFilters = () => {
    setFilters({
      studentName: '',
      dob: '',
      fatherName: '',
      mobileNumber: '',
      collegeName: '',
      courseDetails: '',
      areaOfInterest: '',
      programmingSkills: '',
      address: '',
      yearOfPassingOut: '',
      email: ''
    });
    setAppliedFilters({}); // Clear applied filters state
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear().toString().slice(2);
    return `${day}/${month}/${year}`;
  };

  const currentData = filteredStudents.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <div>
      <h1>Admin Dashboard</h1>
     
        <Form>
          {/* Add Form.Control for each filter field */}
          <Form.Group controlId="filterStudentName">
            <Form.Label>Student Name</Form.Label>
            <Form.Control type="text" name="studentName" value={filters.studentName} onChange={handleFilterChange} />
          </Form.Group>
          <Form.Group controlId="filterDob">
            <Form.Label>Date of Birth</Form.Label>
            <Form.Control type="date" name="dob" value={filters.dob} onChange={handleFilterChange} />
          </Form.Group>
          <Form.Group controlId="filterFatherName">
            <Form.Label>Father Name</Form.Label>
            <Form.Control type="text" name="fatherName" value={filters.fatherName} onChange={handleFilterChange} />
          </Form.Group>
          <Form.Group controlId="filterMobileNumber">
            <Form.Label>Mobile Number</Form.Label>
            <Form.Control type="text" name="mobileNumber" value={filters.mobileNumber} onChange={handleFilterChange} />
          </Form.Group>
          <Form.Group controlId="filterCollegeName">
            <Form.Label>College Name</Form.Label>
            <Form.Control type="text" name="collegeName" value={filters.collegeName} onChange={handleFilterChange} />
          </Form.Group>
          <Form.Group controlId="filterCourseDetails">
            <Form.Label>Course Details</Form.Label>
            <Form.Control type="text" name="courseDetails" value={filters.courseDetails} onChange={handleFilterChange} />
          </Form.Group>
          <Form.Group controlId="filterAreaOfInterest">
            <Form.Label>Area of Interest</Form.Label>
            <Form.Control type="text" name="areaOfInterest" value={filters.areaOfInterest} onChange={handleFilterChange} />
          </Form.Group>
          <Form.Group controlId="filterProgrammingSkills">
            <Form.Label>Programming Skills</Form.Label>
            <Form.Control type="text" name="programmingSkills" value={filters.programmingSkills} onChange={handleFilterChange} />
          </Form.Group>
          <Form.Group controlId="filterAddress">
            <Form.Label>Address</Form.Label>
            <Form.Control type="text" name="address" value={filters.address} onChange={handleFilterChange} />
          </Form.Group>
          <Form.Group controlId="filterYearOfPassingOut">
            <Form.Label>Year of Passing Out</Form.Label>
            <Form.Control type="text" name="yearOfPassingOut" value={filters.yearOfPassingOut} onChange={handleFilterChange} />
          </Form.Group>
          <Form.Group controlId="filterEmail">
            <Form.Label>Email</Form.Label>
            <Form.Control type="text" name="email" value={filters.email} onChange={handleFilterChange} />
          </Form.Group>
          <Button variant="primary" onClick={applyFilters}>Apply Filters</Button>{' '}
          <Button variant="secondary" onClick={handleClearFilters}>Clear Filters</Button>
        </Form>
    
      
      {/* Display applied filters */}
      <div style={{ marginTop: '20px' }}>
        {Object.keys(appliedFilters).length > 0 && (
          <div>
            <h4>Applied Filters:</h4>
            <ul>
              {Object.entries(appliedFilters).map(([key, value]) => (
                <li key={key}>
                  <strong>{key}:</strong> {value}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
      
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>#</th>
            <th>Student Name</th>
            <th>Date of Birth</th>
            <th>Father Name</th>
            <th>Mobile Number</th>
            <th>College Name</th>
            <th>Course Details</th>
            <th>Area of Interest</th>
            <th>Programming Skills</th>
            <th>Address</th>
            <th>Year of Passing Out</th>
            <th>Email</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {currentData.map((student, index) => (
            <tr key={student.id}>
              <td>{(currentPage - 1) * itemsPerPage + index + 1}</td>
              <td>{student.studentName}</td>
              <td>{formatDate(student.dob)}</td>
              <td>{student.fatherName}</td>
              <td>{student.mobileNumber}</td>
              <td>{student.collegeName}</td>
              <td>{student.courseDetails}</td>
              <td>{student.areaOfInterest}</td>
              <td>{student.programmingSkills}</td>
              <td>{student.address}</td>
              <td>{student.yearOfPassingOut}</td>
              <td>{student.email}</td>
              <td>
                <Button variant="link" onClick={() => handleDownloadResume(student.resume)}>Download Resume</Button>{' '}
                <Button variant="link" onClick={() => handleViewResume(student.resume)}>View Resume</Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
      
      {/* Pagination */}
      <Pagination>
        {[...Array(Math.ceil(filteredStudents.length / itemsPerPage)).keys()].map(page => (
          <Pagination.Item key={page + 1} active={page + 1 === currentPage} onClick={() => handlePageChange(page + 1)}>
            {page + 1}
          </Pagination.Item>
        ))}
      </Pagination>
      
      {/* Modal for viewing resumes */}
      <Modal show={showResumeModal} onHide={handleModalClose}>
        <Modal.Header closeButton>
          <Modal.Title>View Resume</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <iframe
            src={`https://backend-srf.onrender.com/download-pdf/${selectedResumePath}`}
            title="Resume"
            width="100%"
            height="500px"
          />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleModalClose}>Close</Button>
        </Modal.Footer>
      </Modal>
      
      {/* Download Selected Data Button */}
      <div style={{ marginTop: '20px' }}>
        <Button variant="primary" onClick={handleDownloadSelected}>Download Selected Data</Button>
      </div>
    </div>
  );
};

export default AdminDashboard;
