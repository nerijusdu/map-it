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

    cy.get('.navigation-bar').should('be.visible');
  });
});
