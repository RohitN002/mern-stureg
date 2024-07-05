const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
  studentName: { type: String, required: true },
  dob: { type: Date, required: true },
  fatherName: { type: String, required: true },
  mobileNumber: { type: String, required: true },
  collegeName: { type: String, required: true },
  courseDetails: { type: String, required: true },
  areaOfInterest: { type: [String], required: true },
  programmingSkills: { type: [String], required: true },
  address: { type: String, required: true },
  yearOfPassingOut: { type: Number, required: true },
  email: { type: String, required: true, unique: true },
  resume: { type: String, required: true }
});

const Student = mongoose.model('Student', studentSchema);

module.exports = Student;
