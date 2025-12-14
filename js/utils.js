// Beecrown Logistics - Shared Utilities

const config = {
    // Use relative path - will use same domain as the frontend
    // This assumes server.js is running on the same Render service
    webhookUrl: '/api/submit-document',
    
    // Alternative: if server.js is on different domain
    // webhookUrl: 'https://your-backend.onrender.com/api/submit-document',
    
    directorSignature: 'data:image/png;base64,UklGRgYPAABXRUJQVlA4WAoAAAAgAAAAYwEA4QAASUNDUMgBAAAAAAHIAAAAAAQwAABtbnRyUkdCIFhZWiAH4AABAAEAAAAAAABhY3NwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAA9tYAAQAAAADTLQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAlkZXNjAAAA8AAAACRyWFlaAAABFAAAABRnWFlaAAABKAAAABRiWFlaAAABPAAAABR3dHB0AAABUAAAABRyVFJDAAABZAAAAChnVFJDAAABZAAAAChiVFJDAAABZAAAAChjcHJ0AAABjAAAADxtbHVjAAAAAAAAAAEAAAAMZW5VUwAAAAgAAAAcAHMAUgBHAEJYWVogAAAAAAAAb6IAADj1AAADkFhZWiAAAAAAAABimQAAt4UAABjaWFlaIAAAAAAAACSgAAAPhAAAts9YWVogAAAAAAAA9tYAAQAAAADTLXBhcmEAAAAAAAQAAAACZmYAAPKnAAANWQAAE9AAAApbAAAAAAAAAABtbHVjAAAAAAAAAAEAAAAMZW5VUwAAACAAAAAcAEcAbwBvAGcAbABlACAASQBuAGMALgAgADIAMAAxADZWUDggGA0AAHBFAJ0BKmQB4gA+USaRRiOiIaEjcik4cAoJaW7hc/Eb813xv/ne03/I+IfiO9Ee4XIw83/gP+l6D/yH7E/mP7T6Fd7PAI/HP6N/q95PAD1UGqD7Q/h/+l7gH86/sHpN/uvBF9N9gP+g/639jPZL+r/Rt9V+wuKVIvzkvOFJecKS84Ul5wpLzbuD9C/GKKS84Ul5wpLzg2RNpAcF0CQ2o9qUUPxowv5TgU7zZDvzgY7OdObtt+cl5wpLfoph3EYIrMWBOgpxZa7U+HSBWhQqG8bBg5kcma2AEn/LeukvOFDKkaQSy+vxRb1QCvzLrXGDDsmiQtxNYDtqeTH+S5//IQmlX8BAU6I0OWoGkgFUZp1Kaw3s9qUUkCQCveFGKlSfIxg7W6KNqY+QKhCy0uNhvRVB9e/OXFoxqTKmyaXQy77Op+Oq2p31JMduxE0G5G+NugX5yXknfpK9QBWIXHWKxhssr9HFSTRrBVp8M9Hy1McS92wXAkWe6Nc+9MEv5wf1zSk623LsKvtd8AZBJBEDbD/8k82QawwMhCdYKFKWbQxaek5RYn7NEis+iQMfBqcrter+oc5Wqp+RtR7K5hJHBfTlz667FMNKhBJiZ9UgDaopLzbvOxy/pngWBJ1gC5/Y4OqmcmsRqCofJjDkvOFJecKS3+ABP0rhhf5MU4oJ+sAmoygs/N4zJ7UopLzhSXnCkdremMSXnLse1KKS84Ul5wpNX05LzhSXnCkvOFJecKS84UlvAAD+/7B+AxjAxJv9XtMOd7OQ6j0xqPDx7GUgSGRU/hrhJFvxv/gMgNxc34kfhlMkBPQ6Ewu5DhqPrn8c3LsHfXrs+yl0qnmH40ynzUNRVI8LPTATKmTSUxxaDFfskJGsgTz0KP4tFm5UqmdMTmMmjzZtADBRldTxqdEblZ99TFWifQ9HDByDlFQTdsOwbjJMGgDsEpkPL37XGX2VIh/eu9MRmwfgOOEb3Zb+xiMrRwZNKqvotojFFQgsL5iB6v0RJzLogcy6Of0zwWn4OknT5R2lvv5CKebjba+lnl4bFTiiIvh2fWYsKALPhVcdL+WtIpA1JUeS+sM77nXGJ8ppMi6cCdAUTUag/zb/3isrEMY521UdhDq2AwS7PhNtkOFWFCwY8xhAUz/yrrGSPAm8qal4wJG1ogBDaN+wcl9xtKZZktgGsJZOPd7H8J2dt11yt9TZs/wo5hI34EImwXE9eAUXoxxMZw0dtZP/PR4sXd02x0cwbHBD5GaFVfnrP5jcXblzGd+iRwuzjMMWtXh1pHQJ1a/C1on5u59AxMhVppimhgT5d3XwTwVAUIHY0tmhGDDPR9I4ohg0JYpOSjYR4dLJInGVoS4Vfuncl+VOEGl7mDWU5LqXd/t8wY7Mo8De3f4+BYVB/GzbSuCxLng0iwv89x91+z3OgMwg0OIrkIK2kT/SdG6nEtGmWz05Yx04gnzh7fg0kTCUB15WdT1oPqevX+chUj8E1KfH4d4KBoTbyeHUbXrOJTRGkBrIafna3ti3fjVT6eHdzNc/7X90Y9wXvT4qI59VbdpsdDktzBAOlvJCzeCSN7MNcB6TWfIBR8o77QOxrPnVbN+5JSGZCJw/LBB4QB+9Xj+a8b118nHE3NknvmPA3kGxxFAF6VI/t/RQRFATSrQwrMfb7cnmbNlw3gvTrbulRuk++Yq5d1dQxgP3EnZ0kAfJqkUp+6fjb7mRSav3AI0MD6qmatSF267GmQsq5Q7br5MHNycUCvZD1/DWwihXuiSM0FK9QWOq/EmHAEi6xqUEx7YUPj0/AYDA+myNfoa6fbvR367TqChg6WIYvfdredm6/kX6/jgyQh77wT249ByLAViHRDPehBjK1mQHRpl5CcdyfsezXZ0zOw/zfXK26vDNb2NDnTG2ZE+NuTnq5aEMEUBEyzsX2grVJaHAhZryISyMTOHGHOzp4b3ve7GfjqfOZVSoAWe3rXHxCll5v0nu3HlD39GhON+C+/fWC960UTd0f76kPNa1dJBHmGJac9ozwmjJZLB1QJW5zjOUcVcOEvksvYMOaOdYsI02eTNrmqX3wK1RUYZeAx7C5w42t1SNPZ/su+bLnEBjvW1GVKZxwTBfK62HTaC+XEwvSSbg7rT6XQI6uOSjbqkiKLQ8bnUGtAEpoyju17EKxZv4jAuvU3g5b8OD2Vg49podNA5UEVuy99dD9zp3Wn81JOK6R9MBR//IhFRa0KMf1C1fq6lt8g/iNGkMqqiHMiKAUKynVFF3JD0oF/IKPad1Woo32oJBKZLxQ4YeFHbf1O2GexWtrYOmnHgLGMbFAVEkQ9hBzsOHTDn7OHMRinr6ltfj6gwFLdauPPhEOVCfDBNMxJfVPAXc+eCl0oRcQaMSp30rmak8Vs+Wbfwygr60QyOHjZdIuhEZtP3+kpH7njkEYb7FW1AVEcZL1UFEbxB4lhlmqHKCw7uMJOSOc0htLS1X/L4TDuBhPWzDoxGVtFNVnOPAd7Xb/R2Dz6op3lG4Qwd+oY/wtrxNNwb+YSdIbxavz8ODt4p+l1xIlewHMOQjg/4m+NXGP4/TAbG0jQFYnghVzOg9eTefCEgLqQPXcZ5f9fLdQRAwF28t7R0NFOBqlhiZnL9U8wGsLJQoeG1cc5CW6SaCYasVpNwykD35botv7Q1HEBoYHg4p3lXQ19zFbvyRoz18YoAkbXEA96IAUAN8mY2O/0NYSygdT7N4unDAXNDYOTvFGS+rk3RkeKo1HXXdSpMsylWz8TbFwQN7JbUiE+DnudBdBBI8NRMKKPE9eARQquioy7z8O+Bna9xyrPxyYE7tWIIwe2UzmnvWpQaRSpG/6P6x5XwYNcX4XiZ6h8pwnFNgAkGUWBazymwUfZdpY/XP0Jm6bYCz+XGLsjCid5brRip4fdZxrWB1G2QMlUe5yM51+7cDK5iPQxwUq1lvIQnYmxj94fCosX8H6UioCA2XvXt5f6CWcNyrdl5NDU+g3rNzzlDGPaQGR5kG4tOjKr7O6cEhz3AU/CyYt1mnwUnYa9jot7h2Y4rhjnFBhBXNdZ20ywUf3FAyGKM/PeyCCntP2bt7PXByKoNe5rSV/f8ZmRpwWasy3R6iwZlsT81ckyG/nW/F9pbCjTuiolLcG//eDKucMjJqyVpePwrk3hbyxZxqlj4DEL6pjjsem18quJrpHJnefiNcnpEt6ymkVRl9/B2dGY+aWlQROwmVpB0YVI3XIuq1d0vrmb5J12vlvADJr1vjMda0pRjZ9AApMLVxesyp+OaWhUBVbub6ZSbb2TjZELnPW1O1yVeN/Sxtgv4cXNRzSOQbraBp7EY3e/aFf+oUPjRO6jabNZMTmIMgSevU77DhP0X6iS/pTjV+qaJDDDoy7agS7iDRUDpOxijO/gd+Luxpd3AZCvPF4b2zs8SMrw71rJgpKellDpkPH/vkIy473H+ECBrolK34YZcu41crBnf79mX4NMXqtbJsxzWVC2En9zywpoz6gYeKU7UO5ya2231no6RtziJVI9lyIiGKlMXJoI8m2IOTdjIxwo1P26MjwFHMooogt1tW0hAGrthzyWHxuvhc2UHqVXMrL/pxyCIo4SHbzoA6Ott1SJiPqWNxcfE/v5p+0I2CgXxpM4agiJbzGQGTG04jRhCBGCgEMtQeZuPOaccID4hqArCd1Vn6d9QQ2pTn+zNpng0Psn3ivHQVvOJesjVNbCxuuW+fGFTmYmhMela7f64K/HLSQQp2yEtmnL2ykLmtd6oLCBEXF/Tb8yy5+dzqxzBJywljgw0KEmFieq1+ukEZjseUH99J59GzRRTSf2P2mXqikBLR9diRsOYvcceD2Y3+kOjjRO/dEJypdtb0WxODee0XW8p4yyeXzkaZVprK2TArZ38zuhqpc/ZjI6LewtZ6TkHN+3wOXJROEpR4vqLS5+/RbNCE8B6YXN6KrJo0p0ph7xMWHyoRsuiNsCpt/Q6hiBSa3QAQdRj1L5hINukX7aDygLzXtwQSKwe66ahELwlub+r/HO+sjQxArnmgLpQhXgTm888wBWyVrQaNQjUMPtCFiZVwiWXLKvvlf1882IdPQZd7uftpF5emXSFz09k+y99wzswRoZg0M/S8sBDh6KyaxGSWAxBH9yF4Gzt4SP7dqX+4XWbJxcHACWtIM8aH2TtONWz0b/124NgOy/qBqgMLXMbPDfL2SAH1aTJ5PM7yQLVKWpxFCJbDfUB8JFoZuG+ply2O8yvoOGpNI8fBANA4sFqffxN3vBa9swoDPx6VPIgDbSjv4LGgKeOw8hrAU3R/Kyqjolzl1wof3YbOY4tiv3QkCp5gbucFEqteaM1gyMm9QesXGHoMn273X9p3Z46V4YIG3eSgysk7ZRMffidZyvoZIyAxCUgcBVe97U/heSYtP4KsiBqcKtL0FTz9AavxtXEYbvLJKhaA63//iT/DC3UJBDsd7NWzxdt3HCijz2AAAAAAAAA='
};

