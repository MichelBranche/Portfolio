const https = require('https');
https.get('https://devmichelbranche.vercel.app/api/admin-projects', (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    try {
      const json = JSON.parse(data);
      console.log('API returned projects count:', json.projects ? json.projects.length : 'NULL');
      if (json.projects && json.projects.length > 0) {
        console.log('Sample project 0:', json.projects[0].title);
      }
    } catch(e) {
      console.log('Parse error:', e.message, 'Raw data:', data);
    }
  });
});
