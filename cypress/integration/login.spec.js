describe('Login tests', () => {
  before(cy.seedDatabase);

  it('should login', () => {
    cy.visit('http://localhost:9090');
    cy.get('input[data-cy=email]')
      .type('e2e-test@email.com');

    cy.get('input[data-cy=password]')
      .type('E2EsecurePassword');

    cy.get('[data-cy=loginBtn]')
      .click();

    cy.url()
      .should('include', '/timeline');
  });

  it('should show error when failed', () => {
    cy.visit('http://localhost:9090');
    cy.get('input[data-cy=email]')
      .type('e2e-test@email.com');

    cy.get('input[data-cy=password]')
      .type('E2EincorrectPassword');

    cy.get('[data-cy=loginBtn]')
      .click();

    cy.get('[data-cy=message]').should('be.visible');
  });
});
