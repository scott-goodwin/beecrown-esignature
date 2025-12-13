# Beecrown Logistics - Driver Onboarding System (Multi-File Architecture)

## Project Structure

```
onboarding/
├── index.html                  # Step 1: Initial Data Collection
├── step2-sla.html             # Step 2: Service Level Agreement
├── step3-privacy.html         # Step 3: Data Privacy Notice
├── step4-driver-info.html     # Step 4: Driver Information Pack
├── step5-licence.html         # Step 5: Driving Licence Declaration
├── thank-you.html             # Completion Page
├── css/
│   └── styles.css             # Shared styles
├── js/
│   ├── utils.js               # Shared utilities & API functions
│   └── signature.js           # Signature pad handler
└── assets/
    └── (optional images)
```

## How It Works

### Data Flow
1. **Step 1** (index.html) - Collects core driver information
2. Data saved to `sessionStorage`
3. Each subsequent step:
   - Loads data from `sessionStorage`
   - Displays document with populated data
   - Collects signature (if needed)
   - Generates PDF
   - Submits to Monday.com
   - Navigates to next step
4. **Thank You Page** - Clears session data

### Key Features

#### ✅ **Modular Architecture**
- Each step is a separate HTML file
- Shared CSS in one file
- Shared JavaScript utilities in separate files
- Easy to maintain and update individual steps

#### ✅ **Session Storage**
- Data persists across page navigation
- Cleared on completion
- Survives accidental page refreshes

#### ✅ **Reusable Components**
- `SignaturePad` class - handles all signature capture
- `utils.js` - common functions (validation, navigation, API, PDF generation)
- `styles.css` - consistent branding across all pages

#### ✅ **Better Performance**
- Only loads JavaScript needed for each step
- Smaller file sizes per page
- Faster initial load

#### ✅ **Easier Development**
- Multiple people can work on different steps
- Changes to one step don't affect others
- Easier to test individual steps
- Cleaner code separation

## Files Breakdown

### `index.html` - Step 1
- Collects: Name, email, phone, DOB, NI, driver reference, address
- No external dependencies except utils.js
- Validates all fields before proceeding
- Saves to sessionStorage and navigates to step2-sla.html

### `step2-sla.html` - Step 2  
- Loads driver data from sessionStorage
- Displays SLA with populated contractor details
- Signature capture using SignaturePad class
- Generates PDF using html2canvas + jsPDF
- Submits to Monday.com webhook
- Navigates to step3-privacy.html

### `step3-privacy.html` - Step 3
- (To be created - follows same pattern)
- Displays Data Privacy Notice
- Signature capture
- PDF generation & submission
- Navigate to step4-driver-info.html