const stepLabels = [
    'Personal Information',
    'Non-Mandatory Deduction Form',
    'Stop and Search Policy',
    'Data Privacy Notice',
    'Non-Disclosure & Data Protection',
    'Driving Licence Declaration',
    'DVLA Share Your Driving Licence Scheme',
    'Driver\'s Information Pack',
    'Medical Fitness Declaration',
    'Policy Handbook'
];

// Session Storage Management
const storage = {
    save: (data) => {
        sessionStorage.setItem('driverData', JSON.stringify(data));
    },
    
    load: () => {
        const data = sessionStorage.getItem('driverData');
        return data ? JSON.parse(data) : null;
    },
    
    clear: () => {
        sessionStorage.removeItem('driverData');
    },
    
    saveProgress: (step) => {
        sessionStorage.setItem('currentStep', step);
    },
    
    getProgress: () => {
        return parseInt(sessionStorage.getItem('currentStep') || '1');
    }
};

// Navigation
const navigation = {
    goTo: (page) => {
        // Handle special pages
        if (page === 'thank-you') {
            window.location.href = 'thank-you.html';
        } else {
            window.location.href = page;
        }
    },
    
    goToStep: (step) => {
        const pages = {
            1: 'step1-personal.html',
            2: 'step2-deduction.html',
            3: 'step3-stop-search.html',
            4: 'step4-privacy.html',
            5: 'step5-non-disclosure.html',
            6: 'step6-driving-licence.html',
            7: 'step7-dvla.html',
            8: 'step8-driver-info.html',
            9: 'step9-medical-fitness.html',
            10: 'step10-policy-handbook.html',
            'thank-you': 'thank-you.html'
        };
        
        if (pages[step]) {
            storage.saveProgress(step);
            window.location.href = pages[step];
        }
    }
};

