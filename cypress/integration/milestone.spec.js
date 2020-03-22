import { generate } from 'shortid';

describe('Milestone tests', () => {
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
    cy.contains('Milestone').click();
    cy.get('[data-cy=milestone-title-input]')
      .children('input')
      .type(`E2E milestone ${id}`);
    cy.get('[data-cy=milestone-date-input]').click();
    // select last day of the month
    cy.get('div.md-datepicker-day:last-child').click();
    cy.get('[data-cy=save-button]').click();

    cy.get(`[data-cy=date-marker-E2E-milestone-${id}]`)
      .should('be.visible')
      .click();
  });
});
