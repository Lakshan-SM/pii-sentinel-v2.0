document.addEventListener('DOMContentLoaded', () => {
    // --- Elements ---
    const textInput = document.getElementById('input-text');
    const textOutput = document.getElementById('output-text');
    const btnScan = document.getElementById('btn-scan');
    const btnCopy = document.getElementById('btn-copy');
    const btnClear = document.getElementById('btn-clear');
    const btnDownload = document.getElementById('btn-download');
    const fileUpload = document.getElementById('file-upload');
    const statsDashboard = document.getElementById('stats-dashboard');

    // --- Regex Patterns ---
    const PATTERNS = {
        email: /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g,
        phone: /(?:\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/g,
        ipv4: /\b(?:\d{1,3}\.){3}\d{1,3}\b/g,
        
        // UPDATED: Catches 13-19 digits, allowing flexible spaces or dashes
        cc: /\b(?:\d[ -]*?){13,19}\b/g, 
        
        apikey: /\b[A-Za-z0-9-_]{20,}\b/g
    };

    // --- Core Logic ---

    // FIXED Luhn Algorithm (Removed duplicate 'nDigit' declaration)
    function isValidLuhn(value) {
        // 1. cleanup: remove all spaces and dashes
        value = value.replace(/[\s-]/g, "");
        
        // 2. checks: must be digits only and proper length
        if (/[^0-9]/.test(value)) return false; 
        if (value.length < 13 || value.length > 19) return false;

        let nCheck = 0;
        let bEven = false;

        // 3. Loop through digits
        for (let n = value.length - 1; n >= 0; n--) {
            let cDigit = value.charAt(n);
            let nDigit = parseInt(cDigit, 10);

            if (bEven) {
                if ((nDigit *= 2) > 9) nDigit -= 9;
            }
            nCheck += nDigit;
            bEven = !bEven;
        }
        return (nCheck % 10) == 0;
    }

    // Main Redaction Function
    function performRedaction() {
        console.log("Scan button clicked..."); 

        let rawText = textInput.value;
        
        // Alert if input is empty
        if (!rawText.trim()) {
            alert("Please paste text or upload a file first!");
            return;
        }

        let processedText = rawText;
        let counts = { email: 0, phone: 0, critical: 0, total: 0 };
        const isPartial = document.querySelector('input[name="mask-mode"]:checked').value === 'partial';

        // 1. Redact Emails
        if (document.getElementById('toggle-email').checked) {
            processedText = processedText.replace(PATTERNS.email, (match) => {
                counts.email++;
                counts.total++;
                if (isPartial) {
                    letParts = match.split('@');
                    let user = letParts[0];
                    let domain = letParts[1];
                    return `${user.substring(0, 2)}***@${domain}`;
                }
                return '[EMAIL REMOVED]';
            });
        }

        // 2. Redact Phones
        if (document.getElementById('toggle-phone').checked) {
            processedText = processedText.replace(PATTERNS.phone, (match) => {
                counts.phone++;
                counts.total++;
                return isPartial ? match.substring(0, 3) + '-***-****' : '[PHONE REMOVED]';
            });
        }

        // 3. Redact IPv4
        if (document.getElementById('toggle-ipv4').checked) {
            processedText = processedText.replace(PATTERNS.ipv4, () => {
                counts.critical++;
                counts.total++;
                return '[IP REDACTED]';
            });
        }

        // 4. Redact API Keys
        if (document.getElementById('toggle-apikey').checked) {
            processedText = processedText.replace(PATTERNS.apikey, (match) => {
                if (match.length > 20 && (match.match(/\d/) && match.match(/[a-zA-Z]/))) {
                    counts.critical++;
                    counts.total++;
                    return '[API-KEY REDACTED]';
                }
                return match;
            });
        }

        // 5. Redact Credit Cards
        if (document.getElementById('toggle-cc').checked) {
            processedText = processedText.replace(PATTERNS.cc, (match) => {
                if (isValidLuhn(match)) {
                    counts.critical++;
                    counts.total++;
                    return isPartial ? `****-****-****-${match.slice(-4)}` : '[CC REMOVED]';
                }
                return match;
            });
        }
        
        // Update UI
        textOutput.value = processedText;
        updateStats(counts);

        if(counts.total === 0) {
            alert("Scan complete. No sensitive data found.");
        }
    }

    function updateStats(counts) {
        document.getElementById('stat-total').innerText = counts.total;
        document.getElementById('stat-email').innerText = counts.email;
        document.getElementById('stat-phone').innerText = counts.phone;
        document.getElementById('stat-critical').innerText = counts.critical;
        statsDashboard.style.display = 'flex';
    }

    // --- Event Listeners ---

    btnScan.addEventListener('click', performRedaction);

    btnCopy.addEventListener('click', () => {
        textOutput.select();
        document.execCommand('copy'); 
        navigator.clipboard.writeText(textOutput.value).then(() => {
            const originalText = btnCopy.innerHTML;
            btnCopy.innerHTML = '<i class="fa-solid fa-check"></i> Copied!';
            setTimeout(() => btnCopy.innerHTML = originalText, 2000);
        });
    });

    btnClear.addEventListener('click', () => {
        textInput.value = '';
        textOutput.value = '';
        statsDashboard.style.display = 'none';
    });

    fileUpload.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (e) => {
            textInput.value = e.target.result;
        };
        reader.readAsText(file);
    });

    btnDownload.addEventListener('click', () => {
        if (!textOutput.value) return;
        const blob = new Blob([textOutput.value], { type: 'text/plain' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'redacted_output.txt';
        a.click();
        window.URL.revokeObjectURL(url);
    });
});
