describe('ExpandableRecipe (colocated tests)', () => {
  beforeEach(() => {
    cy.intercept('GET', '**/rest/v1/recipes*', { fixture: 'recipes.json' }).as('getRecipes');
    cy.visit('/recipes');
    cy.wait('@getRecipes');
  });

  it('creates recipe card and shows title', () => {
    cy.get('[data-testid="recipe-title-1"]').should('contain.text', 'Tomato Soup');
  });

  it('expands the card and shows ingredients', () => {
    cy.get('[data-testid="recipe-wrapper-1"]').click();
    cy.get('[data-testid="recipe-ingredients-1"]').should('contain.text', 'Tomato');
  });

  it('increments and decrements servings', () => {
    cy.get('[data-testid="recipe-wrapper-1"]').click();
    cy.get('[data-testid="recipe-wrapper-1"]').contains('+').click();
    cy.get('[data-testid="recipe-wrapper-1"]').contains('2').should('exist');
    cy.get('[data-testid="recipe-wrapper-1"]').contains('-').click();
    cy.get('[data-testid="recipe-wrapper-1"]').contains('1').should('exist');
  });

  it('shows total price with € prefix', () => {
    cy.get('[data-testid="recipe-wrapper-1"]').click();
    cy.get('[data-testid="recipe-title-1"]').parent().parent().should('contain.text', '€');
  });
});

