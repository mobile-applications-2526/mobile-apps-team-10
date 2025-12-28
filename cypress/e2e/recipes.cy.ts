describe('Recipes list and filtering', () => {
  beforeEach(() => {
    // stub the recipes request to return deterministic data
    cy.intercept('GET', '**/rest/v1/recipes*', { fixture: 'recipes.json' }).as('getRecipes');
  });

  it('shows recipes and can filter by ingredient', () => {
    cy.visit('/recipes');
    cy.wait('@getRecipes');
    cy.get('[data-testid="recipe-title-1"]').should('contain.text', 'Tomato Soup');

    // Add filter
    cy.get('[data-testid="filter-input"]').type('tomato');
    cy.get('[data-testid="filter-add"]').click();

    // Only Tomato Soup should remain
    cy.get('[data-testid="recipe-title-1"]').should('exist');
    cy.get('[data-testid="recipe-title-2"]').should('not.exist');

    // Expand card and check ingredients (click wrapper to reliably trigger expand)
    cy.get('[data-testid="recipe-wrapper-1"]').click();
    cy.get('[data-testid="recipe-ingredients-1"]').should('contain.text', 'Tomato');
  });
});
