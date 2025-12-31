describe('Recipe AI Generation', () => {
  const mockRecipeId = 12345;

  beforeEach(() => {
    // Stub recipes fetch so loading always ends deterministically
    cy.intercept('GET', '**/rest/v1/recipes*', {
      fixture: 'recipes.json',
    }).as('getRecipes');

    cy.visitWithE2EUser('/recipes', {
      id: 'test-user-id',
      email: 'test@example.com',
    });

    // Wait until loading is REALLY done
    cy.wait('@getRecipes');
  });

  it('1. should show the AI button when filters result in few recipes', () => {
    // Sanity check: page loaded
    cy.get('[data-testid="recipe-title-1"]').should('exist');

    // Add ingredient filter
    cy.get('[data-testid="filter-input"]').type('dragon fruit');
    cy.get('[data-testid="filter-add"]').click();

    // AI button should appear when few recipes remain
    cy.get('[data-testid="generate-ai-button"]')
      .should('be.visible')
      .and('contain.text', 'Generate');
  });

  it('2. should show loading overlay and navigate on success', () => {
    // Intercept AI generation
    cy.intercept('POST', '**/functions/v1/generate-recipe', {
      statusCode: 200,
      body: {
        title: 'Cypress Pasta',
        description: 'Test Description',
        steps: ['Step 1'],
        ingredients: [{ name: 'tomato', quantity: 1, unit: 'pc' }],
        cookingTimeMinutes: 10,
      },
    }).as('aiGeneration');

    // Intercept DB save (match .single() shape)
    cy.intercept('POST', '**/rest/v1/recipes*', {
      statusCode: 201,
      body: {
        id: mockRecipeId,
        title: 'Cypress Pasta',
      },
    }).as('dbSave');

    // Intercept ingredients save
    cy.intercept('POST', '**/rest/v1/recipe_ingredients*', {
      statusCode: 201,
      body: [],
    }).as('ingredientsSave');

    // Add ingredient
    cy.get('[data-testid="filter-input"]').type('octopus');
    cy.get('[data-testid="filter-add"]').click();

    // Trigger AI generation
    cy.get('[data-testid="generate-ai-button"]').click();

    // Loading overlay should appear
    cy.contains("Let 'm Cook is thinking...").should('be.visible');

    // Wait for backend flow
    cy.wait('@aiGeneration');
    cy.wait('@dbSave');
    cy.wait('@ingredientsSave');

    // Should navigate to recipe detail page
    cy.url().should('include', `/recipes/${mockRecipeId}`);
  });
});
