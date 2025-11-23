// API Configuration
const API_BASE_URL = 'http://localhost:3000';

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
        forgotPasswordForm.addEventListener('submit', async function(e) {
            e.preventDefault();

            // Get form data
            const email = document.getElementById('recovery-email').value.trim();

            if (!email) {
                alert('Please enter your email address.');
                return;
            }

            try {
                // Send forgot password request to API
                const response = await fetch(`${API_BASE_URL}/auth/forgot-password`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        email
                    })
                });

                const data = await response.json();

                if (!response.ok) {
                    throw new Error(data.error || `HTTP error! status: ${response.status}`);
                }

                // Success
                alert(data.message || `Password reset link has been sent to ${email}. Please check your inbox.`);
                switchToTab('login');
            } catch (error) {
                console.error('Forgot password error:', error);
                alert('Failed to send password reset request. Please try again later.');
            }
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

// JWT Token Management
const AuthToken = {
    set(token) {
        localStorage.setItem('authToken', token);
    },

    get() {
        return localStorage.getItem('authToken');
    },

    remove() {
        localStorage.removeItem('authToken');
    },

    isValid() {
        const token = this.get();
        if (!token) return false;

        try {
            const payload = JSON.parse(atob(token.split('.')[1]));
            const currentTime = Date.now() / 1000;
            return payload.exp > currentTime;
        } catch (error) {
            return false;
        }
    },

    getUserFromToken() {
        const token = this.get();
        if (!token) return null;

        try {
            const payload = JSON.parse(atob(token.split('.')[1]));
            return {
                userId: payload.sub,
                email: payload.email,
                firstName: payload.firstName,
                lastName: payload.lastName
            };
        } catch (error) {
            return null;
        }
    }
};

// Generic API Call Function
async function apiCall(endpoint, options = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    const config = {
        headers: {
            'Content-Type': 'application/json',
            ...options.headers
        },
        ...options
    };

    // Add authorization header if token exists
    const token = AuthToken.get();
    if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
    }

    try {
        const response = await fetch(url, config);
        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || `HTTP error! status: ${response.status}`);
        }

        return data;
    } catch (error) {
        console.error('API call error:', error);
        throw error;
    }
}

// Authentication API Functions
const AuthAPI = {
    async register(userData) {
        try {
            const response = await apiCall('/auth/register', {
                method: 'POST',
                body: JSON.stringify(userData)
            });
            return response;
        } catch (error) {
            throw new Error(`Registration failed: ${error.message}`);
        }
    },

    async login(credentials) {
        try {
            const response = await apiCall('/auth/login', {
                method: 'POST',
                body: JSON.stringify(credentials)
            });

            if (response.token) {
                AuthToken.set(response.token);
            }

            return response;
        } catch (error) {
            throw new Error(`Login failed: ${error.message}`);
        }
    },

    async getUserProfile() {
        try {
            const response = await apiCall('/auth/profile');
            return response.user;
        } catch (error) {
            throw new Error(`Failed to get user profile: ${error.message}`);
        }
    },

    async updateUserProfile(userData) {
        try {
            const response = await apiCall('/auth/profile', {
                method: 'PUT',
                body: JSON.stringify(userData)
            });
            return response;
        } catch (error) {
            throw new Error(`Failed to update user profile: ${error.message}`);
        }
    },

    async updatePassword(passwordData) {
        try {
            const response = await apiCall('/auth/password', {
                method: 'PUT',
                body: JSON.stringify(passwordData)
            });
            return response;
        } catch (error) {
            throw new Error(`Failed to update password: ${error.message}`);
        }
    },

    async deleteAccount() {
        try {
            const response = await apiCall('/auth/account', {
                method: 'DELETE'
            });

            // Clear token after successful deletion
            AuthToken.remove();

            return response;
        } catch (error) {
            throw new Error(`Failed to delete account: ${error.message}`);
        }
    },

    logout() {
        AuthToken.remove();
    },

    isLoggedIn() {
        return AuthToken.isValid();
    },

    getCurrentUser() {
        return AuthToken.getUserFromToken();
    }
};

// Update existing form handlers to use API functions
if (loginModal && openLoginBtn && closeModal) {
    // ... existing modal code ...

    // Update login form handler
    const loginFormElement = document.getElementById('loginForm');
    if (loginFormElement) {
        loginFormElement.addEventListener('submit', async function(e) {
            e.preventDefault();

            const email = document.getElementById('username').value; // Note: using 'username' field for email
            const password = document.getElementById('password').value;

            try {
                const result = await AuthAPI.login({ email, password });
                alert('Login successful!');
                loginModal.classList.remove('active');
                document.body.style.overflow = '';
                // Optionally redirect or update UI
                window.location.reload(); // Reload to update authenticated state
            } catch (error) {
                alert(error.message);
            }
        });
    }

    // Update signup form handler
    const signupFormElement = document.getElementById('signupForm');
    if (signupFormElement) {
        signupFormElement.addEventListener('submit', async function(e) {
            e.preventDefault();

            const firstName = document.getElementById('fullname').value.split(' ')[0] || '';
            const lastName = document.getElementById('fullname').value.split(' ').slice(1).join(' ') || '';
            const email = document.getElementById('email').value;
            const password = document.getElementById('new-password').value;
            const confirmPassword = document.getElementById('confirm-password').value;

            if (password !== confirmPassword) {
                alert('Passwords do not match!');
                return;
            }

            try {
                const result = await AuthAPI.register({ firstName, lastName, email, password });
                alert('Registration successful! You can now log in.');
                switchToTab('login');
            } catch (error) {
                alert(error.message);
            }
        });
    }

    // ... existing forgot password handler ...
}

});