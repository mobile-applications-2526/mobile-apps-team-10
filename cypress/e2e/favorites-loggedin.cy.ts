import('../support/e2e');

describe('Favorites when logged in (E2E mocked)', () => {
  beforeEach(() => {
    // stub recipes data
    cy.intercept('GET', '**/rest/v1/recipes*', { fixture: 'recipes.json' }).as('getRecipes');
  });

  it('shows favorite recipes in the Favorites tab and can unfavorite them', () => {
    // Visit the favorites page with the E2E user already having recipe 1 favorited
    if ((cy as any).visitWithE2EUser) {
      cy.visitWithE2EUser('/favorites', { id: 'test-user', email: 'test@example.com' }, { 'test-user': [1] });
    } else {
      cy.visit('/favorites', { onBeforeLoad(win) { (win as any).__E2E_USER = { id: 'test-user', email: 'test@example.com' }; (win as any).__E2E_FAVORITES = { 'test-user': [1] }; } });
    }

    cy.wait('@getRecipes');

    // Debug: capture a screenshot of the page state and log E2E favorites
    cy.screenshot('favorites-page-before-assert');
    cy.window().then((win:any) => {
      // write to Cypress runner log; helpful for debugging
      // eslint-disable-next-line no-console
      console.log('window.__E2E_FAVORITES =', win.__E2E_FAVORITES);
    });

    // The favorite recipe should be visible
    cy.get('[data-testid="recipe-title-1"]').should('exist');

    // Unfavorite it from the Favorites tab
    cy.get('[data-testid="recipe-fav-button-1"]').click();
    cy.wait(250);

    // Capture screenshot after unfavoriting for debugging
    cy.screenshot('favorites-page-after-unfavorite');

    // It should no longer be present
    cy.get('[data-testid="recipe-title-1"]').should('not.exist');
  });
});
