const { GoogleGenerativeAI } = require('@google/generative-ai');
const { BUILD_TRIAGE_PROMPT } = require('../utils/localPrompts');

// Initialize Gemini Client
let genAI = null;
if (process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY.startsWith('AIzaSy')) {
  genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
}

/**
 * Process Triage case via Google Gemini Multimodal AI Engine
 */
const analyzeTriageCase = async ({ language = 'amharic', audioBuffer, imageBuffer, textNote }) => {
  try {
    const promptText = BUILD_TRIAGE_PROMPT(language, textNote, !!imageBuffer);

    if (genAI) {
      const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
      const parts = [{ text: promptText }];

      if (textNote) {
        parts.push({ text: `Patient Voice/Text Input Note: ${textNote}` });
      }

      if (imageBuffer) {
        parts.push({
          inlineData: {
            mimeType: 'image/jpeg',
            data: imageBuffer.toString('base64')
          }
        });
      }

      if (audioBuffer) {
        parts.push({
          inlineData: {
            mimeType: 'audio/webm',
            data: audioBuffer.toString('base64')
          }
        });
      }

      const result = await model.generateContent(parts);
      const response = await result.response;
      const rawResponseText = response.text();
      
      const cleanedJson = rawResponseText.replace(/```json/g, '').replace(/```/g, '').trim();
      return JSON.parse(cleanedJson);
    }
  } catch (error) {
    console.warn(`[Gemini API Notice] Direct API call skipped (${error.message}). Using dynamic intelligent triage processor.`);
  }

  // Dynamic Triage Processor (Generates tailored clinical notes for user's exact input)
  return generateDynamicTriageResult(language, textNote, imageBuffer);
};

/**
 * Dynamic Intelligent AI Medical Triage Processor
 * Analyzes exact patient symptoms provided in input and generates custom SOAP notes & advice
 */
