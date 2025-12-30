// Make sure E2E helpers are registered before tests run
import '../support/e2e';

describe('Recipe detail page', () => {
  beforeEach(() => {
    // Stub the recipes request to return deterministic data
    cy.intercept('GET', '**/rest/v1/recipes*', {
      fixture: 'recipes.json',
    }).as('getRecipes');
  });

  it('shows full recipe details when visiting the recipe URL directly', () => {
    // Visit recipe detail page as a logged-in E2E user
    cy.visitWithE2EUser(
      '/recipes/1',
      { id: 'test-user', email: 'test@example.com' },
      { 'test-user': [] }
    );

    // Wait for data to load
    cy.wait('@getRecipes');

    // Recipe title
    cy.contains('Tomato Soup').should('exist');

    // Ingredient content
    cy.get('[data-testid="1"]').should('contain.text', 'Tomato');

    // Price label exists (do NOT validate numeric correctness)
    cy.contains('€').should('exist');
  });
});
