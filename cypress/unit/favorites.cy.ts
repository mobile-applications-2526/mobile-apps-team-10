describe('Favorites tab (colocated test)', () => {
  beforeEach(() => {
    cy.intercept('GET', '**/rest/v1/recipes*', { fixture: 'recipes.json' }).as('getRecipes');
    cy.visit('/favorites', {
      onBeforeLoad(win) {
        win.__E2E_USER = { id: 'test-user', email: 'test@example.com' };
        win.__E2E_FAVORITES = { 'test-user': [1] };
      },
    });
    cy.wait('@getRecipes');
  });

  it('shows favorites page title or empty state', () => {
    cy.contains('Your Favorites').should('exist');
    cy.get('[data-testid="recipe-title-1"]', { timeout: 10000 }).should('exist');
  });
});
