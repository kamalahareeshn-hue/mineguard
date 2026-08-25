const https = require('https');

async function get(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve({ status: res.statusCode, headers: res.headers, body: data }));
    }).on('error', reject);
  });
}

async function run() {
  console.log('Probing https://coalguard-safety.preview.emergentagent.com ...');
  const res = await get('https://coalguard-safety.preview.emergentagent.com');
  console.log('Status:', res.status);
  console.log('Length:', res.body.length);
  console.log('Is loading preview:', res.body.includes('loading-preview'));
  console.log('First 500 chars:\n', res.body.substring(0, 500));
}

run().catch(console.error);