// Progress Bar
const progress = {
    update: (currentStep, totalSteps = 5) => {
        const percentage = (currentStep / totalSteps) * 100;
        const progressFill = document.getElementById('progressFill');
        const progressText = document.getElementById('progressText');
        
        if (progressFill) {
            progressFill.style.width = percentage + '%';
        }
        
        if (progressText) {
            progressText.textContent = `Step ${currentStep} of ${totalSteps}: ${stepLabels[currentStep - 1]}`;
        }
    }
};

// Form Validation
const validation = {
    clearErrors: () => {
        document.querySelectorAll('.form-error').forEach(el => el.classList.remove('show'));
        document.querySelectorAll('input, select, textarea').forEach(el => el.classList.remove('error'));
        const generalError = document.querySelector('.general-error');
        if (generalError) generalError.classList.remove('show');
    },
    
    showError: (fieldId, message) => {
        const field = document.getElementById(fieldId);
        const error = document.getElementById(fieldId + 'Error');
        
        if (field) field.classList.add('error');
        if (error) {
            error.textContent = message;
            error.classList.add('show');
        }
    },
    
    showGeneralError: (message = '⚠️ Please fill in all required fields before continuing') => {
        const generalError = document.querySelector('.general-error');
        if (generalError) {
            generalError.textContent = message;
            generalError.classList.add('show');
        }
    },
    
    validateEmail: (email) => {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    }
};

