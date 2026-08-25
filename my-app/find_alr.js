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
  let idx = code.indexOf('function Alr');
  if (idx === -1) idx = code.indexOf('Alr=');
  if (idx === -1) idx = code.indexOf('Alr =');
  console.log('idx:', idx);
  if (idx !== -1) {
    console.log(code.substring(idx, idx + 2000));
  }
}

run().catch(console.error);
