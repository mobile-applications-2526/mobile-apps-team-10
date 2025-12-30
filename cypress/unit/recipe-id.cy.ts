describe('Recipe details page (colocated test)', () => {
  beforeEach(() => {
    cy.intercept('GET', '**/rest/v1/recipes*', { fixture: 'recipes.json' }).as('getRecipes');
  });

  it('loads a recipe by id and shows the full recipe component', () => {
    cy.visit('/recipes/1');
    cy.wait('@getRecipes');

    cy.contains('Tomato Soup', { timeout: 10000 }).should('exist');
    cy.get('[data-testid="1-fav-button"]', { timeout: 10000 }).should('exist');
  });

  it('shows not found message for unknown recipe id', () => {
    cy.intercept('GET', '**/rest/v1/recipes*', { fixture: 'recipes.json' }).as('getRecipes2');
    cy.visit('/recipes/999');
    cy.wait('@getRecipes2');
    cy.contains('Recipe not found.').should('exist');
  });
});
