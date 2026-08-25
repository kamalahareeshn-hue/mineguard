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
  const code = await get('https://app.emergent.sh/main-C_K_GC9n.js');
  let idx = 0;
  while ((idx = code.indexOf('loading-preview', idx)) !== -1) {
    console.log('--- OCCURRENCE ---');
    console.log(code.substring(Math.max(0, idx - 200), Math.min(code.length, idx + 400)));
    idx += 15;
  }
}

run().catch(console.error);
