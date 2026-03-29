const https = require('https');
https.get('https://devmichelbranche.vercel.app/script.js', (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    // Check if fetch('/api/admin-projects') is in the code
    if (data.includes("fetch('/api/admin-projects")) {
      console.log('Deploy contains the dynamic fetch script!');
    } else {
      console.log('Deploy DOES NOT contain the new script.js!');
    }
  });
});
