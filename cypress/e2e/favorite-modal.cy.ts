describe('Favorite button when not logged in', () => {
  beforeEach(() => {
    cy.intercept('GET', '**/rest/v1/recipes*', { fixture: 'recipes.json' }).as('getRecipes');
  });

  it('shows login modal when trying to favorite while not authenticated', () => {
    cy.visit('/recipes');
    cy.wait('@getRecipes');

    // Click favourite button for the first recipe
    cy.get('[data-testid="recipe-fav-button-1"]').click();

    cy.get('[data-testid="login-modal"]').should('be.visible');
    cy.get('[data-testid="login-modal-login"]').click();
    cy.url().should('include', '/account/login');
  });
});
