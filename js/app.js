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

// Form Submission simulation
function submitEnquiry(event) {
    event.preventDefault();
    
    const name = document.getElementById('contact-name').value;
    const email = document.getElementById('contact-email').value;
    const phone = document.getElementById('contact-phone').value;
    const message = document.getElementById('contact-message').value;

    const btn = document.getElementById('submit-enquiry-btn');
    const status = document.getElementById('enquiry-status');

    btn.disabled = true;
    btn.textContent = 'Submitting Enquiry...';

    setTimeout(() => {
        btn.disabled = false;
        btn.textContent = 'Submit Enquiry →';
        
        status.style.display = 'block';
        status.style.background = '#ecfdf5';
        status.style.color = '#059669';
        status.style.border = '1px solid #059669';
        status.innerHTML = `✓ Thank you, ${name}! Your enquiry has been received. Our executive engineering team will contact you at ${email} or ${phone} shortly.`;

        // Save local copy to localStorage for demo persistence
        const existing = JSON.parse(localStorage.getItem('hqfast_enquiries') || '[]');
        existing.push({ name, email, phone, message, timestamp: new Date().toISOString() });
        localStorage.setItem('hqfast_enquiries', JSON.stringify(existing));

        // Reset form inputs after delay
        setTimeout(() => {
            document.getElementById('enquiry-form').reset();
        }, 2000);
    }, 800);
}
