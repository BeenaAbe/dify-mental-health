require('dotenv').config();
const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const DIFY_API_KEY = process.env.DIFY_API_KEY;
const DIFY_API_BASE_URL = process.env.DIFY_API_BASE_URL;

// Root endpoint for testing
app.get('/', (req, res) => {
  res.json({ message: 'Backend is running!' });
});

// Example endpoint: Initialize Assessment
app.post('/api/initialize-assessment', async (req, res) => {
  try {
    const response = await axios.post(
      `${DIFY_API_BASE_URL}/chat-messages`,
      {
        inputs: req.body.inputs || {},
        query: req.body.query || "Initialize mental health assessment",
        response_mode: req.body.response_mode || "blocking",
        conversation_id: req.body.conversation_id || "",
        user: req.body.user || "default_user"
      },
      {
        headers: {
          'Authorization': `Bearer ${DIFY_API_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: error.toString() });
  }
});

// You can add more endpoints for submit-answer, finalize-assessment, etc.

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Backend running on port ${PORT}`));