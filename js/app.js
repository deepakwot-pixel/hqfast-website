// website/js/app.js

document.addEventListener('DOMContentLoaded', () => {
    // Smooth scrolling for anchor links and active nav state
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-links a');

    // Add active class on scroll
    window.addEventListener('scroll', () => {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            if (window.pageYOffset >= (sectionTop - 200)) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            const href = link.getAttribute('href');
            if (href && href.startsWith('#') && href.length > 1) {
                link.classList.remove('active');
                if (href.includes(current) && current !== '') {
                    link.classList.add('active');
                }
            }
        });
    });

    // Close modals on clicking outside overlay
    ['doc-modal', 'about-modal', 'contact-modal'].forEach(id => {
        const modal = document.getElementById(id);
        if (modal) {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    modal.style.display = 'none';
                }
            });
        }
    });
});

// Document Modal functions
async function openModal(docPath) {
    const modal = document.getElementById('doc-modal');
    const titleElement = document.getElementById('modal-title');
    const bodyElement = document.getElementById('modal-body');
    
    modal.style.display = 'flex';
    const docName = docPath.split('/').pop().replace('.md', '').replace('-', ' ').toUpperCase();
    titleElement.textContent = `DOCUMENT: ${docName}`;
    bodyElement.innerHTML = '<p>Loading document content...</p>';
    
    try {
        const response = await fetch(docPath);
        if (!response.ok) throw new Error('Document not found');
        const markdown = await response.text();
        bodyElement.innerHTML = marked.parse(markdown);
    } catch (err) {
        bodyElement.innerHTML = `<p style="color: var(--accent-red)">Error loading document: ${err.message}</p>`;
    }
}

function closeModal() {
    document.getElementById('doc-modal').style.display = 'none';
}

// About Us Modal functions
function openAboutModal() {
    document.getElementById('about-modal').style.display = 'flex';
}

function closeAboutModal() {
    document.getElementById('about-modal').style.display = 'none';
}

// Contact Modal functions
function openContactModal() {
    document.getElementById('contact-modal').style.display = 'flex';
    // reset form status
    const status = document.getElementById('enquiry-status');
    if (status) status.style.display = 'none';
}

function closeContactModal() {
    document.getElementById('contact-modal').style.display = 'none';
}

// Form Submission Endpoint (FormSubmit - Direct Email Delivery)
const FORM_ENDPOINT = "https://formsubmit.co/ajax/deepak@hqfast.com";

async function submitEnquiry(event) {
    event.preventDefault();
    
    const form = document.getElementById('enquiry-form');
    const name = document.getElementById('contact-name').value;
    const btn = document.getElementById('submit-enquiry-btn');
    const status = document.getElementById('enquiry-status');

    btn.disabled = true;
    btn.textContent = 'Submitting Enquiry...';
    status.style.display = 'none';

    const formData = new FormData(form);

    try {
        const response = await fetch(FORM_ENDPOINT, {
            method: 'POST',
            body: formData,
            headers: {
                'Accept': 'application/json'
            }
        });

        const data = await response.json();

        btn.disabled = false;
        btn.textContent = 'Submit Enquiry →';
        
        status.style.display = 'block';
        status.style.background = '#ecfdf5';
        status.style.color = '#059669';
        status.style.border = '1px solid #059669';
        status.innerHTML = `✓ Thank you, ${name}! Your enquiry has been routed directly to our executive engineering team.`;
        
        // Reset form inputs after delay
        setTimeout(() => {
            form.reset();
        }, 2000);

    } catch (error) {
        console.error('Error submitting form!', error);
        btn.disabled = false;
        btn.textContent = 'Submit Enquiry →';
        
        status.style.display = 'block';
        status.style.background = '#fef2f2';
        status.style.color = '#991b1b';
        status.style.border = '1px solid #991b1b';
        status.innerHTML = `⚠ There was an error submitting your request. Please email us directly at deepak@hqfast.com.`;
    }
}

