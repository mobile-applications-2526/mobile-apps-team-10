describe('Home screen', () => {
  it('shows welcome text', () => {
    cy.visit('/')
    // react-native-web exposes testID as data-testid on web
    cy.get('[data-testid="home-welcome"]').should('contain.text', "Welcome to Let 'm Cook")
  })
})
