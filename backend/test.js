const axios = require('axios');

axios.post('http://localhost:3001/api/initialize-assessment', {
  inputs: {
    patient_info: JSON.stringify({ name: "John Doe", age: 30, assessmentType: "general" }),
    action: "initialize_assessment",
    assessment_type: "general"
  },
  query: "Start mental health assessment for John Doe, age 30",
  response_mode: "blocking",
  conversation_id: "",
  user: "patient_123"
})
.then(res => {
  console.log("Response:", res.data);
})
.catch(err => {
  if (err.response) {
    console.error("Error:", err.response.data);
  } else {
    console.error("Error:", err.message);
  }
});