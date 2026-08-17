const nodemailer = require('nodemailer');

/**
 * Emergency Alert Service integrating Testmail.app for automated doctor notifications
 */
const sendEmergencyDoctorAlert = async ({ caseId, patientName, woredaZone, urgencyScore, redFlags, translatedSymptoms }) => {
  const testmailNamespace = process.env.TESTMAIL_NAMESPACE || 'medtriage';
  const targetDoctorEmail = `${testmailNamespace}.doctor.oncall@inbox.testmail.app`;

  console.log(`[Emergency Alert] Preparing RED alert email to Testmail endpoint: ${targetDoctorEmail}`);

  try {
    // If SMTP test settings exist, attempt transport
    const transporter = nodemailer.createTransport({
      host: 'smtp.testmail.app',
      port: 587,
      secure: false,
      auth: {
        user: process.env.TESTMAIL_API_KEY || 'demo_user',
        pass: process.env.TESTMAIL_API_KEY || 'demo_pass'
      }
    });

    const mailOptions = {
      from: `"Tena AI Emergency Triage" <alert@tena.ai>`,
      to: targetDoctorEmail,
      subject: `🚨 RED CRITICAL TRIAGE ALERT - Case #${caseId} (${woredaZone})`,
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; border: 2px solid #ef4444; border-radius: 8px; max-width: 600px;">
          <h2 style="color: #dc2626; margin-top: 0;">🚨 CRITICAL MEDICAL EMERGENCY ALERT</h2>
          <p><strong>System:</strong> Tena AI - Ethiopian Multilingual Triage Network</p>
          <hr />
          <p><strong>Case ID:</strong> #${caseId}</p>
          <p><strong>Patient Name:</strong> ${patientName}</p>
          <p><strong>Woreda / Zone:</strong> ${woredaZone}</p>
          <p><strong>Triage Urgency Score:</strong> <span style="background-color: #fee2e2; color: #991b1b; padding: 4px 8px; border-radius: 4px; font-weight: bold;">${urgencyScore} / 100 (RED LEVEL)</span></p>
          
          <h3>Symptoms (English Summary):</h3>
          <p style="background: #f9fafb; padding: 12px; border-left: 4px solid #ef4444;">${translatedSymptoms}</p>
          
          <h3>Identified Red Flags:</h3>
          <ul>
            ${redFlags.map(rf => `<li style="color: #b91c1c; font-weight: bold;">${rf}</li>`).join('')}
          </ul>
          
          <p style="margin-top: 24px;">
            <a href="http://localhost:5173/doctor-queue" style="background: #dc2626; color: white; padding: 12px 20px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">
              Join WebRTC Live Doctor Session →
            </a>
          </p>
        </div>
      `
    };

    // Send attempt or mock log
    if (process.env.TESTMAIL_API_KEY && process.env.TESTMAIL_API_KEY !== 'mock_testmail_key') {
      await transporter.sendMail(mailOptions);
      console.log(`[Emergency Alert] Testmail email sent successfully to ${targetDoctorEmail}`);
    } else {
      console.log(`[Emergency Alert Simulation] Email dispatch generated for Testmail: ${targetDoctorEmail}`);
    }
  } catch (error) {
    console.warn(`[Emergency Alert Warning] Could not dispatch email directly (${error.message}). Alert logged in system.`);
  }
};

module.exports = {
  sendEmergencyDoctorAlert
};
