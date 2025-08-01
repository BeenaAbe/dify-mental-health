const axios = require('axios');

// Simple test to check if server is responding
axios.get('http://localhost:3001/')
.then(res => {
  console.log("Server is responding:", res.status);
})
.catch(err => {
  console.log("Server test failed:", err.message);
});

// Test the actual endpoint with minimal data
axios.post('http://localhost:3001/api/initialize-assessment', {
  inputs: {},
  response_mode: "blocking",
  user: "test_user"
})
.then(res => {
  console.log("API Response:", res.data);
})
.catch(err => {
  console.log("API Error:", err.response ? err.response.data : err.message);
}); 