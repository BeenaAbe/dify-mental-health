const axios = require('axios');

// Minimal test with just required fields
axios.post('http://localhost:3001/api/initialize-assessment', {
  query: "Hello",
  user: "test_user"
})
.then(res => {
  console.log("Success:", res.data);
})
.catch(err => {
  console.log("Error:", err.response ? err.response.data : err.message);
}); 