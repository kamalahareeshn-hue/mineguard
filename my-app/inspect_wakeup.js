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
  const idx = code.indexOf('wakeup-environment');
  if (idx !== -1) {
    console.log(code.substring(Math.max(0, idx - 1000), Math.min(code.length, idx + 1000)));
  }
}

run().catch(console.error);
