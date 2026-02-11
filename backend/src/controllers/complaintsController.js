const { classifyComplaint } = require('../services/aiService');
const { v4: uuidv4 } = require('uuid'); // assuming uuid is installed, I should check or use simple random string

// In-memory store for now since DB is not set up
const complaintsStore = [];

/**
 * Create a new complaint.
 * 1. Receive text and userId.
 * 2. Classify text using AI service.
 * 3. Store complaint with status 'Pending'.
 * 4. Return the complaint details.
 */
const createComplaint = async (req, res) => {
  try {
    const { text, userId } = req.body;

    if (!text || !userId) {
      return res.status(400).json({ error: 'Missing text or userId' });
    }

    // Call AI Service
    const classification = await classifyComplaint(text);

    const newComplaint = {
      id: Date.now().toString(), // Simple ID
      userId,
      text,
      category: classification.category,
      confidence: classification.confidence,
      status: 'Pending',
      createdAt: new Date()
    };

    complaintsStore.push(newComplaint);

    console.log(`Complaint Created: [${newComplaint.category}] - ${text}`);

    res.status(201).json(newComplaint);
  } catch (error) {
    console.error('Error creating complaint:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

/**
 * Get complaints for a user (mock).
 */
const getUserComplaints = (req, res) => {
  const { userId } = req.params;
  const userComplaints = complaintsStore.filter(c => c.userId === userId);
  res.json(userComplaints);
};

const getAllComplaints = (_req, res) => {
  res.json(complaintsStore);
};

module.exports = {
  createComplaint,
  getUserComplaints,
  getAllComplaints
};