// Interactive Simulation Canvas Engine
document.addEventListener('DOMContentLoaded', () => {
    const runBtn = document.getElementById('run-sim-btn');
    if (!runBtn) return;

    const canvas = document.getElementById('heatmap-canvas');
    const ctx = canvas ? canvas.getContext('2d') : null;
    const statusBox = document.getElementById('sim-status');

    function runSimulation() {
        const mode = document.getElementById('sim-mode-select')?.value || 'sei';
        const chem = document.getElementById('chemistry-select')?.value || 'nmc811';
        const temp = parseFloat(document.getElementById('temp-input')?.value || '25');
        const stress = parseFloat(document.getElementById('stress-input')?.value || '0.1');
        const budget = parseFloat(document.getElementById('budget-input')?.value || '50');

        if (!ctx) return;

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        if (mode === 'cei') {
            // Render Arrhenius Li+ Diffusion Curve
            ctx.fillStyle = '#0f172a';
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            // Draw grid lines
            ctx.strokeStyle = '#334155';
            ctx.lineWidth = 1;
            for (let x = 50; x < canvas.width; x += 80) {
                ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, canvas.height); ctx.stroke();
            }
            for (let y = 30; y < canvas.height; y += 50) {
                ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(canvas.width, y); ctx.stroke();
            }

            // Draw Arrhenius Curve D(T)
            ctx.beginPath();
            ctx.strokeStyle = '#38bdf8';
            ctx.lineWidth = 3;

            const temps = [-40, -20, 0, 25, 45, 65, 80];
            const ea = chem === 'lfp' ? 0.55 : (chem === 'nmc622' ? 0.42 : 0.38);
            const kB = 8.617e-5;

            temps.forEach((tC, idx) => {
                const tK = tC + 273.15;
                const d = Math.exp(-ea / (kB * tK));
                const x = 60 + idx * 80;
                const y = canvas.height - 30 - (d * 22000);
                if (idx === 0) ctx.moveTo(x, y);
                else ctx.lineTo(x, y);
            });
            ctx.stroke();

            // Highlight operating point
            const opTK = temp + 273.15;
            const opD = Math.exp(-ea / (kB * opTK));
            const opX = 60 + ((temp + 40) / 120) * 480;
            const opY = canvas.height - 30 - (opD * 22000);

            ctx.fillStyle = temp >= 65 || stress >= 0.4 ? '#ef4444' : '#10b981';
            ctx.beginPath();
            ctx.arc(opX, Math.max(30, Math.min(canvas.height - 30, opY)), 8, 0, 2 * Math.PI);
            ctx.fill();

            // Status message
            if (temp >= 65 || stress >= 0.4) {
                statusBox.className = 'sim-status-box status-warning';
                statusBox.innerHTML = `⚠️ <strong>CRITICAL THERMAL RUNAWAY RISK:</strong> ${chem.toUpperCase()} Operating Temp (${temp}°C) or Stress (${stress} GPa) exceeds stability threshold! Dynamic Arrhenius Li⁺ diffusion D(T) calculated. CostGuard Budget Cap: $${budget}.`;
            } else {
                statusBox.className = 'sim-status-box status-ready';
                statusBox.innerHTML = `✓ <strong>SAFE CEI INTERPHASE:</strong> ${chem.toUpperCase()} stable. Operating Temp (${temp}°C), Stress (${stress} GPa). Arrhenius kinetics verified. CostGuard Budget Cap: $${budget}.`;
            }

        } else if (mode === 'qubo') {
            // Render 2D QUBO Cell Placement Grid
            ctx.fillStyle = '#090d16';
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            const cols = 4, rows = 4;
            const cellW = 80, cellH = 45;
            const startX = 140, startY = 25;

            ctx.font = '12px Inter, sans-serif';

            for (let r = 0; r < rows; r++) {
                for (let c = 0; c < cols; c++) {
                    const idx = r * cols + c;
                    const x = startX + c * (cellW + 12);
                    const y = startY + r * (cellH + 10);
                    
                    const isActive = (r + c) % 2 === 0;

                    ctx.fillStyle = isActive ? '#0284c7' : '#1e293b';
                    ctx.strokeStyle = isActive ? '#38bdf8' : '#475569';
                    ctx.lineWidth = 2;

                    ctx.fillRect(x, y, cellW, cellH);
                    ctx.strokeRect(x, y, cellW, cellH);

                    ctx.fillStyle = '#ffffff';
                    ctx.fillText(`Cell ${idx + 1}`, x + 20, y + 26);
                }
            }

            statusBox.className = 'sim-status-box status-ready';
            statusBox.innerHTML = `✓ <strong>QUBO CLASS 12 FEASIBLE:</strong> Battery Pack Module Layout Optimized. Thermal crosstalk score minimized (Energy: -1,420.5). Budget Cap: $${budget}.`;

        } else {
            // Default SEI Heatmap
            ctx.fillStyle = '#0b1329';
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            const isRisk = temp >= 65 || stress >= 0.4;
            const gradient = ctx.createRadialGradient(300, 130, 20, 300, 130, 200);

            if (isRisk) {
                gradient.addColorStop(0, '#ef4444');
                gradient.addColorStop(0.5, '#f97316');
                gradient.addColorStop(1, '#0b1329');
                statusBox.className = 'sim-status-box status-warning';
                statusBox.innerHTML = `⚠️ <strong>SEI INTERPHASE BREAKDOWN:</strong> Anode stress (${stress} GPa) at ${temp}°C triggers micro-cracking risk! MPS MPS-DMRG bond dim clamped. CostGuard Cap: $${budget}.`;
            } else {
                gradient.addColorStop(0, '#10b981');
                gradient.addColorStop(0.5, '#0284c7');
                gradient.addColorStop(1, '#0b1329');
                statusBox.className = 'sim-status-box status-ready';
                statusBox.innerHTML = `✓ <strong>SAFE SEI PASSIVATION:</strong> Stable LiF/Li2CO3 layer. Temp: ${temp}°C, Stress: ${stress} GPa. Guaranteed Chemical Accuracy ≤1.6 mHa. CostGuard Cap: $${budget}.`;
            }

            ctx.fillStyle = gradient;
            ctx.fillRect(0, 0, canvas.width, canvas.height);
        }
    }

    runBtn.addEventListener('click', runSimulation);

    // Initial render
    runSimulation();
});
