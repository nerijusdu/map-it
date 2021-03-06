describe('Timeline tests', () => {
  before(() => {
    cy.seedDatabase();
    cy.clearLocalStorageCache();
    cy.login();
  });
  beforeEach(cy.restoreLocalStorageCache);
  afterEach(cy.saveLocalStorageCache);

  it('should show timeline', () => {
    cy.visit('http://localhost:9090');

    cy.contains('E2E Task1').should('be.visible');
    cy.contains('E2E Task2')
      .should('be.visible')
      .parent()
      .should('have.css', 'background-color', 'rgb(149, 149, 149)');
    cy.contains('E2E Category1').should('be.visible');
    cy.contains('E2E Category2').should('be.visible');
    cy.contains('E2E Sub-Category1').should('be.visible');
    cy.contains('E2E Epic1').should('be.visible');
    cy.get('[data-cy=date-marker-E2E-Milestone1').should('be.visible');
    cy.get('[data-cy=date-marker-Today').should('be.visible');
    cy.get('[data-cy=add-btn]').should('be.visible');
  });

  it('should switch roadmaps', () => {
    cy.visit('http://localhost:9090');

    cy.get('[data-cy=roadmap-selection]').click();
    cy.get('[data-cy=roadmap-option]:last-of-type()').click();

    cy.contains('E2E Task1').should('not.be.visible');
  });
});
