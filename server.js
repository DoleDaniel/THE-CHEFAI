require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const researchRoute = require('./researchRoute');
const mealRoute = require('./mealRoute');

const app = express();
const PORT = process.env.PORT || 3000;

// Enable secure CORS. Allowed origins can be specified in .env, defaulting to local dev environments.
const allowedOrigins = process.env.ALLOWED_ORIGIN ? process.env.ALLOWED_ORIGIN.split(',') : ['http://localhost:3000', 'http://127.0.0.1:3000'];
app.use(cors({
  origin: function(origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    // or requests from allowed origins.
    if (!origin || allowedOrigins.indexOf(origin) !== -1 || allowedOrigins.includes('*')) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  }
}));

// Parse incoming JSON and URL encoded requests with elevated limits for media uploads
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Serve uploaded media files statically from /uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Serve static frontend files from the workspace root
app.use(express.static(path.join(__dirname)));

// Mount modular culinary research and meal routes
app.use('/api', researchRoute);
app.use('/api', mealRoute);

// Fallback to index.html for single page app routing if applicable
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`==================================================`);
  console.log(`  THE CHEF AI Backend running on port ${PORT}`);
  console.log(`  Access the app at: http://localhost:${PORT}`);
  console.log(`==================================================`);
});
