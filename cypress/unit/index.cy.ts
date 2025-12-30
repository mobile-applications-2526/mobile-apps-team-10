describe('Home tab (colocated test)', () => {
  it('shows welcome and logo', () => {
    cy.visit('/');
    cy.contains("Welcome to Let 'm Cook").should('exist');
    cy.get('img, image').should('exist');
  });
});


