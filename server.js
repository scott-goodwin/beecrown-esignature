const express = require('express');
const fetch = require('node-fetch');
const multer = require('multer');
const FormData = require('form-data');
const path = require('path');

const app = express();
const upload = multer({ storage: multer.memoryStorage() });

// Body parsing middleware (for JSON, though we use multer for multipart)
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from current directory
app.use(express.static(__dirname));

// CORS middleware (just in case)
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    if (req.method === 'OPTIONS') {
        return res.sendStatus(200);
    }
    next();
});

// API endpoint to proxy to n8n
app.post('/api/submit-document', upload.single('pdfFile'), async (req, res) => {
    try {
        console.log('Received document submission:', {
            documentType: req.body.documentType,
            driverName: req.body.driverName,
            driverReference: req.body.driverReference,
            email: req.body.email,
            hasFile: !!req.file,
            fileSize: req.file ? req.file.size : 0
        });

        // Validate required fields
        if (!req.body.documentType) {
            throw new Error('documentType is required');
        }
        if (!req.body.driverName) {
            throw new Error('driverName is required');
        }
        if (!req.file) {
            throw new Error('PDF file is required');
        }

        // Create FormData for n8n webhook
        const formData = new FormData();
        
        // Add all text fields (only if they exist)
        if (req.body.documentType) formData.append('documentType', req.body.documentType);
        if (req.body.driverName) formData.append('driverName', req.body.driverName);
        if (req.body.driverReference) formData.append('driverReference', req.body.driverReference);
        if (req.body.email) formData.append('email', req.body.email);
        if (req.body.signatureDate) formData.append('signatureDate', req.body.signatureDate);
        if (req.body.filename) formData.append('filename', req.body.filename);
        
        // Add metadata
        if (req.body.metadata) {
            formData.append('metadata', req.body.metadata);
        }
        
        // Add PDF file
        if (req.file && req.file.buffer) {
            formData.append('pdfFile', req.file.buffer, {
                filename: req.body.filename || 'document.pdf',
                contentType: 'application/pdf'
            });
        }

        // Forward to n8n webhook
        // Using www version directly to avoid redirect issues
        const n8nUrl = 'https://www.hosted-online-scott.com/webhook/bb55dfad-096d-4850-bbe2-196bde20ef73';
        
        console.log('Forwarding to n8n webhook:', n8nUrl);
        console.log('File size:', req.file ? `${(req.file.size / 1024).toFixed(2)} KB` : 'N/A');
        console.log('FormData field count:', Object.keys(req.body).length + (req.file ? 1 : 0));
        
        // Get headers from FormData (form-data package provides getHeaders method)
        let headers;
        try {
            headers = formData.getHeaders();
            console.log('FormData headers:', headers);
        } catch (headerError) {
            console.error('Error getting FormData headers:', headerError);
            throw new Error(`Failed to prepare request headers: ${headerError.message}`);
        }
        
        // Add timeout wrapper for fetch (node-fetch v2 doesn't support timeout option)
        const fetchWithTimeout = (url, options, timeout = 60000) => {
            return Promise.race([
                fetch(url, options),
                new Promise((_, reject) =>
                    setTimeout(() => reject(new Error(`Request timeout after ${timeout}ms`)), timeout)
                )
            ]);
        };
        
        let response;
        try {
            // Use 60 second timeout for large file uploads
            // node-fetch v2: redirect: 'follow' maintains POST method for 307/308, but may change to GET for 301/302
            // Using www directly should avoid redirects, but set redirect to 'manual' and handle manually if needed
            console.log('Making POST request to:', n8nUrl);
            console.log('Request method:', 'POST');
            console.log('Request headers:', JSON.stringify(headers, null, 2));
            
            response = await fetchWithTimeout(n8nUrl, {
                method: 'POST',
                body: formData,
                headers: headers,
                redirect: 'follow' // Follow redirects - node-fetch v2 should maintain POST for 307/308
            }, 60000);
            
            console.log('Response status:', response.status);
            console.log('Response URL:', response.url); // This will show if redirect happened
        } catch (fetchError) {
            console.error('Fetch error:', fetchError);
            console.error('Error code:', fetchError.code);
            console.error('Error type:', fetchError.type);
            
            // Provide more helpful error messages
            if (fetchError.code === 'ECONNRESET' || fetchError.message.includes('socket hang up')) {
                throw new Error(`Connection to n8n webhook was reset. This may be due to: 1) Webhook timeout, 2) File too large, 3) Network issues. Original error: ${fetchError.message}`);
            } else if (fetchError.message.includes('timeout')) {
                throw new Error(`Request to n8n webhook timed out. The file may be too large or the webhook is slow to respond.`);
            } else {
                throw new Error(`Failed to connect to n8n webhook: ${fetchError.message}`);
            }
        }

        let responseData;
        try {
            responseData = await response.text();
        } catch (textError) {
            console.error('Error reading response:', textError);
            throw new Error(`Failed to read n8n response: ${textError.message}`);
        }
        
        console.log('n8n response:', {
            status: response.status,
            statusText: response.statusText,
            data: responseData.substring(0, 200) // First 200 chars
        });

        if (!response.ok) {
            throw new Error(`n8n webhook failed: ${response.status} ${response.statusText}. Response: ${responseData.substring(0, 500)}`);
        }

        // Return success
        res.json({
            success: true,
            message: 'Document submitted successfully',
            n8nResponse: responseData
        });

    } catch (error) {
        console.error('Error submitting document:', error);
        console.error('Error stack:', error.stack);
        res.status(500).json({
            success: false,
            error: error.message,
            details: process.env.NODE_ENV === 'development' ? error.stack : undefined
        });
    }
});

// Serve index.html for root
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Explicitly reject GET requests to API endpoint
app.get('/api/submit-document', (req, res) => {
    res.status(405).json({
        success: false,
        error: 'Method not allowed. Use POST to submit documents.'
    });
});

// Catch-all to serve HTML files (but not API routes)
app.get('*', (req, res) => {
    // Don't serve API routes as static files
    if (req.path.startsWith('/api/')) {
        return res.status(404).json({
            success: false,
            error: 'API endpoint not found'
        });
    }
    
    const filePath = path.join(__dirname, req.path);
    res.sendFile(filePath, (err) => {
        if (err) {
            res.status(404).send('Page not found');
        }
    });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`Frontend: http://localhost:${PORT}`);
    console.log(`API: http://localhost:${PORT}/api/submit-document`);
});