### `step4-driver-info.html` - Step 4
- (To be created)
- Additional data collection (place of birth, mother's details, etc.)
- Address history with add/remove functionality
- Next of kin details
- PDF generation & submission (no signature needed)
- Navigate to step5-licence.html

### `step5-licence.html` - Step 5
- (To be created)
- Driving licence declaration
- Signature capture
- PDF generation & submission
- Navigate to thank-you.html

### `thank-you.html`
- Success message
- Clears sessionStorage
- End of flow

## Shared Files

### `css/styles.css`
- All CSS in one place
- Includes responsive breakpoints
- PDF generation hiding rules
- Consistent branding

### `js/utils.js`
Contains:
- `config` - webhook URL, director signature
- `storage` - sessionStorage management
- `navigation` - page routing
- `progress` - progress bar updates
- `validation` - form validation
- `ui` - loading/status messages
- `pdf` - PDF generation
- `api` - Monday.com submission
- `utils` - helper functions

### `js/signature.js`
- `SignaturePad` class
- Handles mouse & touch events
- Responsive canvas sizing
- Clear functionality
- Export to data URL
- Update display divs

## Deployment

### Option 1: Static Hosting (Render, Netlify, Vercel)
1. Upload entire `onboarding/` folder
2. Set `index.html` as entry point
3. Deploy
4. Done!

### Option 2: Simple Web Server
```bash
cd onboarding
python3 -m http.server 8000
```

### Option 3: Apache/Nginx
Copy files to web root:
```bash
cp -r onboarding/ /var/www/html/
```

## Adding New Steps (Steps 6-10)

To add remaining steps, create new HTML files following this template:

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document Name - Step X</title>
    <link rel="stylesheet" href="css/styles.css">
    <script src="https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js"></script>
</head>
<body>
    <div class="container">
        <!-- Progress Bar -->
        <div class="document-container progress-container">
            <div class="progress-text" id="progressText"></div>
            <div class="progress-bar">
                <div class="progress-fill" id="progressFill"></div>
            </div>
        </div>

        <!-- Document Content -->
        <div class="document-container" id="documentContainer">
            <!-- Your document HTML here -->
        </div>

        <div class="loading" id="loadingIndicator">
            <div class="spinner"></div>
            <p id="loadingText">Processing...</p>
        </div>
        <div class="status-message" id="statusMessage"></div>
    </div>

    <script src="js/utils.js"></script>
    <script src="js/signature.js"></script>
    <script>
        // Load data
        const driverData = storage.load();
        if (!driverData) {
            window.location.href = 'index.html';
        }

        // Update progress
        progress.update(X, 10); // X = step number

        // Populate document
        // ... your code here ...

        // Setup signature if needed
        const signaturePad = new SignaturePad('signaturePad', (hasSig) => {
            document.getElementById('submitBtn').disabled = !hasSig;
        });

        // Submit handler
        document.getElementById('submitBtn').addEventListener('click', async () => {
            ui.showLoading('Submitting document...');
            try {
                if (signaturePad) {
                    signaturePad.updateDisplay('signatureDisplay');
                }
                const pdfBlob = await pdf.generate('documentContainer');
                await api.submit('DocumentType', pdfBlob);
                ui.hideLoading();
                navigation.goToStep(X+1); // Next step
            } catch (error) {
                ui.hideLoading();
                ui.showStatus('Error: ' + error.message, 'error');
            }
        });
    </script>
</body>
</html>
```

## Benefits Over Single-File Approach

### ✅ **Maintainability**
- Easy to find and fix issues in specific steps
- Changes isolated to individual files
- Clear separation of concerns

### ✅ **Performance**
- Faster page loads (smaller files)
- Only load what's needed for each step
- Better browser caching

### ✅ **Development**
- Multiple developers can work simultaneously
- Easier code reviews
- Better version control

### ✅ **Scalability**
- Easy to add new steps (just create new file)
- Easy to modify existing steps
- Shared components prevent code duplication

### ✅ **Testing**
- Test individual steps in isolation
- Easier to debug
- Can use step-specific test data

### ✅ **User Experience**
- Cleaner URLs (step2-sla.html vs index.html#step2)
- Browser back button works naturally
- Can bookmark individual steps

## Current Status

**Completed:**
- ✅ Project structure
- ✅ Shared CSS (styles.css)
- ✅ Shared JavaScript (utils.js, signature.js)
- ✅ Step 1: Initial Data Collection
- ✅ Step 2: Service Level Agreement
- ✅ Thank You Page

**To Complete:**
- ⬜ Step 3: Data Privacy Notice
- ⬜ Step 4: Driver Information Pack
- ⬜ Step 5: Driving Licence Declaration

**Steps 3-5** follow the exact same pattern as Step 2. Simply:
1. Copy step2-sla.html
2. Rename to step3-privacy.html
3. Change document content
4. Update progress number
5. Update submit handler to go to next step

## Monday.com Webhook

Endpoint: `https://hosted-online-scott.com/webhook/bb55dfad-096d-4850-bbe2-196bde20ef73`

Payload includes:
- `documentType` - Document name
- `driverName` - Full name
- `driverReference` - Driver reference
- `email` - Email address
- `signatureDate` - Signature date
- `filename` - PDF filename
- `metadata` - JSON with additional fields
- `pdfFile` - PDF blob

## Browser Compatibility

- ✅ Chrome/Edge (latest)
- ✅ Firefox (latest)
- ✅ Safari (latest)
- ✅ Mobile browsers (iOS Safari, Chrome Mobile)

## Notes

- All data stored in sessionStorage (cleared on completion)
- PDFs generated client-side (no server processing needed)
- Director signature embedded as base64
- Mobile-responsive design
- Touch-friendly signature capture
