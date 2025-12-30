describe('Account tab (colocated test)', () => {
  beforeEach(() => {
    cy.visit('/account');
    cy.get('body').should('exist');
  });

  it('renders account header', () => {
    cy.contains(/account/i).should('exist');
  });

  it('shows either logged\-in or logged\-out UI', () => {
    cy.get('body').then(($body) => {
      const hasLogout = $body.find('button:contains("Log out"), a:contains("Log out")').length > 0;

      if (hasLogout) {
        cy.contains('Log out').should('be.visible');
      } else {
        if ($body.text().match(/sign\s?up/i)) {
          cy.contains(/sign\s?up/i).should('be.visible');
        } else {
          cy.contains(/create one|don't have an account\?/i).should('be.visible');
        }

        cy.contains(/log\s?in|login/i).should('exist');
      }
    });
  });
});