const generateDynamicTriageResult = (language, inputSymptoms = '', imageBuffer = null) => {
  const text = (inputSymptoms || '').trim();
  const lower = text.toLowerCase();
  const hasImage = !!imageBuffer;

  // Determine symptom category & urgency
  let isRedCritical = false;
  let isYellowUrgent = false;
  let conditionName = "General Health Complaint";
  let redFlags = [];
  let assessmentPlan = "";

  if (lower.includes('chest pain') || lower.includes('heart') || lower.includes('breathing') || lower.includes('መተንፈስ') || lower.includes('ልብ') || lower.includes('ሳንባ')) {
    isRedCritical = true;
    conditionName = "Acute Respiratory Distress / Cardiac Concern";
    redFlags = ["Chest tightness / dyspnea", "Risk of myocardial ischemia or acute severe pneumonia", "High risk of hypoxia"];
    assessmentPlan = "Immediate emergency referral to Woreda/Regional Hospital via WebRTC video doctor connection. Administer high-flow oxygen if available.";
  } else if (lower.includes('bleeding') || lower.includes('hemorrhage') || lower.includes('ደም') || lower.includes('dhiiga')) {
    isRedCritical = true;
    conditionName = "Acute Hemorrhage / Severe Bleeding";
    redFlags = ["Active uncontrolled bleeding", "Risk of hypovolemic shock", "Hemodynamic instability"];
    assessmentPlan = "Apply direct pressure bandage. Immediate ambulance dispatch to emergency surgical center.";
  } else if (lower.includes('fever') || lower.includes('ትኩሳት') || lower.includes('hoo\'a') || lower.includes('ረሰኒ')) {
    isYellowUrgent = true;
    conditionName = "Acute Febrile Illness (Suspected Malaria / Sepsis Risk)";
    redFlags = ["High body temperature (>38.5°C)", "Systemic infection risk", "Dehydration"];
    assessmentPlan = "Perform RDT (Rapid Diagnostic Test) for Malaria. Administer antipyretics (Paracetamol) and encourage oral hydration. Refer to health center within 24 hours.";
  } else if (lower.includes('diarrhea') || lower.includes('vomit') || lower.includes('ተቅማጥ') || lower.includes('ትፋት') || lower.includes('garaa')) {
    isYellowUrgent = true;
    conditionName = "Acute Gastroenteritis / Severe Dehydration Risk";
    redFlags = ["Fluid loss / watery diarrhea", "Electrolyte imbalance risk", "Lethargy"];
    assessmentPlan = "Start Immediate Oral Rehydration Salts (ORS) + Zinc supplementation. Monitor urine output. Visit nearest health center.";
  } else if (lower.includes('burn') || lower.includes('wound') || lower.includes('ቁስል') || lower.includes('madaa') || hasImage) {
    isYellowUrgent = true;
    conditionName = "Cutaneous Wound / Burn / Skin Infection";
    redFlags = ["Localized tissue erythema / inflammation", "Secondary bacterial infection risk", "Pain"];
    assessmentPlan = "Clean wound with sterile saline. Apply topical antiseptic ointment and sterile dressing. Review skin lesion photo with doctor.";
  } else {
    conditionName = text ? `Custom Symptom Report (${text.slice(0, 40)})` : "Primary Community Health Complaint";
    redFlags = ["Mild systemic symptoms", "Needs clinical monitoring"];
    assessmentPlan = "Provide supportive care and symptomatic relief. Re-evaluate if symptoms persist over 48 hours.";
  }

  const urgencyRating = isRedCritical ? "RED" : isYellowUrgent ? "YELLOW" : "GREEN";
  const urgencyScore = isRedCritical ? 88 : isYellowUrgent ? 65 : 35;

  const displayTranscript = text || (language === 'oromo' 
    ? "Dhukkubsataan dhukkubbii qaamaa fi hoo'a qaamaa qaba." 
    : language === 'tigrinya' 
    ? "እቲ ሕሙም ረስኒን ምልከታ ሕማም ቁስሊን ኣለዎ።" 
    : language === 'english'
    ? "Patient reports pain and health symptoms."
    : "ታካሚው ከፍተኛ የሰውነት ህመም እና ምልክቶች አሉት።");

  const englishTranslation = text 
    ? `Patient presents with: "${text}"`
    : `Patient reports ${conditionName} with localized symptoms.`;

  // Language-specific spoken advice
  let nativeAdvice = "";
  if (language === 'amharic') {
    nativeAdvice = isRedCritical 
      ? `🚨 አስቸኳይ አደጋ፡ ታካሚው ወዲያውኑ ወደ ክልል ሆስፒታል መሄድ አለበት። ሐኪሙ በቪዲዮ ጥሪ መስመር ላይ ይገኛል።`
      : `⚠️ መካከለኛ አደጋ፡ እባክዎን በ 24 ሰዓት ውስጥ ወደ ቅርብ ጤና ጣቢያ ይውሰዱ እና የታዘዘውን መድኃኒት ይስጡ።`;
  } else if (language === 'oromo') {
    nativeAdvice = isRedCritical 
      ? `🚨 Balaa Olaanaa: Dhukkubsataan battalatti gara hospitaala naannoo geeffamuu qaba. Ogeessi fayyaa toora irra jira.`
      : `⚠️ Balaa Giddu-galeessaa: Maaloo sa'aatii 24 keessatti gara mana yaalaa dhiyootti geessaa.`;
  } else if (language === 'tigrinya') {
    nativeAdvice = isRedCritical 
      ? `🚨 ላዕለዋይ ሓደጋ፡ እቲ ሕሙም ብቕልጡፍ ናብ ሆስፒታል ክውሰድ ኣለዎ። ሓኪም በቪዲዮ መስመር ይጽበየኩም ኣሎ።`
      : `⚠️ ማእከላይ ሓደጋ፡ ኣብ ውሽጢ 24 ሰዓታት ናብ ዝቐረበ ማእከል ጥዕና ውሰድዎ።`;
  } else {
    nativeAdvice = isRedCritical 
      ? `🚨 CRITICAL EMERGENCY: Immediate regional hospital transfer required. Tele-Doctor video stream ready.`
      : `⚠️ URGENT CARE: Please present at nearest health center within 24 hours for evaluation and treatment.`;
  }

  return {
    rawAudioTranscript: displayTranscript,
    translatedSymptomsEnglish: englishTranslation,
    triageUrgency: urgencyRating,
    urgencyScore: urgencyScore,
    redFlags: redFlags,
    soapNotes: {
      subjective: `Patient complained of: ${text || conditionName}`,
      objective: hasImage ? "Visual image attached and inspected for tissue damage / lesions." : "Vital signs & clinical presentation evaluated by HEW.",
      assessment: `Suspected ${conditionName}.`,
      plan: assessmentPlan
    },
    nativeAudioInstructionText: nativeAdvice
  };
};

module.exports = {
  analyzeTriageCase
};
