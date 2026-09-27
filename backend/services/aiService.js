const fs = require('fs');
const { GoogleGenerativeAI } = require('@google/generative-ai');

// Maps detailed AI categories to the SwachhSetu broad categories for pickup
const CATEGORY_MAPPING = {
  'Plastic': 'Recyclable',
  'Paper': 'Recyclable',
  'Cardboard': 'Recyclable',
  'Glass': 'Recyclable',
  'Metal': 'Recyclable',
  'E-waste': 'E-Waste',
  'Organic/Wet Waste': 'Organic',
  'Textile': 'General',
  'Hazardous Waste': 'Hazardous',
  'Other/Unknown': 'General'
};

const SUPPORTED_CATEGORIES = Object.keys(CATEGORY_MAPPING);

/**
 * Validates basic image parameters before sending to API
 */
const validateImage = (filePath) => {
  try {
    const stats = fs.statSync(filePath);
    const sizeInMB = stats.size / (1024 * 1024);
    if (sizeInMB > 5) return { valid: false, error: 'Image exceeds 5MB limit.' };
    if (sizeInMB < 0.001) return { valid: false, error: 'Image is too small or corrupted.' };
    return { valid: true };
  } catch (err) {
    return { valid: false, error: 'Could not read image file.' };
  }
};

/**
 * AI Waste Scanner Service using Google Gemini Vision
 */
exports.classifyImage = async (filePath, mimeType) => {
  const validation = validateImage(filePath);
  if (!validation.valid) {
    throw new Error(validation.error);
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('Server configuration error: GEMINI_API_KEY is missing.');
  }

  const genAI = new GoogleGenerativeAI(apiKey);
  // Using gemini-1.5-flash as it is fast and excellent for multimodal vision tasks
  const model = genAI.getGenerativeModel({ 
    model: 'gemini-flash-latest',
    generationConfig: {
      responseMimeType: 'application/json',
    }
  });

  const prompt = `You are an expert waste-sorting and material-identification assistant.
Analyze this image and identify all waste items visible.
Do not guess. If uncertain, reflect it in the confidence score (0.0 to 1.0) and use 'Other/Unknown'.
Classify the MATERIAL rather than just the object name (e.g., a "coffee cup" could be paper or plastic).

Return a JSON object strictly following this structure:
{
  "is_waste": boolean, // true if the image contains waste items
  "image_quality_sufficient": boolean, // false if too blurry, dark, or unclear
  "quality_issue": string, // empty if sufficient, otherwise e.g., "Too blurry", "Too dark"
  "items": [
    {
      "object_detected": string, // e.g., "Water bottle"
      "material": string, // e.g., "PET Plastic", "Aluminium"
      "category": string, // MUST be one of: Plastic, Paper, Cardboard, Glass, Metal, E-waste, Organic/Wet Waste, Textile, Hazardous Waste, Other/Unknown
      "confidence": number, // Float between 0.0 and 1.0 representing your certainty
      "recyclable": boolean,
      "condition": string, // e.g., "Crushed", "Dirty", "Intact"
      "reason": string, // Explain WHY it belongs to this category based on visual material traits.
      "recommendation": string // Disposal recommendation.
    }
  ]
}`;

  try {
    const imageBuffer = fs.readFileSync(filePath);
    const imageParts = [
      {
        inlineData: {
          data: imageBuffer.toString('base64'),
          mimeType: mimeType || 'image/jpeg'
        }
      }
    ];

    const result = await model.generateContent([prompt, ...imageParts]);
    const responseText = result.response.text();
    
    // Parse the structured JSON response
    const aiData = JSON.parse(responseText);

    // Map the strict categories to SwachhSetu frontend categories
    if (aiData.items && Array.isArray(aiData.items)) {
      aiData.items = aiData.items.map(item => ({
        ...item,
        // Fallback to Other if hallucinated category
        category: SUPPORTED_CATEGORIES.includes(item.category) ? item.category : 'Other/Unknown',
        mappedCategory: CATEGORY_MAPPING[item.category] || 'General'
      }));
    } else {
      aiData.items = [];
    }

    return aiData;
  } catch (error) {
    console.error('Gemini Vision Error:', error);
    throw new Error('AI analysis failed. Please try again later.');
  }
};
