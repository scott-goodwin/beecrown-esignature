const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

// Serve static files
app.use(express.static(__dirname));

// Main route - serve the SLA signer
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'beecrown-sla-signer.html'));
});

// Health check
app.get('/health', (req, res) => {
    res.json({ status: 'ok' });
});

app.listen(PORT, '0.0.0.0', () => {
    console.log(`Beecrown SLA Server running on port ${PORT}`);
});
