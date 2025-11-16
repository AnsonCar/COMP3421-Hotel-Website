// Contact form handling
document.addEventListener('DOMContentLoaded', function() {
    const contactForm = document.getElementById('contact-form');
    const successMessage = document.getElementById('success-message');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form values
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const phone = document.getElementById('phone').value;
            const subject = document.getElementById('subject').value;
            const message = document.getElementById('message').value;
            
            // Normally you would send this data to your server
            console.log(`Contact form submission: ${name}, ${email}, ${subject}`);
            
            // Simulate form submission success
            contactForm.style.display = 'none';
            successMessage.classList.add('active');
            
            // Reset form after a delay
            setTimeout(() => {
                contactForm.reset();
                successMessage.classList.remove('active');
                contactForm.style.display = 'block';
            }, 5000);
        });
    }
});
