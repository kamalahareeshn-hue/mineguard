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
  const main = await get('https://app.emergent.sh/main-C_K_GC9n.js');
  console.log('main status:', main.status, 'size:', main.body.length);
  
  // Search for endpoints in main.body
  const matches = main.body.match(/\/api\/[a-zA-Z0-9_\-\/]+/g);
  console.log('API endpoints found:', [...new Set(matches)]);

  const hostMatches = main.body.match(/loading-preview[^\"]*/g);
  console.log('loading preview matches:', hostMatches);
}

run().catch(console.error);
