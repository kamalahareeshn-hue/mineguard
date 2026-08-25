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
  // find all fetch or http calls
  const matches = code.match(/fetch\([^)]+\)/g);
  console.log('fetches:', matches);
  
  // also find all occurrences of /api or url
  const apiMatches = code.match(/["'`]\/api\/[^"'`]+["'`]/g);
  console.log('api matches:', apiMatches);

  // find any query functions or hooks
  const hookMatches = code.match(/useQuery[A-Za-z0-9_]*/g);
  console.log('useQuery:', hookMatches);
}

run().catch(console.error);
