import { generate } from 'shortid';

describe('Category tests', () => {
  before(() => {
    cy.seedDatabase();
    cy.clearLocalStorageCache();
    cy.login();
  });
  beforeEach(cy.restoreLocalStorageCache);
  afterEach(cy.saveLocalStorageCache);

  it('should create a category', () => {
    cy.visit('http://localhost:9090');
    const id = generate();

    cy.get('[data-cy=add-btn]').click();
    cy.contains('Category').click();
    cy.get('[data-cy=category-title-input]')
      .children('input')
      .type(`E2E category ${id}`);
    cy.get('[data-cy=category-description-input]')
      .children('textarea')
      .type(`E2E category description ${id}`);
    cy.get('[data-cy=save-button]').click();

    cy.contains(`E2E category ${id}`)
      .should('be.visible')
      .click();
    cy.contains(`E2E category description ${id}`)
      .should('be.visible');
  });

  it('should create sub-category', () => {
    cy.visit('http://localhost:9090');
    const id = generate();

    cy.get('[data-cy=add-btn]').click();
    cy.contains('Category').click();
    cy.get('[data-cy=category-title-input]')
      .children('input')
      .type(`E2E category ${id}`);
    cy.get('[data-cy=category-description-input]')
      .children('textarea')
      .type(`E2E category description ${id}`);
    cy.get('[data-cy=category-is-subcategory-input]')
      .find('.md-checkbox-container')
      .click();
    cy.get('[data-cy=category-parent-input]')
      .children('.md-select')
      .click();
    cy.get('[data-cy=category-parent]:first-of-type()')
      .click();
    cy.get('[data-cy=save-button]').click();

    cy.get('body').then(($body) => {
      if ($body.find('[data-cy=confirmation-modal]').length > 0) {   
        $body.find('[data-cy=confirm]').click();
      }
    });

    cy.contains(`E2E category ${id}`)
      .should('be.visible')
      .click();
    cy.contains(`E2E category description ${id}`)
      .should('be.visible');
  });
});
