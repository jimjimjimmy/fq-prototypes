const https = require('https');
const http = require('http');
const fs = require('fs');
const path = require('path');

const PEOPLE = [
  { wiki: 'Sean_Bean', file: 'sean-bean.jpg' },
  { wiki: 'Liv_Tyler', file: 'liv-tyler.jpg' },
  { wiki: 'Elijah_Wood', file: 'elijah-wood.jpg' },
  { wiki: 'Viggo_Mortensen', file: 'viggo-mortensen.jpg' },
  { wiki: 'Sean_Astin', file: 'sean-astin.jpg' },
  { wiki: 'Orlando_Bloom', file: 'orlando-bloom.jpg' },
  { wiki: 'Ian_McKellen', file: 'ian-mckellen.jpg' },
  { wiki: 'Cate_Blanchett', file: 'cate-blanchett.jpg' },
];

const OUT_DIR = path.join(__dirname, '..', 'public', 'avatars');

function fetchJSON(url) {
  return new Promise((resolve, reject) => {
    const mod = url.startsWith('https') ? https : http;
    mod.get(url, { headers: { 'User-Agent': 'FloQast-Prototype/1.0' } }, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        return fetchJSON(res.headers.location).then(resolve, reject);
      }
      let data = '';
      res.on('data', (chunk) => (data += chunk));
      res.on('end', () => {
        try { resolve(JSON.parse(data)); } catch (e) { reject(e); }
      });
    }).on('error', reject);
  });
}

function downloadFile(url, dest) {
  return new Promise((resolve, reject) => {
    const mod = url.startsWith('https') ? https : http;
    mod.get(url, { headers: { 'User-Agent': 'FloQast-Prototype/1.0' } }, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        return downloadFile(res.headers.location, dest).then(resolve, reject);
      }
      if (res.statusCode !== 200) {
        return reject(new Error(`HTTP ${res.statusCode} for ${url}`));
      }
      const ws = fs.createWriteStream(dest);
      res.pipe(ws);
      ws.on('finish', () => { ws.close(); resolve(); });
    }).on('error', reject);
  });
}

async function main() {
  fs.mkdirSync(OUT_DIR, { recursive: true });

  for (const person of PEOPLE) {
    const apiUrl = `https://en.wikipedia.org/api/rest_v1/page/summary/${person.wiki}`;
    try {
      const summary = await fetchJSON(apiUrl);
      const imgUrl = summary.thumbnail?.source;
      if (!imgUrl) {
        console.log(`  SKIP ${person.wiki} — no thumbnail`);
        continue;
      }
      const dest = path.join(OUT_DIR, person.file);
      await downloadFile(imgUrl, dest);
      const size = fs.statSync(dest).size;
      console.log(`  OK   ${person.file} (${(size / 1024).toFixed(1)} KB)`);
    } catch (err) {
      console.log(`  FAIL ${person.wiki}: ${err.message}`);
    }
  }
  console.log('Done.');
}

main();
