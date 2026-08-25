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
  const indexHtml = await get('https://coalguard-safety.preview.emergentagent.com/');
  console.log('--- INDEX HTML ---');
  console.log(indexHtml.body);

  // Extract script and link tags
  const scripts = indexHtml.body.match(/src="([^"]+)"/g) || [];
  const links = indexHtml.body.match(/href="([^"]+)"/g) || [];
  console.log('Scripts:', scripts);
  console.log('Links:', links);
}

run().catch(console.error);
