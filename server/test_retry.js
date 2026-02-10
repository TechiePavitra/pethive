const http = require('http');

function testConnection() {
  const options = {
    hostname: 'localhost',
    port: 3001,
    path: '/api/products',
    method: 'GET',
    timeout: 5000
  };

  const req = http.request(options, (res) => {
    console.log(`✓ Connected! Status: ${res.statusCode}`);
    let data = '';
    res.on('data', (chunk) => { data += chunk; });
    res.on('end', () => {
      try {
        const json = JSON.parse(data);
        console.log(`✓ Products: ${json.products ? json.products.length : 0}`);
      } catch (e) {
        console.log('Response:', data.substring(0, 100));
      }
    });
  });

  req.on('error', (e) => {
    console.log(`✗ Connection failed: ${e.message}`);
  });

  req.on('timeout', () => {
    console.log('✗ Request timeout');
    req.abort();
  });

  req.end();
}

// Retry a few times
let attempts = 0;
const interval = setInterval(() => {
  attempts++;
  console.log(`\nAttempt ${attempts}...`);
  testConnection();
  
  if (attempts >= 5) {
    clearInterval(interval);
  }
}, 2000);
