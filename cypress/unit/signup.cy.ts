describe('Signup page (colocated test)', () => {
  beforeEach(() => {
    cy.intercept('POST', '**/auth/v1/**', {
      statusCode: 200,
      body: { id: 'fake-user', email: 'new@example.com' }
    }).as('postSignup');
  });

  it('shows success message on successful signup', () => {
    cy.visit('/(tabs)/account/signup');

    cy.get('input[placeholder="Email"]').type('new@example.com').should('have.value', 'new@example.com');
    cy.get('input[placeholder="Password"]').type('password').should('have.value', 'password');

    cy.contains('Sign Up').click();

    cy.wait('@postSignup');

    cy.contains('Check your email for confirmation', { timeout: 10000 }).should('exist');
  });
});
