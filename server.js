const express = require('express');
const path = require('path');
const https = require('https');
const http = require('http');
const multer = require('multer');
const app = express();
const PORT = process.env.PORT || 3000;

// Configure multer for file uploads (in-memory)
const storage = multer.memoryStorage();
const upload = multer({ 
    storage: storage,
    limits: { fileSize: 50 * 1024 * 1024 } // 50MB limit
});

// Parse JSON bodies for non-multipart requests
app.use(express.json({ limit: '10mb' })); // Smaller now since PDF is separate
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// Serve static files
app.use(express.static(__dirname));

// Main route - serve the SLA signer
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'beecrown-sla-signer.html'));
});

// Proxy endpoint to forward to n8n webhook (handles binary PDF efficiently)
app.post('/api/webhook-proxy', upload.single('pdf'), async (req, res) => {
    console.log('=== Webhook Proxy Request Received ===');
    
    try {
        const webhookUrl = req.body.webhookUrl || process.env.N8N_WEBHOOK_URL;
        const metadata = JSON.parse(req.body.metadata || '{}');
        const pdfFile = req.file; // Binary PDF file

        console.log('Webhook URL:', webhookUrl);
        console.log('Metadata size:', JSON.stringify(metadata).length, 'bytes');
        console.log('PDF file size:', pdfFile ? pdfFile.size : 0, 'bytes');

        if (!webhookUrl) {
            console.error('No webhook URL provided');
            return res.status(400).json({ 
                success: false, 
                error: 'Webhook URL not provided' 
            });
        }

        // Convert PDF to base64 for n8n
        const pdfBase64 = pdfFile.buffer.toString('base64');
        console.log('PDF converted to base64 for n8n');

        // Combine metadata with PDF
        const data = {
            ...metadata,
            pdf: {
                filename: metadata.pdfFilename,
                data: pdfBase64,
                mimeType: 'application/pdf'
            }
        };

        // Parse the webhook URL
        const url = new URL(webhookUrl);
        const isHttps = url.protocol === 'https:';
        const httpModule = isHttps ? https : http;

        console.log('Forwarding to n8n...');
        console.log('Protocol:', url.protocol);
        console.log('Host:', url.hostname);
        console.log('Path:', url.pathname + url.search);

        // Make request to n8n
        const postData = JSON.stringify(data);
        
        const options = {
            hostname: url.hostname,
            port: url.port || (isHttps ? 443 : 80),
            path: url.pathname + url.search,
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': Buffer.byteLength(postData)
            }
        };

        const proxyRequest = httpModule.request(options, (proxyResponse) => {
            console.log('n8n Response Status:', proxyResponse.statusCode);
            
            let responseData = '';
            
            proxyResponse.on('data', (chunk) => {
                responseData += chunk;
            });
            
            proxyResponse.on('end', () => {
                console.log('n8n Response received, length:', responseData.length);
                
                let result;
                try {
                    result = JSON.parse(responseData);
                } catch (e) {
                    console.log('Response is not JSON, treating as success');
                    result = { message: 'Success' };
                }
                
                res.json({
                    success: proxyResponse.statusCode >= 200 && proxyResponse.statusCode < 300,
                    status: proxyResponse.statusCode,
                    data: result
                });
            });
        });

        proxyRequest.on('error', (error) => {
            console.error('Request to n8n failed:', error);
            res.status(500).json({ 
                success: false, 
                error: error.message 
            });
        });

        // Send the data
        proxyRequest.write(postData);
        proxyRequest.end();

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
📦 Binary PDF upload supported (more efficient!)
    `);
});
