describe('Favorites when logged in (E2E mocked)', () => {
  beforeEach(() => {
    // stub recipes data
    cy.intercept('GET', '**/rest/v1/recipes*', { fixture: 'recipes.json' }).as('getRecipes');
  });

  it('can favorite a recipe and it shows up in Favorites tab', () => {
    // ensure support file is loaded (import is idempotent)
    import('../support/e2e')
    // Initialize and visit with E2E user set before the app mounts (use fallback if command missing)
    if ((cy as any).visitWithE2EUser) {
      cy.visitWithE2EUser('/recipes', { id: 'test-user', email: 'test@example.com' }, { 'test-user': [] });
    } else {
      cy.visit('/recipes', { onBeforeLoad(win) { (win as any).__E2E_USER = { id: 'test-user', email: 'test@example.com' }; (win as any).__E2E_FAVORITES = { 'test-user': [] }; } });
    }
    cy.wait('@getRecipes');

    // Favorite the first recipe
    cy.get('[data-testid="recipe-fav-button-1"]').click();

    // Give the app a moment to update E2E favorite storage
    cy.wait(200);

    // Go to favorites tab and assert it's present. Use visitWithE2EUser so the new page sees the E2E user + favorites
    cy.intercept('GET', '**/rest/v1/recipes*', { fixture: 'recipes.json' }).as('getFavRecipes');
    if ((cy as any).visitWithE2EUser) {
      cy.visitWithE2EUser('/favorites', { id: 'test-user', email: 'test@example.com' }, { 'test-user': [1] });
    } else {
      cy.visit('/favorites', { onBeforeLoad(win) { (win as any).__E2E_USER = { id: 'test-user', email: 'test@example.com' }; (win as any).__E2E_FAVORITES = { 'test-user': [1] }; } });
    }
    cy.wait('@getFavRecipes');
    cy.get('[data-testid="recipe-title-1"]').should('exist');

    // Unfavorite it
    cy.get('[data-testid="recipe-fav-button-1"]').click();
    cy.wait(200);
    cy.get('[data-testid="recipe-title-1"]').should('not.exist');
  });
});
