describe('Login flow (E2E shortcut)', () => {
  it('shows success and navigates to account when using E2E shortcut', () => {
    // ensure support file is loaded (import is idempotent)
    import('../support/e2e')
    if ((cy as any).visitWithE2EUser) {
      cy.visitWithE2EUser('/(tabs)/account/login?e2e_login_success=1', { id: 'test-user', email: 'test@example.com' }, { 'test-user': [] });
    } else {
      cy.visit('/(tabs)/account/login?e2e_login_success=1', { onBeforeLoad(win) { (win as any).__E2E_USER = { id: 'test-user', email: 'test@example.com' }; (win as any).__E2E_FAVORITES = { 'test-user': [] }; } });
    }

    cy.get('[data-testid="input-email"]').type('test@example.com');
    cy.get('[data-testid="input-password"]').type('password');
    cy.get('[data-testid="btn-login"]').click();

    // Login component navigates away on success; assert we reached account page
    cy.url().should('include', '/account');
    cy.get('[data-testid="account-title"]').should('exist');
  });
});
