const express = require('express');
const multer = require('multer');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');
const ExcelJS = require('exceljs');

dotenv.config();

const Student = require('./models/Student');

const Port = process.env.PORT;
const app = express();
app.use(cors());
app.use(express.json());

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Error connecting to MongoDB:', err));

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ storage });

// Endpoint to view resumes
app.get('/view-resume/:path', (req, res) => {
  const filePath = path.join(__dirname, 'uploads', req.params.path);
  res.sendFile(filePath);
});

// Endpoint to register students
app.post('/register', upload.single('resume'), (req, res) => {
  const { studentName, dob, fatherName, mobileNumber, collegeName, courseDetails, areaOfInterest, programmingSkills, address, yearOfPassingOut, email } = req.body;
  const resume = req.file.path;

  const student = new Student({
    studentName,
    dob,
    fatherName,
    mobileNumber,
    collegeName,
    courseDetails,
    areaOfInterest,
    programmingSkills,
    address,
    yearOfPassingOut,
    email,
    resume
  });

  student.save()
    .then(() => res.status(200).json({ message: 'Registration successful' }))
    .catch(err => {
      console.error('Error inserting data into MongoDB:', err);
      res.status(500).json({ error: 'Internal Server Error' });
    });
});

// Endpoint to fetch all students
app.get('/students', (req, res) => {
  Student.find({})
    .then(results => res.status(200).json(results))
    .catch(err => {
      console.error('Error fetching data from MongoDB:', err);
      res.status(500).json({ error: 'Internal Server Error' });
    });
});

app.get('/api/download-pdf/:filename', (req, res) => {
  const filePath = path.join(__dirname, 'uploads', req.params.filename);

  // Check if the resume file exists
  if (fs.existsSync(filePath)) {
    // Create a new PDF document
    const pdfDoc = new PDFDocument();

    // Set content disposition to force download
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=${req.params.filename.replace(/\.[^/.]+$/, "")}.pdf`);

    // Pipe the PDF document to the response
    pdfDoc.pipe(res);

    // Embed resume content in PDF
    pdfDoc.fontSize(12).text(`Resume: ${req.params.filename}`, {
      align: 'center'
    });

    // Read resume file and embed it in PDF
    const resumeContent = fs.readFileSync(filePath);
    pdfDoc.image(resumeContent, {
      fit: [250, 300],
      align: 'center',
      valign: 'center'
    });

    // Finalize PDF and end the response
    pdfDoc.end();
  } else {
    console.error('Resume file not found:', req.params.filename);
    res.status(404).json({ error: 'Resume file not found' });
  }
});

app.listen(Port, () => {
  console.log(`Server running on port ${Port}`);
});
