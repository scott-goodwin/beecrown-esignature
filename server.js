const express = require('express');
const fetch = require('node-fetch');
const multer = require('multer');
const FormData = require('form-data');
const path = require('path');

const app = express();
const upload = multer();

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
            hasFile: !!req.file
        });

        // Create FormData for n8n webhook
        const formData = new FormData();
        
        // Add all text fields
        formData.append('documentType', req.body.documentType);
        formData.append('driverName', req.body.driverName);
        formData.append('driverReference', req.body.driverReference);
        formData.append('email', req.body.email);
        formData.append('signatureDate', req.body.signatureDate);
        formData.append('filename', req.body.filename);
        
        // Add metadata
        if (req.body.metadata) {
            formData.append('metadata', req.body.metadata);
        }
        
        // Add PDF file
        if (req.file) {
            formData.append('pdfFile', req.file.buffer, {
                filename: req.body.filename,
                contentType: 'application/pdf'
            });
        }

        // Forward to n8n webhook
        const n8nUrl = 'https://hosted-online-scott.com/webhook/bb55dfad-096d-4850-bbe2-196bde20ef73';
        
        console.log('Forwarding to n8n webhook...');
        
        const response = await fetch(n8nUrl, {
            method: 'POST',
            body: formData,
            headers: formData.getHeaders()
        });

        const responseData = await response.text();
        
        console.log('n8n response:', {
            status: response.status,
            statusText: response.statusText,
            data: responseData.substring(0, 200) // First 200 chars
        });

        if (!response.ok) {
            throw new Error(`n8n webhook failed: ${response.status} ${response.statusText}`);
        }

        // Return success
        res.json({
            success: true,
            message: 'Document submitted successfully',
            n8nResponse: responseData
        });

    } catch (error) {
        console.error('Error submitting document:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// Serve index.html for root
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Catch-all to serve HTML files
app.get('*', (req, res) => {
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
