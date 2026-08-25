const fs = require('fs');
const https = require('https');

async function get(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve(data));
    }).on('error', reject);
  });
}

async function run() {
  const code = await get('https://app.emergent.sh/chunks/PreviewLoading.tsx-D5fEmeL6.js');
  let idx = code.indexOf('function ve(');
  if (idx === -1) idx = code.indexOf('ve=');
  if (idx !== -1) {
    console.log('ve definition:');
    console.log(code.substring(idx, idx + 1500));
  }

  idx = code.indexOf('function he(');
  if (idx === -1) idx = code.indexOf('he=');
  if (idx !== -1) {
    console.log('he definition:');
    console.log(code.substring(idx, idx + 1500));
  }
}

run().catch(console.error);
