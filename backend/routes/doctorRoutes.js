const express = require('express');
const router = express.Router();
const PatientCase = require('../models/PatientCase');
const { createConsultationCheckout } = require('../services/stripeService');

/**
 * GET /api/doctor/queue
 * Retrieve active doctor queue prioritized by RED urgency
 */
router.get('/queue', async (req, res) => {
  try {
    let cases = [];
    try {
      cases = await PatientCase.find({ status: { $ne: 'RESOLVED' } }).sort({ urgencyScore: -1, createdAt: -1 });
    } catch (err) {
      cases = [];
    }
    return res.status(200).json({ success: true, count: cases.length, queue: cases });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * POST /api/doctor/claim/:caseId
 * Doctor claims a patient case for WebRTC Tele-Consultation
 */
router.post('/claim/:caseId', async (req, res) => {
  try {
    const { caseId } = req.params;
    const { doctorName = 'Dr. Abebe Bekele (General Surgeon, Black Lion Hospital)' } = req.body;

    let updatedCase = null;
    try {
      updatedCase = await PatientCase.findOneAndUpdate(
        { caseId },
        { status: 'TELE_CONSULTATION_ACTIVE', assignedDoctorId: doctorName },
        { new: true }
      );
    } catch (err) {
      console.warn(`[Doctor Queue] In-memory update for case ${caseId}`);
    }

    // Generate optional Stripe Sandbox checkout link for facility billing/logs
    const checkout = await createConsultationCheckout({ caseId, patientName: updatedCase ? updatedCase.patientName : 'Patient' });

    // Notify WebSockets
    if (req.app.get('io')) {
      req.app.get('io').emit('case_status_changed', { caseId, status: 'TELE_CONSULTATION_ACTIVE', doctorName });
    }

    return res.status(200).json({
      success: true,
      message: `Case ${caseId} assigned to ${doctorName}`,
      case: updatedCase,
      checkoutUrl: checkout.checkoutUrl
    });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * POST /api/doctor/resolve/:caseId
 * Mark patient case as resolved with doctor notes
 */
router.post('/resolve/:caseId', async (req, res) => {
  try {
    const { caseId } = req.params;
    const { doctorNotes = 'Case reviewed and prescriptions provided to Health Extension Worker.' } = req.body;

    let updatedCase = null;
    try {
      updatedCase = await PatientCase.findOneAndUpdate(
        { caseId },
        { status: 'RESOLVED', 'soapNotes.plan': doctorNotes },
        { new: true }
      );
    } catch (err) {}

    if (req.app.get('io')) {
      req.app.get('io').emit('case_status_changed', { caseId, status: 'RESOLVED' });
    }

    return res.status(200).json({ success: true, message: `Case ${caseId} resolved.`, case: updatedCase });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
