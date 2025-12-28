/// <reference types="cypress" />

declare namespace Cypress {
  interface Chainable<Subject = any> {
    /**
     * Visit a page and set E2E user/favorites before the app mounts
     * @param url path to visit
     * @param user test user object
     * @param favorites mapping of userId -> favorite recipe ids
     */
    visitWithE2EUser(url: string, user?: any, favorites?: Record<string, number[]>): Chainable<Window>
  }
}
