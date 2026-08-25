const fs = require('fs');
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
  console.log('Downloading bundle.js...');
  const bundle = await get('https://coalguard-safety.preview.emergentagent.com/static/js/bundle.js');
  console.log('Bundle status:', bundle.status, 'size:', bundle.body.length);
  fs.writeFileSync('bundle.js', bundle.body);

  console.log('Checking bundle.js.map...');
  const map = await get('https://coalguard-safety.preview.emergentagent.com/static/js/bundle.js.map');
  console.log('Map status:', map.status, 'size:', map.body.length);
  if (map.status === 200) {
    fs.writeFileSync('bundle.js.map', map.body);
    console.log('Saved bundle.js.map!');
  }
}

run().catch(console.error);
