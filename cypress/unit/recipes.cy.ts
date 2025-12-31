describe('Recipes tab (colocated test)', () => {
  beforeEach(() => {
    cy.intercept('GET', '**/rest/v1/recipes*', { fixture: 'recipes.json' }).as('getRecipes');
    cy.visit('/recipes');
    cy.wait('@getRecipes');
  });

  it('shows page title and recipes list', () => {
    cy.contains('Recipes').should('exist');
    cy.get('[data-testid="recipe-title-1"]').should('exist');
  });

  it('can add filter ingredient and filter list', () => {
    cy.get('[data-testid="filter-input"]').type('tomato');
    cy.get('[data-testid="filter-add"]').click();
    cy.get('[data-testid="recipe-title-1"]').should('exist');
  });

  it('shows and accepts advanced filter inputs', () => {
    cy.get('[data-testid="advanced-filters-toggle"]').click();

    cy.get('input[placeholder="Max time (minutes)"]').type('30').should('have.value', '30');
    cy.get('input[placeholder="Max price (€)"]').type('10').should('have.value', '10');

    cy.get('[data-testid="advanced-filters-toggle"]').click();
  });

  it('opens login modal when trying to favorite while not logged in', () => {
    cy.get('[data-testid="recipe-fav-button-1"]').click();
    cy.get('[data-testid="login-modal"]').should('be.visible');

    cy.get('[data-testid="login-modal-close"]').click();
    cy.get('[data-testid="login-modal"]').should('not.exist');
  });

  it('expands recipe card and adjusts servings', () => {
    cy.get('[data-testid="recipe-wrapper-1"]').click();
    cy.get('[data-testid="recipe-wrapper-1"]').contains('+').click();
    cy.get('[data-testid="recipe-wrapper-1"]').contains('2').should('exist');
    cy.get('[data-testid="recipe-wrapper-1"]').contains('-').click();
    cy.get('[data-testid="recipe-wrapper-1"]').contains('1').should('exist');
  });
});

describe('Recipes tab additional behaviours', () => {
  beforeEach(() => {
    cy.intercept('GET', '**/rest/v1/recipes*', { fixture: 'recipes.json' }).as('getRecipes');
    cy.visit('/recipes');
    cy.wait('@getRecipes');
  });

  it('adds and removes a selected ingredient from the selected list', () => {
    cy.get('[data-testid="filter-input"]').clear().type('tomato');
    cy.get('[data-testid="filter-add"]').click();
    cy.get('[data-testid="selected-ingredients"]').contains('tomato').should('exist');

    cy.get('[data-testid="selected-ingredient-tomato"]').should('exist').click();

    cy.get('[data-testid="selected-ingredients"]').contains('tomato').should('not.exist');
  });

  it('navigates to recipe details when View Details is clicked', () => {
    cy.get('[data-testid="recipe-wrapper-1"]').click();
    cy.contains('View Details').click();
    cy.url({ timeout: 5000 }).should('include', '/recipes/1');
  });
});
