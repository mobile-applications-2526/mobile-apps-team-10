describe('Signup flow', () => {
  it('shows success message on successful signup', () => {
    cy.intercept('POST', '**/auth/v1/**', {
      statusCode: 200,
      body: { id: 'fake-user', email: 'new@example.com' }
    }).as('postSignup');

    cy.visit('/(tabs)/account/signup');

    cy.get('input[placeholder="Email"]').type('new@example.com').should('have.value', 'new@example.com');
    cy.get('input[placeholder="Password"]').type('password').should('have.value', 'password');

    cy.contains('Sign Up').click();

    cy.wait('@postSignup');

    cy.contains('Check your email for confirmation', { timeout: 10000 }).should('exist').then(() => {}, (err) => { cy.screenshot('signup-no-success-message'); throw err; });
  });

  it('shows error when password is too short due to frontend validation', () => {
    cy.visit('/(tabs)/account/signup');

    cy.get('input[placeholder="Email"]').type('new@example.com');
    cy.get('input[placeholder="Password"]').type('pw'); // too short

    cy.contains('Sign Up').click();

    cy.contains('Password should be at least 6 characters.', { timeout: 5000 })
      .should('exist')
      .then(() => {}, (err) => {
        cy.screenshot('signup-no-validation-error');
        throw err;
      });
  });

  it('shows error when email is invalid due to frontend validation', () => {
      cy.visit('/(tabs)/account/signup');

      cy.get('input[placeholder="Email"]').type('bad-email');
      cy.get('input[placeholder="Password"]').type('password');

      cy.contains('Sign Up').click();

      cy.contains('Unable to validate email address: invalid format', { timeout: 5000 })
        .should('exist')
        .then(() => {}, (err) => {
          cy.screenshot('signup-no-validation-error');
          throw err;
        });
    });
});
