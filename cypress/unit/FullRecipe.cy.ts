describe('FullRecipe (colocated tests)', () => {
  beforeEach(() => {
    cy.intercept('GET', '**/rest/v1/recipes*', { fixture: 'recipes.json' }).as('getRecipes');
    cy.visit('/recipes/1');
    cy.wait('@getRecipes');
  });

  it('renders title, description and time', () => {
    cy.contains('Tomato Soup').should('exist');
    cy.contains('Tomato').should('exist');
    cy.contains('min').should('exist');
  });

  it('shows total price and euro symbol', () => {
    cy.contains('€').should('exist');
  });

  it('increments and decrements servings and updates displayed count', () => {
    cy.contains('Persons:').should('exist');
    cy.contains('+').click();
    cy.contains('2').should('exist');
    cy.contains('-').click();
    cy.contains('1').should('exist');
  });

  it('shows ingredients and steps and allows basic interaction checks', () => {
    cy.contains('Ingredients:').should('exist');
    cy.contains('Tomato').should('exist');

    cy.contains('Steps:').should('exist');
    cy.contains(/^1\./).should('exist');

    cy.contains(/^1\./).first().click({ force: true });

    cy.get('body').should('contain.text', '€');
  });
});
