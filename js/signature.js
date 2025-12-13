// Signature Pad Handler

class SignaturePad {
    constructor(canvasId, onSignatureChange) {
        this.canvas = document.getElementById(canvasId);
        if (!this.canvas) {
            throw new Error(`Canvas with id "${canvasId}" not found`);
        }
        
        this.ctx = this.canvas.getContext('2d');
        this.isDrawing = false;
        this.hasSignature = false;
        this.onSignatureChange = onSignatureChange || (() => {});
        
        this.setup();
    }
    
    setup() {
        // Set canvas size
        this.resize();
        
        // Configure drawing style
        this.ctx.strokeStyle = '#000';
        this.ctx.lineWidth = 2;
        this.ctx.lineCap = 'round';
        this.ctx.lineJoin = 'round';
        
        // Mouse events
        this.canvas.addEventListener('mousedown', (e) => this.startDrawing(e));
        this.canvas.addEventListener('mousemove', (e) => this.draw(e));
        this.canvas.addEventListener('mouseup', () => this.stopDrawing());
        this.canvas.addEventListener('mouseout', () => this.stopDrawing());
        
        // Touch events
        this.canvas.addEventListener('touchstart', (e) => this.handleTouch(e), { passive: false });
        this.canvas.addEventListener('touchmove', (e) => this.handleTouch(e), { passive: false });
        this.canvas.addEventListener('touchend', () => this.stopDrawing());
        
        // Resize handler
        window.addEventListener('resize', () => this.resize());
    }
    
    resize() {
        const container = this.canvas.parentElement;
        const containerWidth = container.offsetWidth;
        
        if (window.innerWidth <= 768) {
            this.canvas.width = containerWidth - 32;
            this.canvas.height = 150;
        } else {
            this.canvas.width = 800;
            this.canvas.height = 200;
        }
        
        // Reconfigure style after resize
        this.ctx.strokeStyle = '#000';
        this.ctx.lineWidth = 2;
        this.ctx.lineCap = 'round';
        this.ctx.lineJoin = 'round';
    }
    
    startDrawing(e) {
        this.isDrawing = true;
        this.hasSignature = true;
        this.onSignatureChange(true);
        
        const rect = this.canvas.getBoundingClientRect();
        this.ctx.beginPath();
        this.ctx.moveTo(e.clientX - rect.left, e.clientY - rect.top);
    }
    
    draw(e) {
        if (!this.isDrawing) return;
        
        const rect = this.canvas.getBoundingClientRect();
        this.ctx.lineTo(e.clientX - rect.left, e.clientY - rect.top);
        this.ctx.stroke();
    }
    
    stopDrawing() {
        this.isDrawing = false;
    }
    
    handleTouch(e) {
        e.preventDefault();
        const touch = e.touches[0];
        const rect = this.canvas.getBoundingClientRect();
        
        if (e.type === 'touchstart') {
            this.isDrawing = true;
            this.hasSignature = true;
            this.onSignatureChange(true);
            this.ctx.beginPath();
            this.ctx.moveTo(touch.clientX - rect.left, touch.clientY - rect.top);
        } else if (e.type === 'touchmove' && this.isDrawing) {
            this.ctx.lineTo(touch.clientX - rect.left, touch.clientY - rect.top);
            this.ctx.stroke();
        }
    }
    
    clear() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.hasSignature = false;
        this.onSignatureChange(false);
    }
    
    isEmpty() {
        return !this.hasSignature;
    }
    
    toDataURL() {
        return this.canvas.toDataURL('image/png');
    }
    
    updateDisplay(displayElementId) {
        const displayEl = document.getElementById(displayElementId);
        if (!displayEl) return;
        
        const signatureImage = this.toDataURL();
        const img = document.createElement('img');
        img.src = signatureImage;
        img.style.maxWidth = '200px';
        img.style.marginTop = '0.5rem';
        
        // Clear existing content
        displayEl.innerHTML = '';
        displayEl.appendChild(img);
    }
}

// Export for use in other files
window.SignaturePad = SignaturePad;
