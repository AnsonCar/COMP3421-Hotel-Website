document.addEventListener('DOMContentLoaded', function() {
// Auth Modal Functionality
const loginModal = document.getElementById('loginModal');
const openLoginBtn = document.getElementById('openLoginBtn');
const closeModal = document.getElementById('closeModal');

if (loginModal && openLoginBtn && closeModal) {
    // Form Elements
    const loginForm = document.getElementById('login-form');
    const signupForm = document.getElementById('signup-form');
    const forgotForm = document.getElementById('forgot-form');
    
    // Tab Elements
    const tabs = document.querySelectorAll('.auth-tab');
    const forms = document.querySelectorAll('.auth-form');
    
    // Open modal
    openLoginBtn.addEventListener('click', function(e) {
        e.preventDefault();
        loginModal.classList.add('active');
        document.body.style.overflow = 'hidden'; // Prevent scrolling when modal is open
        
        // Default to showing login form
        switchToTab('login');
    });
    
    // Close modal
    closeModal.addEventListener('click', function() {
        loginModal.classList.remove('active');
        document.body.style.overflow = ''; // Restore scrolling
    });
    
    // Close modal when clicking outside
    loginModal.addEventListener('click', function(e) {
        if (e.target === loginModal) {
            loginModal.classList.remove('active');
            document.body.style.overflow = '';
        }
    });
    
    // Tab switching functionality
    tabs.forEach(tab => {
        tab.addEventListener('click', function() {
            const tabName = this.getAttribute('data-tab');
            switchToTab(tabName);
        });
    });
    
    function switchToTab(tabName) {
        // Deactivate all tabs and forms
        tabs.forEach(tab => tab.classList.remove('active'));
        forms.forEach(form => form.classList.remove('active'));
        
        // Activate selected tab and form
        document.querySelector(`.auth-tab[data-tab="${tabName}"]`).classList.add('active');
        document.getElementById(`${tabName}-form`).classList.add('active');
    }
    
    // Form switch links
    const showSignupForm = document.getElementById('showSignupForm');
    if (showSignupForm) {
        showSignupForm.addEventListener('click', function(e) {
            e.preventDefault();
            switchToTab('signup');
        });
    }
    
    const showLoginForm = document.getElementById('showLoginForm');
    if (showLoginForm) {
        showLoginForm.addEventListener('click', function(e) {
            e.preventDefault();
            switchToTab('login');
        });
    }
    
    const forgotPasswordLink = document.getElementById('forgotPasswordLink');
    if (forgotPasswordLink) {
        forgotPasswordLink.addEventListener('click', function(e) {
            e.preventDefault();
            switchToTab('forgot');
        });
    }
    
    const backToLoginForm = document.getElementById('backToLoginForm');
    if (backToLoginForm) {
        backToLoginForm.addEventListener('click', function(e) {
            e.preventDefault();
            switchToTab('login');
        });
    }
    
    // Handle form submissions
    const loginFormElement = document.getElementById('loginForm');
    if (loginFormElement) {
        loginFormElement.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;
            
            // Here you would typically send the data to a server for authentication
            console.log(`Login attempt: ${username}`);
            
            // Simulate successful login
            alert('Login successful!');
            loginModal.classList.remove('active');
            document.body.style.overflow = '';
        });
    }
    
    const signupFormElement = document.getElementById('signupForm');
    if (signupFormElement) {
        signupFormElement.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const fullname = document.getElementById('fullname').value;
            const email = document.getElementById('email').value;
            const username = document.getElementById('new-username').value;
            const password = document.getElementById('new-password').value;
            const confirmPassword = document.getElementById('confirm-password').value;
            
            // Basic validation
            if (password !== confirmPassword) {
                alert('Passwords do not match!');
                return;
            }
            
            // Here you would typically send the data to a server for registration
            console.log(`Registration attempt: ${username}, ${email}`);
            
            // Simulate successful registration
            alert('Registration successful! You can now log in.');
            switchToTab('login');
        });
    }
    
    const forgotPasswordForm = document.getElementById('forgotPasswordForm');
    if (forgotPasswordForm) {
        forgotPasswordForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const email = document.getElementById('recovery-email').value;
            
            // Here you would typically send the data to a server to handle password reset
            console.log(`Password reset requested for: ${email}`);
            
            // Simulate successful request
            alert(`Password reset link has been sent to ${email}. Please check your inbox.`);
            switchToTab('login');
        });
    }
}

    // Add animation to About Us section when it comes into view
    const aboutSection = document.querySelector('.about-us-section');
    const aboutElements = [
        document.querySelector('.about-us-header'),
        document.querySelector('.about-us-text'),
        document.querySelector('.about-us-image'),
        document.querySelector('.contact-btn-container')
    ];
    
    // Set initial state for About Us animation
    if (aboutSection && aboutElements.every(el => el)) {
        aboutElements.forEach(element => {
            element.style.opacity = '0';
            element.style.transform = 'translateY(30px)';
            element.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
        });
        
        // Animation on scroll
        function checkVisibility() {
            const sectionTop = aboutSection.getBoundingClientRect().top;
            const windowHeight = window.innerHeight;
            
            if (sectionTop < windowHeight * 0.75) {
                aboutElements.forEach((element, index) => {
                    setTimeout(() => {
                        element.style.opacity = '1';
                        element.style.transform = 'translateY(0)';
                    }, index * 200);
                });
                
                window.removeEventListener('scroll', checkVisibility);
            }
        }
        
        window.addEventListener('scroll', checkVisibility);
        // Check initial state in case section is already visible
        checkVisibility();
    }

// Search functionality
const searchInput = document.getElementById('search-input');
const searchBtn = document.getElementById('search-btn');
if (searchInput && searchBtn) {
    // Handle search button click
    searchBtn.addEventListener('click', function() {
        performSearch();
    });
    // Handle Enter key in search input
    searchInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            performSearch();
        }
    });
    function performSearch() {
        const query = searchInput.value.trim();
        if (query) {
            // Store search query in sessionStorage to use on results page
            sessionStorage.setItem('searchQuery', query);
            // Redirect to search results page
            window.location.href = 'search.html';
        }
    }
}
});