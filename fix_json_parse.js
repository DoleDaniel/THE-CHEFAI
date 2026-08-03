const fs = require('fs');

// Update youtubeService.js
let ytJs = fs.readFileSync('youtubeService.js', 'utf8');
ytJs = ytJs.replace(
  /if \(response\.ok\) \{/g, 
  `if (response.ok) {
      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        throw new Error("Received non-JSON response from proxy (likely a static fallback HTML page on Netlify).");
      }`
);
fs.writeFileSync('youtubeService.js', ytJs, 'utf8');
console.log("Updated youtubeService.js");

// Update app.js (for /api/meals)
let appJs = fs.readFileSync('app.js', 'utf8');
appJs = appJs.replace(
  /const res = await fetch\('\/api\/meals'\);\s*if \(res\.ok\) \{/g, 
  `const res = await fetch('/api/meals');
      if (res.ok) {
        const contentType = res.headers.get("content-type");
        if (!contentType || !contentType.includes("application/json")) {
          throw new Error("Received HTML instead of JSON for secret meals");
        }`
);

// Update app.js (for /api/research)
appJs = appJs.replace(
  /\.then\(r => r\.json\(\)\)/g, 
  `.then(r => {
        const contentType = r.headers.get("content-type");
        if (!contentType || !contentType.includes("application/json")) {
          throw new Error("Received non-JSON response for research data");
        }
        return r.json();
      })`
);

fs.writeFileSync('app.js', appJs, 'utf8');
console.log("Updated app.js");
