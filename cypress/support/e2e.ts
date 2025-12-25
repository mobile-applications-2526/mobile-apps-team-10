// Cypress support file
// You can put global configuration and behavior here.
// https://docs.cypress.io/guides/references/configuration

// Example: preserve localStorage between tests or set viewport
Cypress.on('uncaught:exception', () => {
  // prevent Cypress from failing tests because of uncaught exceptions from the app
  return false
})

// Helper to visit a page and set E2E user/favorites before the app mounts
Cypress.Commands.add('visitWithE2EUser', (url: string, user: any = { id: 'test-user', email: 'test@example.com' }, favorites: Record<string, number[]> = {}) => {
  return cy.visit(url, {
    onBeforeLoad(win) {
      // @ts-ignore
      win.__E2E_USER = user;
      // @ts-ignore
      win.__E2E_FAVORITES = favorites;
    }
  });
});
// debug: confirm support file is loaded in Cypress runner logs
console.log('[Cypress support] e2e support file loaded')

