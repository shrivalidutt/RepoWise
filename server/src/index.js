require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'repowise-backend',
    timestamp: new Date().toISOString()
  });
});

// ---- START SERVER ----
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(` Backend server running at http://localhost:${PORT}`);
  console.log(` Health check: http://localhost:${PORT}/api/health`);
});

