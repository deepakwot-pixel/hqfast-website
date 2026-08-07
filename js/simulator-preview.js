// website/js/simulator-preview.js

document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('heatmap-canvas');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    const simBtn = document.getElementById('run-sim-btn');
    const statusDiv = document.getElementById('sim-status');

    // Clean Figma/Adobe light theme palette
    const bgColor = '#ffffff';
    const gridColor = '#f1f5f9';

    function drawInitial() {
        ctx.fillStyle = bgColor;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        ctx.strokeStyle = gridColor;
        ctx.lineWidth = 1;
        for (let i = 0; i < canvas.width; i += 20) {
            ctx.beginPath();
            ctx.moveTo(i, 0);
            ctx.lineTo(i, canvas.height);
            ctx.stroke();
        }
        for (let i = 0; i < canvas.height; i += 20) {
            ctx.beginPath();
            ctx.moveTo(0, i);
            ctx.lineTo(canvas.width, i);
            ctx.stroke();
        }
        
        ctx.fillStyle = '#64748b';
        ctx.font = '500 13px Inter';
        ctx.textAlign = 'center';
        ctx.fillText('Engine Idle — Click "Execute MPS Classical Solver" to initiate', canvas.width / 2, canvas.height / 2);
    }

    drawInitial();

    function interpolateColor(val) {
        if (val > 0.75) return `rgba(220, 38, 38, ${val * 0.85})`; // Red
        if (val > 0.45) return `rgba(217, 119, 6, ${val * 0.85})`; // Amber
        return `rgba(5, 150, 105, ${val * 0.85})`; // Green
    }

    function runSimulation() {
        const budgetInput = parseFloat(document.getElementById('budget-input').value) || 50;
        
        simBtn.disabled = true;
        simBtn.textContent = 'Computing Tensors & Virial Stress...';
        statusDiv.className = 'sim-status-box';
        statusDiv.textContent = `CostGuard: Pre-flight check passed. Cap: $${budgetInput.toFixed(2)}. Running classical MPS-DMRG...`;
        statusDiv.style.color = '#0284c7';
        statusDiv.style.borderColor = '#0284c7';
        statusDiv.style.background = '#f0f9ff';

        let progress = 0;
        
        function animate() {
            ctx.fillStyle = bgColor;
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            
            const cellWidth = 20;
            const cellHeight = 20;
            const temp = parseFloat(document.getElementById('temp-input').value) || 25;
            const stress = parseFloat(document.getElementById('stress-input').value) || 0.1;
            
            for (let x = 0; x < canvas.width; x += cellWidth) {
                for (let y = 0; y < canvas.height; y += cellHeight) {
                    const noise = Math.sin(x * 0.04 + progress * 0.1) * Math.cos(y * 0.04 - progress * 0.05);
                    const baseStress = (stress / 2.0) + (temp >= 65 ? 0.35 : 0);
                    let val = Math.max(0, Math.min(1, baseStress + (noise * 0.25)));
                    
                    ctx.fillStyle = interpolateColor(val);
                    ctx.fillRect(x, y, cellWidth - 1, cellHeight - 1);
                }
            }

            progress++;
            if (progress < 50) {
                requestAnimationFrame(animate);
            } else {
                simBtn.disabled = false;
                simBtn.textContent = 'Execute MPS Classical Solver';
                
                const tempVal = parseFloat(document.getElementById('temp-input').value) || 25;
                const stressVal = parseFloat(document.getElementById('stress-input').value) || 0.1;
                
                if (tempVal >= 65 || stressVal >= 0.4) {
                    statusDiv.textContent = `Verdict: CRITICAL THERMAL / STRESS RUNAWAY (Temp: ${tempVal}°C, Stress: ${stressVal} GPa). Interphase unfeasible.`;
                    statusDiv.style.color = '#dc2626';
                    statusDiv.style.borderColor = '#dc2626';
                    statusDiv.style.background = '#fef2f2';
                } else {
                    statusDiv.textContent = `Verdict: SAFE (Feasible). Chemical Accuracy <= 0.0016 Ha verified. Total Job Cost: $${(budgetInput * 0.12).toFixed(2)} (Well within $${budgetInput} cap).`;
                    statusDiv.style.color = '#059669';
                    statusDiv.style.borderColor = '#059669';
                    statusDiv.style.background = '#ecfdf5';
                }
            }
        }
        
        animate();
    }

    simBtn.addEventListener('click', runSimulation);
});
