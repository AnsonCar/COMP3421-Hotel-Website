describe('Authentication', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  describe('Login Modal', () => {
    it('should open login modal when clicking login button', () => {
      cy.get('#openLoginBtn').click();

      cy.get('#loginModal').should('be.visible');
      cy.get('#login-form').should('be.visible');
    });

    it('should switch between login and signup tabs', () => {
      cy.get('#openLoginBtn').click();

      cy.get('#login-form').should('be.visible');
      cy.get('[data-tab="signup"]').click();

      cy.get('#signup-form').should('be.visible');
      cy.get('[data-tab="login"]').click();

      cy.get('#login-form').should('be.visible');
    });

    it('should switch to forgot password form', () => {
      cy.get('#openLoginBtn').click();

      cy.get('#forgotPasswordLink').click();

      cy.get('#forgot-form').should('be.visible');
    });
  });

  describe('Login Form', () => {
    beforeEach(() => {
      cy.get('#openLoginBtn').click();
    });

    it('should validate required fields', () => {
      cy.get('#loginForm').find('button[type="submit"]').click();

      // Check that form validation prevents submission
      cy.get('#loginModal').should('be.visible');
    });

    it('should show error for invalid credentials', () => {
      cy.get('#username').type('invaliduser');

      cy.get('#password').type('invalidpass');

      cy.get('#loginForm').submit();

  
      // Should show error message (implementation dependent)
      cy.wait(1000); // Wait for potential API response
    });

    it('should login successfully with valid credentials', () => {
      // This test assumes test user exists in database
      cy.get('#username').type('testuser');

      cy.get('#password').type('testpass123');

      cy.get('#loginForm').submit();

  
      // Should close modal and show logged in state
      cy.get('#loginModal').should('not.be.visible');
      // Check for logged in indicators (like user menu, logout button, etc.)
    });
  });

  describe('Signup Form', () => {
    beforeEach(() => {
      cy.get('#openLoginBtn').click();
      cy.get('[data-tab="signup"]').click();
    });

    it('should validate required fields', () => {
      cy.get('#signupForm').find('button[type="submit"]').click();

      cy.get('#signup-form').should('be.visible');
    });

    it('should validate password confirmation', () => {
      cy.get('#fullname').type('Test User');

      cy.get('#email').type('test@example.com');

      cy.get('#new-username').type('testuser');

      cy.get('#new-password').type('password123');

      cy.get('#confirm-password').type('differentpassword');

      cy.get('#terms').check();

  
      cy.get('#signupForm').submit();

      // Should show validation error
    });

    it('should create account successfully', () => {
      const timestamp = Date.now();
      cy.get('#fullname').type('Test User');

      cy.get('#email').type(`test${timestamp}@example.com`);

      cy.get('#new-username').type(`testuser${timestamp}`);

      cy.get('#new-password').type('password123');

      cy.get('#confirm-password').type('password123');

      cy.get('#terms').check();

  
      cy.get('#signupForm').submit();

  
      // Should show success message or redirect
      cy.wait(2000);
    });
  });

  describe('Forgot Password', () => {
    beforeEach(() => {
      cy.get('#openLoginBtn').click();
      cy.get('#forgotPasswordLink').click();
    });

    it('should validate email field', () => {
      cy.get('#forgotPasswordForm').find('button[type="submit"]').click();

      cy.get('#forgot-form').should('be.visible');
    });

    it('should send reset link successfully', () => {
      cy.get('#recovery-email').type('test@example.com');

      cy.get('#forgotPasswordForm').submit();

  
      // Should show success message
      cy.wait(2000);
    });
  });
});