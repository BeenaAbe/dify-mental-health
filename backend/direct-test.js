const axios = require('axios');
require('dotenv').config();

const DIFY_API_KEY = process.env.DIFY_API_KEY;
const DIFY_API_BASE_URL = process.env.DIFY_API_BASE_URL;

console.log('API Key:', DIFY_API_KEY ? 'Present' : 'Missing');
console.log('Base URL:', DIFY_API_BASE_URL);

// Test Dify API directly
axios.post(`${DIFY_API_BASE_URL}/chat-messages`, {
  inputs: {
    assessment_phase: "screening",
    phq9_completed: "false",
    phq9_score: "0",
    suicide_risk_level: "none",
    questions_completed: "0",
    crisis_detected: "false",
    primary_concern: "general",
    dsm5_level1_completed: "false",
    dsm5_level1_domains_flagged: "0"
  },
  query: "Hello",
  response_mode: "blocking",
  conversation_id: "",
  user: "test_user"
}, {
  headers: {
    'Authorization': `Bearer ${DIFY_API_KEY}`,
    'Content-Type': 'application/json',
  },
})
.then(res => {
  console.log("Direct API Success:", res.data);
})
.catch(err => {
  console.log("Direct API Error:", err.response ? err.response.data : err.message);
  console.log("Status:", err.response ? err.response.status : 'No response');
}); 