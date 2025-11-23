// API Configuration - ensure this is defined before any API calls
const API_BASE_URL = window.API_BASE_URL || 'http://localhost:3000';

// Contact form handling
document.addEventListener('DOMContentLoaded', function() {
    const contactForm = document.getElementById('contact-form');
    const successMessage = document.getElementById('success-message');

    if (contactForm) {
        contactForm.addEventListener('submit', async function(e) {
            e.preventDefault();

            // Get form values
            const name = document.getElementById('name').value.trim();
            const email = document.getElementById('email').value.trim();
            const phone = document.getElementById('phone').value.trim();
            const subject = document.getElementById('subject').value;
            const message = document.getElementById('message').value.trim();

            // Basic client-side validation
            if (!name || !email || !subject || !message) {
                alert('Please fill in all required fields.');
                return;
            }

            try {
                // Send data to API
                const response = await fetch(`${API_BASE_URL}/api/contact`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        name,
                        email,
                        subject,
                        message
                    })
                });

                const data = await response.json();

                if (!response.ok) {
                    throw new Error(data.error || `HTTP error! status: ${response.status}`);
                }

                // Success - show success message and reset form immediately
                contactForm.style.display = 'none';
                successMessage.classList.add('active');
                contactForm.reset();

                // Hide success message and show form after a delay
                setTimeout(() => {
                    successMessage.classList.remove('active');
                    contactForm.style.display = 'block';
                }, 5000);

            } catch (error) {
                console.error('Contact form submission error:', error);
                alert('Failed to send message. Please try again later.');
            }
        });
    }
});
