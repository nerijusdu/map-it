import { generate } from 'shortid';

describe('Epic tests', () => {
  before(() => {
    cy.seedDatabase();
    cy.clearLocalStorageCache();
    cy.login();
  });
  beforeEach(cy.restoreLocalStorageCache);
  afterEach(cy.saveLocalStorageCache);

  it('should create a milestone', () => {
    cy.visit('http://localhost:9090');
    const id = generate();

    cy.get('[data-cy=addTask]').click();
    cy.contains('Epic').click();
    cy.get('[data-cy=epic-title-input]')
      .children('input')
      .type(`E2E epic ${id}`);
    cy.get('[data-cy=epic-description-input]')
      .children('textarea')
      .type(`E2E epic description ${id}`);
    cy.get('[data-cy=epic-categories-input]')
      .children('.md-select')
      .click();
    cy.get('[data-cy=epic-category]:first-of-type()')
      .children('button')
      .click();
    cy.get('[data-cy=save-button]').click();
    cy.contains(`E2E epic ${id}`)
      .should('be.visible')
      .click();
  });
});
