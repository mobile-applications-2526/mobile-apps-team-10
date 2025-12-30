import { defineConfig } from 'cypress'

export default defineConfig({
  e2e: {
    baseUrl: 'http://localhost:8081',
    specPattern: ['cypress/e2e/**/*.cy.{js,ts}', 'cypress/unit/**/*.cy.{js,ts}'],
    supportFile: 'cypress/support/e2e.ts',
      },
})

