const axios = require('axios');

// URL of the Python AI Service (FastAPI)
// Defaults to localhost:8000 where we actully run `python main.py`
const AI_SERVICE_URL = process.env.AI_SERVICE_URL || 'http://localhost:8000';

/**
 * Classify the complaint text into predefined categories.
 * This function acts as a bridge between the Node.js backend and the Python AI service.
 * 
 * @param {string} text - The complaint description.
 * @returns {Promise<object>} The classification result { category, confidence }.
 */
const classifyComplaint = async (text) => {
  try {
    // Send a POST request to the Python service's /classify endpoint
    // We send two things:
    // 1. The text to analyze
    // 2. The list of candidate labels we want the AI to choose from
    const response = await axios.post(`${AI_SERVICE_URL}/classify`, {
      text: text,
      categories: ['Roads', 'Sanitation', 'Civic', 'Electricity', 'Water', 'Police']
    });

    // Return the JSON data from the AI service (contains category, confidence, scores)
    return response.data;
  } catch (error) {
    console.error('AI Service Error:', error.message);
    
    // Fallback Mechanism:
    // If the AI service is down or fails, we don't want to crash the request.
    // Instead, we default to "Civic" with 0 confidence so the complaint is still created.
    return { category: 'Civic', confidence: 0.0, fallback: true };
  }
};

module.exports = {
  classifyComplaint
};
