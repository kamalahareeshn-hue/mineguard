const fs = require('fs');
const path = require('path');

async function extractSourceMap() {
  console.log('Reading bundle.js.map...');
  const mapData = JSON.parse(fs.readFileSync('bundle.js.map', 'utf8'));
  console.log('Sources count:', mapData.sources.length);

  const outDir = path.join(__dirname, 'extracted_src');
  if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir, { recursive: true });
  }

  let extractedCount = 0;
  for (let i = 0; i < mapData.sources.length; i++) {
    const srcPath = mapData.sources[i];
    const content = mapData.sourcesContent ? mapData.sourcesContent[i] : null;

    if (!content) continue;

    // Normalize path and remove query parameters like ?fcd7
    let cleanPath = srcPath.replace(/\?[a-zA-Z0-9_\-]+$/, '');
    cleanPath = cleanPath.replace(/^webpack:\/\/[^\/]*\//, '').replace(/^\.\//, '');
    cleanPath = cleanPath.replace(/\.\.\//g, '');
    cleanPath = cleanPath.replace(/[\*\:\"\<>\?]/g, '_');
    const fullPath = path.join(outDir, cleanPath);
    const dir = path.dirname(fullPath);

    fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(fullPath, content);
    extractedCount++;
  }

  console.log(`Successfully extracted ${extractedCount} files into ${outDir}`);
}

extractSourceMap().catch(console.error);