// Loading/Status
const ui = {
    showLoading: (message = 'Processing...') => {
        const loadingEl = document.getElementById('loadingIndicator');
        const loadingText = document.getElementById('loadingText');
        
        if (loadingText) loadingText.textContent = message;
        if (loadingEl) loadingEl.style.display = 'flex';
    },
    
    hideLoading: () => {
        const loadingEl = document.getElementById('loadingIndicator');
        if (loadingEl) loadingEl.style.display = 'none';
    },
    
    showStatus: (message, type = 'success') => {
        const statusEl = document.getElementById('statusMessage');
        if (statusEl) {
            statusEl.textContent = message;
            statusEl.className = `status-message ${type}`;
            statusEl.style.display = 'block';
            window.scrollTo(0, 0);
            
            if (type === 'success') {
                setTimeout(() => statusEl.style.display = 'none', 5000);
            }
        }
    }
};

// PDF Generation
const pdf = {
    generate: async (containerId) => {
        const element = document.getElementById(containerId);
        if (!element) throw new Error('Container not found');
        
        // Store original scroll position
        const originalScrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const originalScrollLeft = window.pageXOffset || document.documentElement.scrollLeft;
        
        // FIRST: Hide signature input section and submit button BEFORE any calculations
        // This ensures they don't affect height calculations
        const signatureSection = element.querySelector('.signature-section');
        const submitBtn = element.querySelector('#submitBtn');
        const signaturePad = element.querySelector('#signaturePad');
        
        const originalSigDisplay = signatureSection ? signatureSection.style.display : '';
        const originalBtnDisplay = submitBtn ? submitBtn.style.display : '';
        const originalPadDisplay = signaturePad ? signaturePad.style.display : '';
        
        if (signatureSection) signatureSection.style.display = 'none';
        if (submitBtn) submitBtn.style.display = 'none';
        if (signaturePad) signaturePad.style.display = 'none';
        
        // Add class to hide signature input section (for CSS rules)
        element.classList.add('pdf-generation');

        // Ensure element and its parents are fully visible
        const originalOverflow = element.style.overflow;
        const originalHeight = element.style.height;
        const originalMaxHeight = element.style.maxHeight;
        const originalParentOverflow = element.parentElement ? element.parentElement.style.overflow : '';
        
        element.style.overflow = 'visible';
        element.style.height = 'auto';
        element.style.maxHeight = 'none';
        if (element.parentElement) {
            element.parentElement.style.overflow = 'visible';
        }
        
        // Scroll to top of element to ensure we start from the beginning
        element.scrollIntoView({ behavior: 'instant', block: 'start' });
        
        // Force multiple reflows to ensure all content is rendered (excluding hidden signature section)
        element.offsetHeight;
        await new Promise(resolve => setTimeout(resolve, 150));
        element.offsetHeight;
        await new Promise(resolve => setTimeout(resolve, 150));
        element.offsetHeight;
        await new Promise(resolve => setTimeout(resolve, 150));
        
        // Scroll to bottom to ensure all content is loaded/rendered
        window.scrollTo(0, element.scrollHeight);
        await new Promise(resolve => setTimeout(resolve, 300));
        window.scrollTo(0, 0);
        await new Promise(resolve => setTimeout(resolve, 200));
        
        // Force final reflow
        element.offsetHeight;
        await new Promise(resolve => setTimeout(resolve, 100));
        
        // Simple approach: just capture all HTML - let html2canvas handle it
        // The signature section is already hidden via CSS, so it won't be captured
        // Use scrollHeight to get the full content height
        const finalScrollHeight = element.scrollHeight;
        const finalScrollWidth = element.scrollWidth;
        
        console.log('PDF Generation - Capturing all HTML:', {
            scrollWidth: finalScrollWidth,
            scrollHeight: finalScrollHeight,
            note: 'Capturing entire element scrollHeight, signature section hidden via CSS'
        });

        // Capture the full scroll height - html2canvas will handle the rest
        const captureHeight = finalScrollHeight;
        
        console.log('PDF Generation - html2canvas capture settings:', {
            width: finalScrollWidth,
            height: captureHeight,
            scrollHeight: element.scrollHeight,
            finalScrollHeight: finalScrollHeight
        });

        // Don't specify height - let html2canvas capture everything naturally
        const canvas = await html2canvas(element, {
            scale: 2, // Higher scale for better quality
            useCORS: true,
            logging: false,
            backgroundColor: '#ffffff',
            // Don't limit width/height - let it capture all content
            allowTaint: true,
            removeContainer: false,
            onclone: (clonedDoc) => {
                // Ensure cloned element also has proper dimensions
                const clonedElement = clonedDoc.getElementById(containerId);
                if (clonedElement) {
                    clonedElement.style.overflow = 'visible';
                    clonedElement.style.height = 'auto';
                    clonedElement.style.maxHeight = 'none';
                    clonedElement.style.width = 'auto';
                    // Ensure signature section is still hidden in clone
                    const clonedSigSection = clonedElement.querySelector('.signature-section');
                    const clonedSubmitBtn = clonedElement.querySelector('#submitBtn');
                    const clonedSigPad = clonedElement.querySelector('#signaturePad');
                    if (clonedSigSection) clonedSigSection.style.display = 'none';
                    if (clonedSubmitBtn) clonedSubmitBtn.style.display = 'none';
                    if (clonedSigPad) clonedSigPad.style.display = 'none';
                }
            }
        });
        
        console.log('PDF Generation - Canvas captured:', {
            canvasWidth: canvas.width,
            canvasHeight: canvas.height,
            expectedHeight: finalScrollHeight * 2 // scale 2
        });

        // Restore original styles and scroll position
        element.style.overflow = originalOverflow;
        element.style.height = originalHeight;
        element.style.maxHeight = originalMaxHeight;
        if (element.parentElement) {
            element.parentElement.style.overflow = originalParentOverflow;
        }
        
        // Restore signature section visibility
        if (signatureSection) signatureSection.style.display = originalSigDisplay;
        if (submitBtn) submitBtn.style.display = originalBtnDisplay;
        if (signaturePad) signaturePad.style.display = originalPadDisplay;
        
        window.scrollTo(originalScrollLeft, originalScrollTop);
        element.classList.remove('pdf-generation');
        
        console.log('PDF Generation - Canvas dimensions:', {
            canvasWidth: canvas.width,
            canvasHeight: canvas.height,
            expectedHeight: finalScrollHeight * 2 // scale 2
        });

        // Simple, reliable approach: capture full content and split into pages
        const { jsPDF } = window.jspdf;
        const pdfDoc = new jsPDF('p', 'mm', 'a4');
        const pdfWidth = pdfDoc.internal.pageSize.getWidth(); // 210mm
        const pdfHeight = pdfDoc.internal.pageSize.getHeight(); // 297mm
        
        // Convert canvas to image
        const imgData = canvas.toDataURL('image/jpeg', 0.95);
        
        // Calculate dimensions
        const scale = 2;
        const dpi = 96;
        const pixelsPerMm = (dpi * scale) / 25.4;
        
        const imgWidthMm = canvas.width / pixelsPerMm;
        const imgHeightMm = canvas.height / pixelsPerMm;
        
        // Scale to fill full A4 width
        const widthScale = pdfWidth / imgWidthMm;
        const scaledWidth = pdfWidth;
        const scaledHeight = imgHeightMm * widthScale;

        console.log('PDF Generation - Pagination:', {
            imgHeightMm,
            scaledHeight,
            pdfHeight,
            totalPages: Math.ceil(scaledHeight / pdfHeight)
        });

        // Improved pagination: ensure all content is added
        let position = 0;
        let pageCount = 0;
        const totalPages = Math.ceil(scaledHeight / pdfHeight);
        
        // Add first page
        pdfDoc.addImage(imgData, 'JPEG', 0, position, scaledWidth, scaledHeight);
        pageCount++;
        
        // Add additional pages until all content is shown
        while (pageCount < totalPages) {
            position = -(pageCount * pdfHeight);
            pdfDoc.addPage();
            pdfDoc.addImage(imgData, 'JPEG', 0, position, scaledWidth, scaledHeight);
            pageCount++;
            
            // Safety check to prevent infinite loop
            if (pageCount > 100) {
                console.error('PDF Generation - Too many pages, stopping at', pageCount);
                break;
            }
        }
        
        console.log('PDF Generation - Completed:', {
            totalPages: pageCount,
            expectedPages: totalPages
        });
        
        return pdfDoc.output('blob');
    }
};

