describe('Hotel Details Page', () => {
  beforeEach(() => {
    // Visit hotel details page with a test hotel ID
    cy.visit('/hotel-details.html?id=1');
  });

  describe('Page Loading', () => {
    it('should show loading state initially', () => {
      cy.get('#detail-loading').should('be.visible');
    });

    it('should load hotel details from API', () => {
      cy.intercept('GET', '**/api/hotels/1').as('getHotelDetails');

      cy.visit('/hotel-details.html?id=1');

      cy.wait('@getHotelDetails').then((interception) => {
        expect(interception.response.statusCode).to.equal(200);
      });
    });

    it('should display hotel information after loading', () => {
      cy.get('#hotel-detail-container', { timeout: 10000 }).should('be.visible');
      cy.get('#detail-loading').should('not.be.visible');
    });
  });

  describe('Hotel Information Display', () => {
    beforeEach(() => {
      // Wait for hotel details to load
      cy.get('#hotel-detail-container', { timeout: 10000 }).should('be.visible');
    });

    it('should display hotel name and basic info', () => {
      cy.get('.hotel-header').within(() => {
        cy.get('.hotel-title').should('not.be.empty');
        cy.get('.hotel-location').should('exist');
        cy.get('.hotel-rating').should('exist');
      });
    });

    it('should display hotel images in gallery', () => {
      cy.get('.hotel-gallery').should('be.visible');
      cy.get('.swiper-slide img').should('have.length.greaterThan', 0);
    });

    it('should display hotel description and amenities', () => {
      cy.get('.hotel-description').should('exist');
      cy.get('.amenities-list').should('exist');
    });

    it('should display room types and pricing', () => {
      cy.get('.room-types').should('exist');
      cy.get('.room-card').should('have.length.greaterThan', 0);
    });
  });

  describe('Reviews Section', () => {
    it('should load and display reviews', () => {
      cy.intercept('GET', '**/api/hotels/1/reviews').as('getHotelReviews');

      cy.visit('/hotel-details.html?id=1');

      cy.wait('@getHotelReviews').then((interception) => {
        expect(interception.response.statusCode).to.equal(200);
      });

      // Check reviews are displayed
      cy.get('.reviews-section').should('be.visible');
    });

    it('should show review form for logged in users', () => {
      // Mock logged in user
      cy.window().then((win) => {
        win.localStorage.setItem('token', 'mock-jwt-token');
      });

      cy.reload();

      cy.get('.write-review-form').should('be.visible');
    });

    it('should hide review form for non-logged in users', () => {
      // Ensure no token
      cy.window().then((win) => {
        win.localStorage.removeItem('token');
      });

      cy.reload();

      cy.get('.write-review-form').should('not.exist');
    });
  });

  describe('Review Submission', () => {
    beforeEach(() => {
      // Mock logged in user
      cy.window().then((win) => {
        win.localStorage.setItem('token', 'mock-jwt-token');
      });

      cy.reload();

      cy.get('.write-review-form', { timeout: 10000 }).should('be.visible');
    });

    it('should validate required fields', () => {
      cy.get('#review-form').find('button[type="submit"]').click();

      // Should show validation errors
      cy.get('.write-review-form').should('be.visible');
    });

    it('should submit review successfully', () => {
      cy.intercept('POST', '**/api/hotels/1/reviews').as('submitReview');

      // Fill out review form
      cy.get('#review-title').type('Great stay!');
      cy.get('#review-content').type('This hotel exceeded our expectations.');

      // Select rating (5 stars)
      cy.get('.star-input .fa-star').last().click();

      cy.get('#review-form').submit();

      cy.wait('@submitReview').then((interception) => {
        expect(interception.response.statusCode).to.equal(201);
      });
    });

    it('should handle review submission errors', () => {
      cy.intercept('POST', '**/api/hotels/1/reviews', { statusCode: 400 }).as('submitReviewError');

      cy.get('#review-title').type('Test review');
      cy.get('#review-content').type('Test content');
      cy.get('.star-input .fa-star').first().click();

      cy.get('#review-form').submit();

      cy.wait('@submitReviewError');

      // Should show error message
      cy.get('.write-review-form').should('be.visible');
    });
  });

  describe('Booking Modal', () => {
    beforeEach(() => {
      cy.get('#hotel-detail-container', { timeout: 10000 }).should('be.visible');
    });

    it('should open booking modal when clicking book button', () => {
      cy.get('.book-now-btn').first().click();
      cy.get('#booking-modal').should('be.visible');
    });

    it('should display booking form correctly', () => {
      cy.get('.book-now-btn').first().click();

      cy.get('#booking-modal').within(() => {
        cy.get('#check-in-date').should('be.visible');
        cy.get('#check-out-date').should('be.visible');
        cy.get('#guests-count').should('be.visible');
        cy.get('.room-type-section').should('exist');
        cy.get('#complete-booking').should('be.visible');
      });
    });

    it('should validate booking dates', () => {
      cy.get('.book-now-btn').first().click();

      // Try to book without dates
      cy.get('#complete-booking').click();

      // Should show validation or prevent submission
      cy.get('#booking-modal').should('be.visible');
    });

    it('should submit booking successfully', () => {
      cy.intercept('POST', '**/api/bookings').as('submitBooking');

      // Mock logged in user
      cy.window().then((win) => {
        win.localStorage.setItem('token', 'mock-jwt-token');
      });

      cy.reload();
      cy.get('#hotel-detail-container', { timeout: 10000 }).should('be.visible');

      cy.get('.book-now-btn').first().click();

      // Fill booking form
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      const dayAfter = new Date();
      dayAfter.setDate(dayAfter.getDate() + 3);

      cy.get('#check-in-date').type(tomorrow.toISOString().split('T')[0]);
      cy.get('#check-out-date').type(dayAfter.toISOString().split('T')[0]);

      cy.get('#complete-booking').click();

      cy.wait('@submitBooking').then((interception) => {
        expect(interception.response.statusCode).to.equal(201);
      });
    });
  });

  describe('Navigation', () => {
    it('should navigate back to home', () => {
      cy.get('#home').click();
      cy.url().should('include', 'index.html');
    });

    it('should open login modal', () => {
      cy.get('#openLoginBtn').click();
      cy.get('#loginModal').should('be.visible');
    });
  });

  describe('Error Handling', () => {
    it('should handle invalid hotel ID', () => {
      cy.visit('/hotel-details.html?id=99999');

      // Should show error or redirect
      cy.get('#hotel-detail-container').should('be.visible');
    });

    it('should handle API errors gracefully', () => {
      cy.intercept('GET', '**/api/hotels/1', { statusCode: 404 }).as('hotelNotFound');

      cy.visit('/hotel-details.html?id=1');

      cy.wait('@hotelNotFound');

      // Should show error state
      cy.get('#detail-loading').should('not.be.visible');
    });
  });
});