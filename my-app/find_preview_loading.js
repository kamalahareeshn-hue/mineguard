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
  console.log('PreviewLoading size:', code.length);
  console.log(code.substring(0, 3000));
}

run().catch(console.error);
