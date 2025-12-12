const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

// Parse JSON bodies
app.use(express.json({ limit: '50mb' }));

// Serve static files
app.use(express.static(__dirname));

// Main route - serve the SLA signer
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'beecrown-sla-signer.html'));
});

// Proxy endpoint to forward to n8n webhook (avoids CORS)
app.post('/api/webhook-proxy', async (req, res) => {
    try {
        // Get the actual webhook URL from request body or environment
        const webhookUrl = req.body.webhookUrl || process.env.N8N_WEBHOOK_URL;
        const data = req.body.data;

        if (!webhookUrl) {
            return res.status(400).json({ 
                success: false, 
                error: 'Webhook URL not provided' 
            });
        }

        // Forward the request to n8n
        const fetch = (await import('node-fetch')).default;
        const response = await fetch(webhookUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        });

        // Get response from n8n
        let result;
        try {
            result = await response.json();
        } catch (e) {
            result = { success: true };
        }

        // Send back to client
        res.json({
            success: response.ok,
            status: response.status,
            data: result
        });

    } catch (error) {
        console.error('Proxy error:', error);
        res.status(500).json({ 
            success: false, 
            error: error.message 
        });
    }
});

// Health check
app.get('/health', (req, res) => {
    res.json({ status: 'ok', service: 'Beecrown SLA Signer' });
});

// Handle 404
app.use((req, res) => {
    res.status(404).sendFile(path.join(__dirname, 'beecrown-sla-signer.html'));
});

app.listen(PORT, '0.0.0.0', () => {
    console.log(`
╔════════════════════════════════════════════════════╗
║   Beecrown SLA Signer Server Running              ║
╚════════════════════════════════════════════════════╝

🌐 Server: http://localhost:${PORT}
📱 Ready for production on Render
🔄 Webhook proxy enabled at /api/webhook-proxy
    `);
});
