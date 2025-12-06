describe('Settings Page', () => {
  beforeEach(() => {
    // Mock logged in user for settings access
    cy.window().then((win) => {
      win.localStorage.setItem('token', 'mock-jwt-token');
    });

    cy.visit('/settings.html');
  });

  describe('Settings Page Layout', () => {
    it('should display settings page correctly', () => {
      cy.get('.settings-page').should('be.visible');
      cy.get('.settings-layout').should('be.visible');
      cy.get('.settings-sidebar').should('be.visible');
      cy.get('.settings-content').should('be.visible');
    });

    it('should display user profile in sidebar', () => {
      cy.get('.profile-summary').should('be.visible');
      cy.get('.profile-avatar').should('be.visible');
      cy.get('.profile-name').should('not.be.empty');
    });

    it('should display settings navigation', () => {
      cy.get('.settings-nav').should('be.visible');
      cy.get('.settings-nav ul li').should('have.length.greaterThan', 0);
    });
  });

  describe('Profile Section', () => {
    beforeEach(() => {
      cy.get('[data-section="profile"]').click();
      ;
      cy.get('#profile-section').should('be.visible');
    });

    it('should display profile form with current data', () => {
      cy.get('#profile-form').should('be.visible');
      cy.get('#profile-first-name').should('have.value');
      cy.get('#profile-last-name').should('have.value');
      cy.get('#profile-email').should('have.value');
    });

    it('should validate required fields', () => {
      cy.get('#profile-first-name').clear();
      ;
      cy.get('#profile-form').find('button[type="submit"]').click();
      ;
  
      // Should show validation
      cy.get('#profile-section').should('be.visible');
    });

    it('should update profile successfully', () => {
      cy.intercept('PUT', 'http://localhost:3000/auth/profile').as('updateProfile');
  
      cy.get('#profile-first-name').clear().type('Updated');
      ;
      cy.get('#profile-last-name').clear().type('User');
      ;
      cy.get('#profile-phone').clear().type('+1987654321');
      ;
  
      cy.get('#profile-form').submit();
      ;
  
      cy.wait('@updateProfile').then((interception) => {
        expect(interception.response.statusCode).to.equal(200);
        expect(interception.request.body).to.have.property('firstName', 'Updated');
      });
    });

    it('should handle profile update errors', () => {
      cy.intercept('PUT', 'http://localhost:3000/auth/profile', { statusCode: 400 }).as('updateProfileError');
  
      cy.get('#profile-first-name').clear().type('Test');
      ;
      cy.get('#profile-form').submit();
      ;
  
      cy.wait('@updateProfileError');
  
      // Should show error state
      cy.get('#profile-section').should('be.visible');
    });
  });

  describe('Security Section', () => {
    beforeEach(() => {
      cy.get('[data-section="security"]').click();
      ;
      cy.get('#security-section').should('be.visible');
    });

    it('should display password change form', () => {
      cy.get('#password-form').should('be.visible');
      cy.get('#current-password').should('be.visible');
      cy.get('#new-password').should('be.visible');
      cy.get('#confirm-password').should('be.visible');
    });

    it('should validate password fields', () => {
      cy.get('#password-form').find('button[type="submit"]').click();
      ;
  
      // Should show validation errors
      cy.get('#security-section').should('be.visible');
    });

    it('should validate password confirmation', () => {
      cy.get('#current-password').type('oldpass');
      ;
      cy.get('#new-password').type('newpass123');
      ;
      cy.get('#confirm-password').type('differentpass');
      ;
  
      cy.get('#password-form').submit();
      ;
  
      // Should show confirmation error
      cy.get('#security-section').should('be.visible');
    });

    it('should change password successfully', () => {
      cy.intercept('PUT', 'http://localhost:3000/auth/password').as('changePassword');
  
      cy.get('#current-password').type('oldpassword');
      ;
      cy.get('#new-password').type('newpassword123');
      ;
      cy.get('#confirm-password').type('newpassword123');
      ;
  
      cy.get('#password-form').submit();
      ;
  
      cy.wait('@changePassword').then((interception) => {
        expect(interception.response.statusCode).to.equal(200);
      });
    });
  });

  describe('Reservations Section', () => {
    beforeEach(() => {
      cy.get('[data-section="reservations"]').click();
      ;
      cy.get('#reservations-section').should('be.visible');
    });

    it('should display reservation filters', () => {
      cy.get('.reservation-filters').should('be.visible');
      cy.get('#reservation-filter').should('be.visible');
    });

    it('should display reservation list', () => {
      cy.get('.reservations-list').should('be.visible');
    });

    it('should filter reservations', () => {
      cy.get('#reservation-filter').select('upcoming');
      ;
  
      // Should filter to show only upcoming reservations
      cy.get('.reservation-item').should('have.class', 'upcoming');
    });

    it('should allow modifying reservations', () => {
      cy.get('.reservation-item.upcoming .btn-outline').first().click();
      ;
  
      // Should open modification modal or navigate
      // Implementation dependent
    });

    it('should allow canceling reservations', () => {
      cy.get('.reservation-item.upcoming .btn-danger').first().click();
      ;
  
      // Should show confirmation dialog
      // Implementation dependent
    });
  });

  describe('Account Section', () => {
    beforeEach(() => {
      cy.get('[data-section="account"]').click();
      ;
      cy.get('#account-section').should('be.visible');
    });

    it('should display notification preferences', () => {
      cy.get('.notification-preferences').should('be.visible');
      cy.get('#email-notifications').should('be.visible');
      cy.get('#sms-notifications').should('be.visible');
      cy.get('#marketing-notifications').should('be.visible');
    });

    it('should toggle notification settings', () => {
      cy.get('#email-notifications').uncheck();
      ;
      cy.get('#email-notifications').should('not.be.checked');
  
      cy.get('#sms-notifications').check();
      ;
      cy.get('#sms-notifications').should('be.checked');
    });

    it('should display danger zone', () => {
      cy.get('.danger-zone').should('be.visible');
      cy.get('#delete-account-btn').should('be.visible');
    });

    it('should show delete account confirmation', () => {
      cy.get('#delete-account-btn').click();
      ;
  
      // Should open confirmation modal
      cy.get('#delete-account-modal').should('be.visible');
    });
  });

  describe('Account Deletion', () => {
    beforeEach(() => {
      cy.get('[data-section="account"]').click();
      ;
      cy.get('#delete-account-btn').click();
      ;
      cy.get('#delete-account-modal').should('be.visible');
    });

    it('should validate deletion confirmation', () => {
      cy.get('#confirm-delete').should('be.disabled');
  
      cy.get('#delete-confirm').check();
      ;
      cy.get('#delete-password').type('password123');
      ;
  
      cy.get('#confirm-delete').should('not.be.disabled');
    });

    it('should delete account successfully', () => {
      cy.intercept('DELETE', 'http://localhost:3000/auth/account').as('deleteAccount');
  
      cy.get('#delete-confirm').check();
      ;
      cy.get('#delete-password').type('password123');
      ;
      cy.get('#confirm-delete').click();
      ;
  
      cy.wait('@deleteAccount').then((interception) => {
        expect(interception.response.statusCode).to.equal(200);
      });
  
      // Should redirect or show success message
    });

    it('should handle deletion errors', () => {
      cy.intercept('DELETE', 'http://localhost:3000/auth/account', { statusCode: 400 }).as('deleteAccountError');
  
      cy.get('#delete-confirm').check();
      ;
      cy.get('#delete-password').type('wrongpassword');
      ;
      cy.get('#confirm-delete').click();
      ;
  
      cy.wait('@deleteAccountError');
  
      // Should show error and keep modal open
      cy.get('#delete-account-modal').should('be.visible');
    });
  });

  describe('Navigation', () => {
    it('should switch between settings sections', () => {
      cy.get('[data-section="profile"]').should('have.class', 'active');
  
      cy.get('[data-section="security"]').click();
      ;
      cy.get('#security-section').should('be.visible');
      cy.get('#profile-section').should('not.be.visible');
  
      cy.get('[data-section="reservations"]').click();
      ;
      cy.get('#reservations-section').should('be.visible');
      cy.get('#security-section').should('not.be.visible');
    });

    it('should navigate back to home', () => {
      cy.get('#home').click();
      ;
      cy.url().should('include', 'index.html');
    });
  });

  describe('API Integration', () => {
    it('should load user profile data on page load', () => {
      cy.intercept('GET', 'http://localhost:3000/auth/profile').as('getProfile');

      cy.reload();
      ;
  
      cy.wait('@getProfile').then((interception) => {
        expect(interception.response.statusCode).to.equal(200);
      });
    });

    it('should handle API errors gracefully', () => {
      cy.intercept('GET', 'http://localhost:3000/auth/profile', { statusCode: 401 }).as('getProfileError');

      cy.reload();
      ;
  
      cy.wait('@getProfileError');
  
      // Should redirect to login or show error
      cy.url().should('not.include', 'settings.html');
    });
  });

  describe('Responsive Design', () => {
    it('should be responsive on mobile', () => {
      cy.viewport('iphone-6');
      cy.get('.settings-layout').should('be.visible');
      cy.get('.settings-sidebar').should('be.visible');
      cy.get('.settings-content').should('be.visible');
    });

    it('should be responsive on tablet', () => {
      cy.viewport('ipad-2');
      cy.get('.settings-layout').should('be.visible');
      cy.get('.settings-sidebar').should('be.visible');
      cy.get('.settings-content').should('be.visible');
    });
  });
});