const mongoose = require('mongoose');

const patientCaseSchema = new mongoose.Schema({
  caseId: {
    type: String,
    required: true,
    unique: true,
    default: () => 'ETH-' + Math.floor(100000 + Math.random() * 900000)
  },
  hewName: {
    type: String,
    required: true,
    default: 'Health Worker (Woreda Health Post)'
  },
  woredaZone: {
    type: String,
    default: 'East Shoa, Oromia'
  },
  patientName: {
    type: String,
    required: true
  },
  patientAge: {
    type: Number,
    required: true
  },
  patientGender: {
    type: String,
    enum: ['Male', 'Female', 'Child/Other'],
    default: 'Female'
  },
  primaryLanguage: {
    type: String,
    enum: ['amharic', 'oromo', 'tigrinya'],
    default: 'amharic'
  },
  audioUrl: {
    type: String,
    default: null
  },
  imageUrl: {
    type: String,
    default: null
  },
  rawAudioTranscript: {
    type: String,
    default: ''
  },
  translatedSymptomsEnglish: {
    type: String,
    default: ''
  },
  soapNotes: {
    subjective: { type: String, default: '' },
    objective: { type: String, default: '' },
    assessment: { type: String, default: '' },
    plan: { type: String, default: '' }
  },
  triageUrgency: {
    type: String,
    enum: ['RED', 'YELLOW', 'GREEN'],
    required: true,
    default: 'YELLOW'
  },
  urgencyScore: {
    type: Number, // 1 - 100
    default: 50
  },
  redFlags: [{
    type: String
  }],
  nativeAudioInstructionText: {
    type: String, // Spoken medical guidance translated to patient's native dialect
    default: ''
  },
  assignedDoctorId: {
    type: String,
    default: null
  },
  status: {
    type: String,
    enum: ['QUEUED', 'DOCTOR_REVIEWING', 'TELE_CONSULTATION_ACTIVE', 'RESOLVED'],
    default: 'QUEUED'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('PatientCase', patientCaseSchema);
