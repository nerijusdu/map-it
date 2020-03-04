describe('Login tests', () => {
  it('should login', () => {
    cy.visit('http://localhost:9090');
    cy.get('input[name=email]')
      .type('e2e-test@email.com');

    cy.get('input[name=password]')
      .type('E2EsecurePassword');

    cy.get('button.md-button.md-primary')
      .click();

    cy.url()
      .should('include', '/timeline');
  });

  it('should show error when failed', () => {
    cy.visit('http://localhost:9090');
    cy.get('input[name=email]')
      .type('e2e-test@email.com');

    cy.get('input[name=password]')
      .type('E2EincorrectPassword');

    cy.get('button.md-button.md-primary')
      .click();

    cy.get('.md-snackbar.error').should('be.visible');
  });
});
