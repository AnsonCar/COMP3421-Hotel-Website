describe('Homepage', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  describe('Featured Hotels', () => {
    it('should load featured hotels on page load', () => {
      // Check that featured hotels section exists
      cy.get('.exclusive-content').should('be.visible');

      // Check that hotels are loaded (API call should populate this)
      cy.get('.exclusive-content-container .hotel').should('have.length.greaterThan', 0);
    });

    it('should display hotel information correctly', () => {
      cy.get('.exclusive-content-container .hotel').first().within(() => {
        // Check hotel has image
        cy.get('img').should('be.visible');

        // Check hotel has name
        cy.get('h3').should('not.be.empty');

        // Check hotel is clickable
        cy.get('a').should('have.attr', 'href');
      });
    });

    it('should navigate to hotel details when clicking hotel', () => {
      cy.get('.exclusive-content-container .hotel a').first().click();

  
      // Should navigate to hotel details page
      cy.url().should('include', 'hotel-details.html');
    });

    it('should handle carousel navigation', () => {
      // Check navigation arrows exist
      cy.get('.nav-arrow').should('be.visible');
  
      // Test next button
      cy.get('.nav-arrow.next').click();

  
      // Test prev button
      cy.get('.nav-arrow.prev').click();

    });
  });

  describe('Navigation', () => {
    it('should display navigation bar correctly', () => {
      cy.get('.nav-bar').should('be.visible');
      cy.get('.nav-left img').should('be.visible');
      cy.get('.nav-middle .search-container').should('be.visible');
      cy.get('.nav-right').should('be.visible');
    });

    it('should navigate to home when clicking logo', () => {
      cy.get('#home').click();

      cy.url().should('include', 'index.html');
    });

    it('should open login modal when clicking login button', () => {
      cy.get('#openLoginBtn').click();

      cy.get('#loginModal').should('be.visible');
    });
  });

  describe('Search Functionality', () => {
    it('should have search input and button', () => {
      cy.get('#search-input').should('be.visible');
      cy.get('#search-btn').should('be.visible');
    });

    // it('should navigate to search page when clicking search', () => {
    //   cy.get('#search-btn').click();

    //   cy.url().should('include', 'search.html');
    // });

    it('should navigate to search page when pressing enter in search input', () => {
      cy.get('#search-input').type('test{enter}');

      cy.url().should('include', 'search.html');
    });
  });

  describe('About Us Section', () => {
    it('should display about us section', () => {
      cy.get('.about-us-section').should('be.visible');
      cy.get('.about-us-header h2').should('contain', 'Our Timeless Legacy');
    });

    it('should have contact button that navigates to contact page', () => {
      cy.get('.contact-btn').click();

      cy.url().should('include', 'contact.html');
    });
  });

  describe('API Integration', () => {
    it('should make API call to load featured hotels', () => {
      // Intercept API call
      cy.intercept('GET', 'http://localhost:3000/api/hotels/featured').as('getFeaturedHotels');

      cy.reload();


      // Wait for API call and verify it was made
      cy.wait('@getFeaturedHotels').then((interception) => {
        expect(interception.response.statusCode).to.equal(200);
      });
    });

    it('should handle API errors gracefully', () => {
      // Mock API error
      cy.intercept('GET', 'http://localhost:3000/api/hotels/featured', { statusCode: 500 }).as('getFeaturedHotelsError');

      cy.reload();


      // Should still display page even with API error
      cy.get('.exclusive-content').should('be.visible');
    });
  });
});