// API Submission
const api = {
    submit: async (docType, pdfBlob, metadata = {}) => {
        const driverData = storage.load();
        if (!driverData) throw new Error('No driver data found');
        
        const timestamp = new Date().toISOString()
            .replace(/[-:]/g, '')
            .replace(/\..+/, '')
            .replace('T', '');
        
        // Handle missing driverReference (for step 1)
        const driverRef = driverData.driverReference || 'TEMP-' + timestamp;
        const filename = `${docType}_${driverRef}_${timestamp}.pdf`;

        const formData = new FormData();
        formData.append('documentType', docType);
        formData.append('driverName', driverData.fullName || metadata.driverName || '');
        formData.append('driverReference', driverRef);
        formData.append('email', driverData.email || '');
        formData.append('signatureDate', new Date().toISOString().split('T')[0]);
        formData.append('filename', filename);
        
        // Merge default metadata with provided metadata
        const fullMetadata = {
            phone: driverData.phone || '',
            dateOfBirth: driverData.dateOfBirth || '',
            nationalInsurance: driverData.nationalInsurance || '',
            address: driverData.formattedAddress || '',
            ...metadata
        };

        formData.append('metadata', JSON.stringify(fullMetadata));
        formData.append('pdfFile', pdfBlob, filename);

        // Ensure POST method is explicitly set
        const response = await fetch(config.webhookUrl, {
            method: 'POST',
            body: formData,
            // Don't set Content-Type - browser will set it with boundary for FormData
        });

        if (!response.ok) {
            const errorText = await response.text().catch(() => response.statusText);
            throw new Error(`Submission failed: ${response.status} ${response.statusText} - ${errorText}`);
        }

        return await response.json();
    }
};

// Utility Functions
const utils = {
    formatDate: (date) => {
        if (!date) return '';
        return new Date(date).toLocaleDateString('en-GB');
    },
    
    formatDateForInput: () => {
        return new Date().toISOString().split('T')[0];
    },
    
    scrollToTop: () => {
        window.scrollTo(0, 0);
    }
};
