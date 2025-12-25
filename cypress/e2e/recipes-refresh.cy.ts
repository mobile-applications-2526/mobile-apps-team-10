describe('Recipes refresh', () => {
  it('reloads and shows updated recipes', () => {
    // first response
    cy.intercept('GET', '**/rest/v1/recipes*', { fixture: 'recipes.json' }).as('getRecipes1');

    cy.visit('/recipes');
    cy.wait('@getRecipes1');
    cy.get('[data-testid="recipe-title-1"]').should('exist');

    // now change to updated fixture
    cy.intercept('GET', '**/rest/v1/recipes*', { fixture: 'recipes_updated.json' }).as('getRecipes2');
    cy.reload();
    cy.wait('@getRecipes2');

    // The original recipe 1 should be gone and new one present
    cy.get('[data-testid="recipe-title-1"]').should('not.exist');
    cy.get('[data-testid="recipe-title-3"]').should('contain.text', 'Garlic Bread');
  });
});
