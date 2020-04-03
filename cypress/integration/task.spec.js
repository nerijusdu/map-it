import { generate } from 'shortid';

describe('Task tests', () => {
  before(() => {
    cy.seedDatabase();
    cy.clearLocalStorageCache();
    cy.login();
  });
  beforeEach(cy.restoreLocalStorageCache);
  afterEach(cy.saveLocalStorageCache);

  it('should create a task', () => {
    cy.visit('http://localhost:9090');
    const id = generate();

    cy.get('[data-cy=add-btn]').click();
    cy.contains('Task').click();
    cy.get('[data-cy=task-title-input]')
      .children('input')
      .type(`E2E task ${id}`);
    cy.get('[data-cy=task-description-input]')
      .children('textarea')
      .type(`E2E task description ${id}`);
    cy.get('[data-cy=task-category-input]')
      .children('.md-select')
      .click();
    // select first category from dropdown
    cy.get('.md-menu-content-container > ul:nth-child(1) > li:nth-child(1) > button:nth-child(1)')
      .click();
    cy.get('[data-cy=task-end-date]').click();
    // select last day of the month
    cy.get('div.md-datepicker-day:last-child').click();
    cy.get('[data-cy=save-button]').click();

    cy.contains(`E2E task ${id}`)
      .should('be.visible')
      .click();
    cy.contains(`E2E task description ${id}`)
      .should('be.visible');
  });
});
