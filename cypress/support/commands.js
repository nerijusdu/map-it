// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************

Cypress.Commands.add('login', (email, password) => {
  cy.request('POST', 'http://localhost:9091/api/account/login', {
    email: email || 'e2e-test@email.com',
    password: password || 'E2EsecurePassword'
  })
    .then((res) => {
      const data = res.body;
      window.localStorage.setItem('userId', data.id);
      window.localStorage.setItem('token', data.token);
      window.localStorage.setItem('isAdmin', data.isAdmin);
      window.localStorage.setItem('refreshToken', data.refreshToken);
      window.localStorage.setItem('email', data.email);
      window.localStorage.setItem('tokenExpiresAt', data.expiresAt);
    });
});

Cypress.Commands.add('seedDatabase', () => {
  cy.request('http://localhost:9091/api/test-data/seed');
});

// These are needed to keep local storage (with JWT) across multiple tests
let LOCAL_STORAGE_MEMORY = {};
Cypress.Commands.add('saveLocalStorageCache', () => {
  Object.keys(localStorage).forEach((key) => {
    LOCAL_STORAGE_MEMORY[key] = localStorage[key];
  });
});
Cypress.Commands.add('restoreLocalStorageCache', () => {
  Object.keys(LOCAL_STORAGE_MEMORY).forEach((key) => {
    localStorage.setItem(key, LOCAL_STORAGE_MEMORY[key]);
  });
});
Cypress.Commands.add('clearLocalStorageCache', () => {
  localStorage.clear();
  LOCAL_STORAGE_MEMORY = {};
});
