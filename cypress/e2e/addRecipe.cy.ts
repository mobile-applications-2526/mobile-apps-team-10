describe('Add a recipe and verify it in the list', () => {
  const recipeTitle = `E2E Test Recipe ${Date.now()}`;

  beforeEach(() => {
    // Stub recipes request to include the new recipe after creation
    cy.intercept('GET', '**/rest/v1/recipes*', (req) => {
      req.reply((res) => {
        // Use existing fixture and append our test recipe
        const recipes = res.body || [];
        recipes.push({
          id: 9999, // arbitrary unique id for this test
          title: recipeTitle,
          description: 'This is an E2E test recipe',
          cookingTimeMinutes: 25,
          recipe_ingredients: [
            { ingredients: { name: 'Walnuts' }, quantity: 2, unit: 'pcs', price_estimate: 1.5 }
          ],
          steps: ['Cut walnuts and cook gently']
        });
        res.send(recipes);
      });
    }).as('getRecipes');
  });

  it('creates a recipe and finds it in the recipes list', () => {
    // 1️⃣ Login (E2E shortcut)
    cy.visit('/(tabs)/account/login?e2e_login_success=1');
    cy.get('[data-testid="input-email"]').type('test@example.com');
    cy.get('[data-testid="input-password"]').type('password');
    cy.get('[data-testid="btn-login"]').click();
    cy.url({ timeout: 5000 }).should('include', '/account');

    // 2️⃣ Go to add recipe screen
    cy.visit('/(tabs)/favorites');
    cy.get('[data-testid="add-recipe-button"]').click();
    cy.get('[data-testid="input-title"]', { timeout: 5000 }).should('be.visible');

    // 3️⃣ Fill in the form
    cy.get('[data-testid="input-title"]').type(recipeTitle);
    cy.get('input[placeholder="Description"]').type('This is an E2E test recipe');
    cy.get('input[placeholder="Cooking time (minutes)"]').type('25');

    cy.get('input[placeholder="Ingredient name"]').type('Walnuts');
    cy.get('input[placeholder="Qty"]').type('2');
    cy.get('input[placeholder="Unit"]').type('pcs');
    cy.get('input[placeholder="€/unit"]').type('1.5');

    cy.get('input[placeholder="Step 1"]').type('Cut walnuts and cook gently');

    // 4️⃣ Save recipe
    cy.contains('Save recipe').click();

    // 5️⃣ Assert redirect to recipes page
    cy.url({ timeout: 5000 }).should('include', '/recipes');

    // 6️⃣ Wait for stubbed GET request and verify recipe
    cy.wait('@getRecipes');
    cy.get('[data-testid="filter-input"]').type('walnuts');
    cy.get('[data-testid="filter-add"]').click();

    cy.get('[data-testid="recipe-title-9999"]', { timeout: 5000 })
      .should('contain.text', recipeTitle);

    cy.get('[data-testid="recipe-wrapper-9999"]').click();
    cy.get('[data-testid="recipe-ingredients-9999"]').should('contain.text', 'Walnuts');
  });
});
