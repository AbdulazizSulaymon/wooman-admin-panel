// https://docs.cypress.io/guides/references/assertions

export const test = describe('prof record', () => {
  before(() => {
    cy.clearLocalStorageSnapshot();
  });

  beforeEach(() => {
    cy.restoreLocalStorage();
  });

  afterEach(() => {
    cy.saveLocalStorage();
  });

  it('progress tab ', function () {
    cy.visit('http://localhost:3000/');
    cy.wait(2000);

    // cy.get('#popup-container').should('be.visible');
    // cy.get('#popup-container-hide-btn').should('be.visible');
    // cy.get('#popup-item-title').should('be.visible');
    // cy.get('#popup-item-title').should('contain', 'Profilaktik xisobi');
    // cy.get("div[class*='probationProgressTitle']").should('contain', 'statistika');
    // cy.get("div[class*='probationProgressWrapper']").should('be.visible');
    // cy.get("div[class*='probationProgressWrapperItem']").should('be.visible');
    // cy.get("div[class*='probationProgressWrapperText']").should('be.visible');
  });
});
