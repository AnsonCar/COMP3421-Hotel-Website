// Custom commands for Cypress tests

// Login command
Cypress.Commands.add('login', (username, password) => {
  cy.session([username, password], () => {
    cy.visit('/');
    cy.get('#openLoginBtn').click();
    cy.get('#username').type(username);
    cy.get('#password').type(password);
    cy.get('#loginForm').submit();

    // Wait for login to complete
    cy.get('#loginModal').should('not.be.visible');

    // Store token in localStorage for subsequent requests
    cy.window().then((win) => {
      const token = win.localStorage.getItem('token');
      expect(token).to.not.be.null;
    });
  });
});

// Logout command
Cypress.Commands.add('logout', () => {
  // Clear localStorage
  cy.window().then((win) => {
    win.localStorage.removeItem('token');
    win.localStorage.removeItem('user');
  });
});

// Create test user command
Cypress.Commands.add('createTestUser', (userData) => {
  cy.request('POST', '/auth/register', userData).then((response) => {
    expect(response.status).to.equal(201);
  });
});

// Delete test user command
Cypress.Commands.add('deleteTestUser', (userId) => {
  cy.request('DELETE', `/auth/users/${userId}`).then((response) => {
    expect(response.status).to.equal(200);
  });
});

// Intercept API calls
Cypress.Commands.add('interceptAPIs', () => {
  // Auth APIs
  cy.intercept('POST', '**/auth/login').as('login');
  cy.intercept('POST', '**/auth/register').as('register');
  cy.intercept('POST', '**/auth/forgot-password').as('forgotPassword');
  cy.intercept('PUT', '**/auth/profile').as('updateProfile');
  cy.intercept('PUT', '**/auth/password').as('changePassword');
  cy.intercept('DELETE', '**/auth/account').as('deleteAccount');

  // Hotel APIs
  cy.intercept('GET', '**/api/hotels*').as('getHotels');
  cy.intercept('GET', '**/api/hotels/featured').as('getFeaturedHotels');
  cy.intercept('GET', '**/api/hotels/*').as('getHotelDetails');
  cy.intercept('GET', '**/api/hotels/*/reviews').as('getHotelReviews');

  // Booking APIs
  cy.intercept('POST', '**/api/bookings').as('createBooking');

  // Review APIs
  cy.intercept('POST', '**/api/hotels/*/reviews').as('submitReview');

  // Contact APIs
  cy.intercept('POST', '**/api/contact').as('submitContact');
});

// Wait for page to be fully loaded
Cypress.Commands.add('waitForPageLoad', () => {
  cy.get('body').should('be.visible');
});

// Check if user is logged in
Cypress.Commands.add('shouldBeLoggedIn', () => {
  cy.window().then((win) => {
    expect(win.localStorage.getItem('token')).to.not.be.null;
  });
});

// Check if user is logged out
Cypress.Commands.add('shouldBeLoggedOut', () => {
  cy.window().then((win) => {
    expect(win.localStorage.getItem('token')).to.be.null;
  });
});

// Fill booking form
Cypress.Commands.add('fillBookingForm', (bookingData) => {
  cy.get('#check-in-date').type(bookingData.checkIn);
  cy.get('#check-out-date').type(bookingData.checkOut);
  cy.get('#guests-count').select(bookingData.guests.toString());
});

// Fill review form
Cypress.Commands.add('fillReviewForm', (reviewData) => {
  cy.get('#review-title').type(reviewData.title);
  cy.get('#review-content').type(reviewData.content);

  // Select rating stars
  cy.get('.star-input .fa-star').each(($star, index) => {
    if (index < reviewData.rating) {
      cy.wrap($star).click();
    }
  });
});

// Fill contact form
Cypress.Commands.add('fillContactForm', (contactData) => {
  cy.get('#name').type(contactData.name);
  cy.get('#email').type(contactData.email);
  if (contactData.phone) {
    cy.get('#phone').type(contactData.phone);
  }
  cy.get('#subject').select(contactData.subject);
  cy.get('#message').type(contactData.message);
});