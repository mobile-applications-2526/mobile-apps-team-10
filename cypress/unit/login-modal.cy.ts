describe('Login modal (colocated test)', () => {
  it('renders and navigates to login when clicking Login in modal', () => {
    cy.intercept('GET', '**/rest/v1/recipes*', { fixture: 'recipes.json' }).as('getRecipes');
    cy.visit('/recipes');
    cy.wait('@getRecipes');

    cy.get('[data-testid="recipe-fav-button-1"]').click();

    cy.get('[data-testid="login-modal"]').should('be.visible');
    cy.get('[data-testid="login-modal-login"]').click();
    cy.url().should('include', '/account/login');
  });
});

