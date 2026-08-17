const express = require('express');
const router = express.Router();
const multer = require('multer');
const PatientCase = require('../models/PatientCase');
const { analyzeTriageCase } = require('../services/geminiService');
const { sendEmergencyDoctorAlert } = require('../services/alertService');

// Multer memory storage configuration for voice audio and visual photos
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit
});

// In-Memory Storage Fallback if MongoDB is offline during local testing
const inMemoryCases = [];

/**
 * POST /api/triage/submit
 * Submit a new Triage case (Audio and/or Image + Language selection)
 */
router.post(
  '/submit',
  upload.fields([
    { name: 'audio', maxCount: 1 },
    { name: 'image', maxCount: 1 }
  ]),
  async (req, res) => {
    try {
      const {
        patientName = 'Anonymous Patient',
        patientAge = 28,
        patientGender = 'Female',
        primaryLanguage = 'amharic',
        hewName = 'Health Worker (Woreda Post)',
        woredaZone = 'East Shoa, Oromia',
        textNote = ''
      } = req.body;

      const audioBuffer = req.files && req.files.audio ? req.files.audio[0].buffer : null;
      const imageBuffer = req.files && req.files.image ? req.files.image[0].buffer : null;

      console.log(`[Triage API] Received submission. Language: ${primaryLanguage}, Audio: ${!!audioBuffer}, Image: ${!!imageBuffer}`);

      // Call Google Gemini Multimodal Engine
      const aiAnalysis = await analyzeTriageCase({
        language: primaryLanguage,
        audioBuffer,
        imageBuffer,
        textNote
      });

      const caseData = {
        caseId: 'ETH-' + Math.floor(100000 + Math.random() * 900000),
        hewName,
        woredaZone,
        patientName,
        patientAge: Number(patientAge),
        patientGender,
        primaryLanguage,
        audioUrl: audioBuffer ? `data:audio/webm;base64,${audioBuffer.toString('base64')}` : null,
        imageUrl: imageBuffer ? `data:image/jpeg;base64,${imageBuffer.toString('base64')}` : null,
        rawAudioTranscript: aiAnalysis.rawAudioTranscript,
        translatedSymptomsEnglish: aiAnalysis.translatedSymptomsEnglish,
        soapNotes: aiAnalysis.soapNotes,
        triageUrgency: aiAnalysis.triageUrgency,
        urgencyScore: aiAnalysis.urgencyScore,
        redFlags: aiAnalysis.redFlags || [],
        nativeAudioInstructionText: aiAnalysis.nativeAudioInstructionText,
        status: 'QUEUED',
        createdAt: new Date()
      };

      // Save to MongoDB if connected, else save to in-memory array
      let savedCase = caseData;
      try {
        const newPatientCase = new PatientCase(caseData);
        savedCase = await newPatientCase.save();
        console.log(`[MongoDB] Patient case saved successfully. ID: ${savedCase.caseId}`);
      } catch (dbErr) {
        console.warn(`[MongoDB Notice] Direct MongoDB save bypassed (${dbErr.message}). Saved to in-memory store.`);
        inMemoryCases.unshift(caseData);
      }

      // If RED Critical Urgency, trigger automated emergency email alert via Testmail.app
      if (aiAnalysis.triageUrgency === 'RED') {
        sendEmergencyDoctorAlert({
          caseId: savedCase.caseId,
          patientName: savedCase.patientName,
          woredaZone: savedCase.woredaZone,
          urgencyScore: savedCase.urgencyScore,
          redFlags: savedCase.redFlags,
          translatedSymptoms: savedCase.translatedSymptomsEnglish
        });
      }

      // Emit Socket.io realtime event if io instance is attached
      if (req.app.get('io')) {
        req.app.get('io').emit('new_triage_case', savedCase);
      }

      return res.status(201).json({
        success: true,
        message: 'Triage case processed successfully by Gemini AI',
        case: savedCase
      });
    } catch (error) {
      console.error('[Triage API Error]', error);
      return res.status(500).json({
        success: false,
        error: 'Failed to process medical triage case',
        details: error.message
      });
    }
  }
);

/**
 * GET /api/triage/cases
 * Fetch all submitted triage cases
 */
router.get('/cases', async (req, res) => {
  try {
    let cases = [];
    try {
      cases = await PatientCase.find().sort({ createdAt: -1 });
    } catch (dbErr) {
      cases = inMemoryCases;
    }
    return res.status(200).json({ success: true, count: cases.length, cases });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * GET /api/triage/cases/:id
 * Fetch single patient case by caseId
 */
router.get('/cases/:id', async (req, res) => {
  try {
    const { id } = req.params;
    let foundCase = null;
    try {
      foundCase = await PatientCase.findOne({ caseId: id });
    } catch (err) {
      foundCase = inMemoryCases.find(c => c.caseId === id);
    }

    if (!foundCase) {
      return res.status(404).json({ success: false, error: 'Case not found' });
    }

    return res.status(200).json({ success: true, case: foundCase });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
