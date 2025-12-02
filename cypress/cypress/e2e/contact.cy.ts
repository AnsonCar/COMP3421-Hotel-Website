describe('Contact Form', () => {
  beforeEach(() => {
    cy.visit('/contact.html');
  });

  describe('Contact Page Layout', () => {
    it('should display contact page correctly', () => {
      cy.get('.contact-page').should('be.visible');
      cy.get('.contact-header').should('be.visible');
      cy.get('.contact-container').should('be.visible');
    });

    it('should display contact information', () => {
      cy.get('.contact-info-section').should('be.visible');
      cy.get('.contact-details').should('be.visible');
      cy.get('.business-hours').should('be.visible');
      cy.get('.map-container').should('be.visible');
    });

    it('should display contact form', () => {
      cy.get('.contact-form-section').should('be.visible');
      cy.get('#contact-form').should('be.visible');
    });
  });

  describe('Contact Form Validation', () => {
    it('should validate required fields', () => {
      // Try to submit empty form
      cy.get('#contact-form').find('button[type="submit"]').click();
      cy.wait(1000);
  
      // Browser should prevent submission due to required fields
      // Form should still be visible
      cy.get('#contact-form').should('be.visible');
    });

    it('should validate email format', () => {
      cy.get('#name').type('Test User');
      cy.wait(1000);
      cy.get('#email').type('invalid-email');
      cy.wait(1000);
      cy.get('#subject').select('Reservation');
      cy.wait(1000);
      cy.get('#message').type('Test message');
      cy.wait(1000);
  
      cy.get('#contact-form button[type="submit"]').click();
      cy.wait(1000);
  
      // Browser email validation should prevent submission
      // Form should still be visible
      cy.get('#contact-form').should('be.visible');
    });

    it('should accept valid form data', () => {
      cy.get('#name').type('Test User');
      cy.wait(1000);
      cy.get('#email').type('test@example.com');
      cy.wait(1000);
      cy.get('#phone').type('+1234567890');
      cy.wait(1000);
      cy.get('#subject').select('Reservation');
      cy.wait(1000);
      cy.get('#message').type('This is a test message for reservation inquiry.');
      cy.wait(1000);
  
      // Form should accept the data
      cy.get('#name').should('have.value', 'Test User');
      cy.get('#email').should('have.value', 'test@example.com');
    });
  });

  describe('Contact Form Submission', () => {
    it('should submit contact form successfully', () => {
      cy.intercept('POST', 'http://localhost:3000/api/contact', {
        statusCode: 201,
        body: { message: 'Contact message submitted successfully' }
      }).as('submitContact');
  
      cy.get('#name').type('Test User');
      cy.wait(1000);
      cy.get('#email').type('test@example.com');
      cy.wait(1000);
      cy.get('#phone').type('+1234567890');
      cy.wait(1000);
      cy.get('#subject').select('Reservation');
      cy.wait(1000);
      cy.get('#message').type('This is a test message for reservation inquiry.');
      cy.wait(1000);
  
      cy.get('#contact-form').submit();
      cy.wait(1000);
  
      cy.wait('@submitContact');
    });

    it('should show success message after submission', () => {
       cy.intercept('POST', 'http://localhost:3000/api/contact', {
         statusCode: 201,
         body: { message: 'Contact message submitted successfully' }
       }).as('submitContact');
  
       cy.get('#name').type('Test User');
       cy.wait(1000);
       cy.get('#email').type('test@example.com');
       cy.wait(1000);
       cy.get('#subject').select('Feedback');
       cy.wait(1000);
       cy.get('#message').type('Great service!');
       cy.wait(1000);
  
       cy.get('#contact-form button[type="submit"]').click();
       cy.wait(1000);
  
       cy.wait('@submitContact');
  
       // Wait for JavaScript to process the response
       cy.wait(500);
  
       // Check if success message becomes visible (JavaScript should add 'active' class)
       cy.get('#success-message').should('have.class', 'active');
       cy.get('#success-message').should('be.visible');
       cy.get('#success-message').should('contain', 'Message Sent Successfully');
     });

    it('should handle submission errors', () => {
      cy.intercept('POST', 'http://localhost:3000/api/contact', { statusCode: 400 }).as('submitContactError');
  
      cy.get('#name').type('Test User');
      cy.wait(1000);
      cy.get('#email').type('test@example.com');
      cy.wait(1000);
      cy.get('#subject').select('Complaint');
      cy.wait(1000);
      cy.get('#message').type('Test complaint message');
      cy.wait(1000);
  
      cy.get('#contact-form button[type="submit"]').click();
      cy.wait(1000);
  
      cy.wait('@submitContactError');
  
      // Wait for potential DOM update
      cy.wait(100);
  
      // Should show error state - success message should not be visible
      cy.get('#success-message').should('not.be.visible');
      // Form should still be visible
      cy.get('#contact-form').should('be.visible');
    });

    it('should reset form after successful submission', () => {
      cy.intercept('POST', 'http://localhost:3000/api/contact', {
        statusCode: 201,
        body: { message: 'Contact message submitted successfully' }
      }).as('submitContact');
  
      cy.get('#name').type('Test User');
      cy.wait(1000);
      cy.get('#email').type('test@example.com');
      cy.wait(1000);
      cy.get('#phone').type('+1234567890');
      cy.wait(1000);
      cy.get('#subject').select('Other');
      cy.wait(1000);
      cy.get('#message').type('Test message');
      cy.wait(1000);
  
      cy.get('#contact-form button[type="submit"]').click();
      cy.wait(1000);
  
      cy.wait('@submitContact');
  
      // Wait for JavaScript to process and reset form
      cy.wait(500);
  
      // Form should be reset (JavaScript calls form.reset())
      cy.get('#name').should('have.value', '');
      cy.get('#email').should('have.value', '');
      cy.get('#phone').should('have.value', '');
      cy.get('#message').should('have.value', '');
    });
  });

  describe('Contact Information Display', () => {
    it('should display main office information', () => {
      cy.get('.contact-details').within(() => {
        cy.contains('Main Office').should('be.visible');
        cy.contains('350 Fifth Avenue').should('be.visible');
        cy.contains('New York, NY 10118').should('be.visible');
      });
    });

    it('should display phone numbers', () => {
      cy.get('.contact-details').within(() => {
        cy.contains('Reservations: +1 (212) 555-1234').should('be.visible');
        cy.contains('Customer Service: +1 (212) 555-5678').should('be.visible');
      });
    });

    it('should display email addresses', () => {
      cy.get('.contact-details').within(() => {
        cy.contains('reservations@nyhotels.com').should('be.visible');
        cy.contains('support@nyhotels.com').should('be.visible');
      });
    });

    it('should display business hours', () => {
      cy.get('.business-hours').within(() => {
        cy.contains('Monday - Friday').should('be.visible');
        cy.contains('9:00 AM - 9:00 PM').should('be.visible');
        cy.contains('Saturday').should('be.visible');
        cy.contains('10:00 AM - 6:00 PM').should('be.visible');
        cy.contains('Sunday').should('be.visible');
        cy.contains('12:00 PM - 5:00 PM').should('be.visible');
      });
    });
  });

  describe('Social Links and Map', () => {
    it('should display social media links', () => {
      cy.get('.social-links').should('be.visible');
      cy.get('.social-links a').should('have.length', 4); // Facebook, Twitter, Instagram, LinkedIn
    });

    it('should display Google Maps embed', () => {
      cy.get('.map-container iframe').should('be.visible');
      cy.get('.map-container iframe').should('have.attr', 'src').and('include', 'google.com/maps');
    });
  });

  describe('Navigation', () => {
    it('should navigate back to home', () => {
      cy.get('a#home').click();
      cy.wait(1000);
      cy.url().should('include', 'index.html');
    });

    it('should open login modal', () => {
      cy.get('a#openLoginBtn').click();
      cy.wait(1000);
      cy.get('#loginModal').should('be.visible');
    });
  });

  describe('Responsive Design', () => {
    it('should be responsive on mobile', () => {
      cy.viewport('iphone-6');
      cy.get('.contact-container').should('be.visible');
      cy.get('.contact-form').should('be.visible');
      cy.get('.contact-info-section').should('be.visible');
    });

    it('should be responsive on tablet', () => {
      cy.viewport('ipad-2');
      cy.get('.contact-container').should('be.visible');
      cy.get('.contact-form').should('be.visible');
      cy.get('.contact-info-section').should('be.visible');
    });
  });
});