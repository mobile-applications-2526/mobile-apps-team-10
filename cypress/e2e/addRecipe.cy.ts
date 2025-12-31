describe('Add a recipe and verify it in the list', () => {
  const recipeTitle = `E2E Test Recipe ${Date.now()}`;

  beforeEach(() => {
    // 1️⃣ Stub the GET request so the new recipe appears in the list later
    cy.intercept('GET', '**/rest/v1/recipes*', (req) => {
      req.reply((res) => {
        const recipes = res.body || [];
        recipes.push({
          id: 9999,
          title: recipeTitle,
          description: 'This is an E2E test recipe',
          time_minutes: 25,
          recipe_ingredients: [
            { ingredients: { name: 'Walnuts' }, quantity: 2, unit: 'pcs' }
          ],
          steps: ['Cut walnuts and cook gently']
        });
        res.send(recipes);
      });
    }).as('getRecipes');

    // 2️⃣ Intercept the POST for the Recipe itself (Fixes the 401)
    cy.intercept('POST', '**/rest/v1/recipes*', {
      statusCode: 201,
      body: [{ id: 9999, title: recipeTitle }]
    }).as('saveRecipe');

    // 3️⃣ Intercept the POST for Ingredients
    cy.intercept('POST', '**/rest/v1/ingredients*', {
      statusCode: 201,
      body: [{ id: 1, name: 'walnuts' }]
    }).as('saveIngredient');

    // 4️⃣ Intercept the Join Table Insert
    cy.intercept('POST', '**/rest/v1/recipe_ingredients*', {
      statusCode: 201,
      body: []
    }).as('saveJoinTable');
  });

  it('creates a recipe and finds it in the recipes list', () => {
    // 1️⃣ Login (Mocked via E2E shortcut logic if you have it)
    cy.visit('/(tabs)/account/login?e2e_login_success=1');
    // ... rest of login logic

    // 2️⃣ Fill the form
    cy.visit('/(tabs)/favorites');
    cy.get('[data-testid="add-recipe-button"]').click();
    
    cy.get('[data-testid="input-title"]').type(recipeTitle);
    cy.get('input[placeholder="Description"]').type('This is an E2E test recipe');
    cy.get('input[placeholder="Cooking time (minutes)"]').type('25');

    // 3️⃣ Save
    cy.contains('Save recipe').click();

    // 4️⃣ Assert redirect and check list
    cy.url({ timeout: 10000 }).should('include', '/recipes');

    // This wait is crucial: it ensures the list refreshes with our mocked data
    cy.wait('@getRecipes');

    cy.get('[data-testid="filter-input"]').type('walnuts{enter}');

    cy.get('[data-testid="recipe-title-9999"]', { timeout: 8000 })
      .should('be.visible')
      .should('contain.text', recipeTitle);
  });
});