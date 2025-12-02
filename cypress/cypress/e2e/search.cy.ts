describe('Search Functionality', () => {
  beforeEach(() => {
    cy.visit('/search.html');
  });

  describe('Search Page Layout', () => {
    it('should display search page correctly', () => {
      cy.get('.nav-bar').should('be.visible');
      cy.get('#search-results').should('be.visible');
      cy.get('#search-input').should('be.visible');
      cy.get('#search-btn').should('be.visible');
    });

    it('should have back to top button', () => {
      cy.get('#back-to-top').should('be.visible');
    });
  });

  describe('Search Input', () => {
    it('should allow typing in search input', () => {
      cy.get('#search-input').type('luxury hotel');
      cy.wait(1000);
      cy.get('#search-input').should('have.value', 'luxury hotel');
    });

    it('should trigger search when clicking search button', () => {
      cy.get('#search-input').type('test search');
      cy.wait(1000);
      cy.get('#search-btn').click();
      cy.wait(1000);
  
      // Should make API call
      cy.wait(1000); // Wait for potential results
    });

    it('should trigger search when pressing enter', () => {
      cy.get('#search-input').type('test search{enter}');
      cy.wait(1000);
  
      // Should make API call
      cy.wait(1000);
    });
  });

  describe('API Integration', () => {
    it('should make API call when searching', () => {
      cy.intercept('GET', 'http://localhost:3000/api/hotels*').as('searchHotels');

      cy.get('#search-input').type('luxury{enter}');
      cy.wait(1000);
  
      cy.wait('@searchHotels').then((interception) => {
        expect(interception.request.url).to.include('/api/hotels');
        expect(interception.response.statusCode).to.equal(200);
      });
    });

    it('should handle search parameters correctly', () => {
      cy.intercept('GET', 'http://localhost:3000/api/hotels*').as('searchHotels');

      cy.get('#search-input').type('5 star hotel{enter}');
      cy.wait(1000);
  
      cy.wait('@searchHotels').then((interception) => {
        const url = new URL(interception.request.url);
        expect(url.searchParams.has('address')).to.be.true;
      });
    });

    it('should display search results', () => {
      cy.get('#search-input').type('hotel{enter}');
      cy.wait(1000);
  
      // Wait for results to load
      cy.get('#search-results').should('not.be.empty');
  
      // Check that results contain hotel information
      cy.get('#search-results').within(() => {
        cy.get('.hotel-card').should('exist');
      });
    });

    it('should handle empty search results', () => {
      // Mock empty results
      cy.intercept('GET', 'http://localhost:3000/api/hotels*', { body: { hotels: [] } }).as('emptySearch');

      cy.get('#search-input').type('nonexistent hotel{enter}');
      cy.wait(1000);
  
      cy.wait('@emptySearch');
  
      // Should show no results message or empty state
      cy.get('#search-results').should('be.visible');
    });

    it('should handle API errors gracefully', () => {
      cy.intercept('GET', 'http://localhost:3000/api/hotels*', { statusCode: 500 }).as('searchError');

      cy.get('#search-input').type('test{enter}');
      cy.wait(1000);
  
      cy.wait('@searchError');
  
      // Should show error message or fallback UI
      cy.get('#search-results').should('be.visible');
    });
  });

  describe('Search Results', () => {
    beforeEach(() => {
      // Ensure we have some search results
      cy.get('#search-input').type('hotel{enter}');
      cy.wait(1000);
      cy.wait(2000); // Wait for results
    });

    it('should display hotel cards with required information', () => {
      cy.get('.hotel-card').first().within(() => {
        cy.get('.hotel-image').should('be.visible');
        cy.get('.hotel-name').should('not.be.empty');
        cy.get('.hotel-location').should('exist');
        cy.get('.hotel-rating').should('exist');
        cy.get('.hotel-price').should('exist');
      });
    });

    it('should navigate to hotel details when clicking hotel card', () => {
      cy.get('.hotel-card').first().click();
      cy.wait(1000);
  
      cy.url().should('include', 'hotel-details.html');
      cy.url().should('include', 'id=');
    });

    it('should have book now buttons that work', () => {
      cy.get('.hotel-card .book-btn').first().click();
      cy.wait(1000);
  
      cy.url().should('include', 'hotel-details.html');
    });
  });

  describe('Navigation', () => {
    it('should navigate back to home when clicking logo', () => {
      cy.get('#home').click();
      cy.wait(1000);
      cy.url().should('include', 'index.html');
    });

    it('should open login modal', () => {
      cy.get('#openLoginBtn').click();
      cy.wait(1000);
      cy.get('#loginModal').should('be.visible');
    });
  });

  describe('Back to Top', () => {
    it('should scroll to top when clicking back to top button', () => {
      // Scroll down first
      cy.scrollTo('bottom');
      cy.wait(1000);
  
      // Click back to top
      cy.get('#back-to-top').click();
      cy.wait(1000);
  
      // Should be at top of page
      cy.window().its('scrollY').should('equal', 0);
    });
  });
});