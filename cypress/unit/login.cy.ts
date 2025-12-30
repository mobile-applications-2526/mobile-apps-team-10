describe('Login page (colocated test)', () => {
  it('renders the login form and can perform an E2E-successful login', () => {
    cy.visit('/(tabs)/account/login?e2e_login_success=1');

    cy.get('[data-testid="input-email"]').type('test@example.com');
    cy.get('[data-testid="input-password"]').type('password');

    cy.get('[data-testid="btn-login"]').click();

    cy.url({ timeout: 5000 }).should('include', '/account');
  });

  it('shows validation UI when fields are empty', () => {
    cy.visit('/(tabs)/account/login');

    cy.get('[data-testid="btn-login"]').click();

    cy.get('[data-testid="input-email"]').should('exist');
    cy.get('[data-testid="input-password"]').should('exist');
  });
});
