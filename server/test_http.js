const http = require('http');

const options = {
  hostname: 'localhost',
  port: 3001,
  path: '/api/products',
  method: 'GET'
};

const req = http.request(options, (res) => {
  console.log(`STATUS: ${res.statusCode}`);
  console.log(`HEADERS: ${JSON.stringify(res.headers)}`);
  res.setEncoding('utf8');
  let data = '';
  res.on('data', (chunk) => {
    data += chunk;
  });
  res.on('end', () => {
    console.log('BODY:');
    try {
      const json = JSON.parse(data);
      console.log('Products count:', json.products ? json.products.length : 0);
      console.log('First product:', json.products && json.products[0] ? json.products[0].name : 'none');
    } catch (e) {
      console.log(data);
    }
  });
});

req.on('error', (e) => {
  console.error(`problem with request: ${e.message}`);
});

req.end();
