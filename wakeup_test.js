const https = require('https');

async function post(url) {
  return new Promise((resolve, reject) => {
    const u = new URL(url);
    const req = https.request(u, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      }
    }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve({ status: res.statusCode, headers: res.headers, body: data }));
    });
    req.on('error', reject);
    req.write('{}');
    req.end();
  });
}

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
  console.log('Sending wakeup request...');
  const wakeup = await post('https://api.emergent.sh/public/jobs/v0/coalguard-safety/wakeup-environment');
  console.log('Wakeup response:', wakeup.status, wakeup.body);

  const endpoints = [
    'https://api.emergent.sh/public/jobs/v0/coalguard-safety',
    'https://api.emergent.sh/public/jobs/v0/coalguard-safety/status',
    'https://api.emergent.sh/api/v1/apps/coalguard-safety',
    'https://api.emergent.sh/api/v0/preview/coalguard-safety'
  ];

  for (const ep of endpoints) {
    try {
      const res = await get(ep);
      console.log(ep, '->', res.status, res.body.slice(0, 300));
    } catch (e) {
      console.log(ep, '-> error', e.message);
    }
  }
}

run().catch(console.error);
