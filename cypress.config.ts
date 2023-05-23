import { defineConfig } from 'cypress';

export default defineConfig({
  e2e: {
    // baseUrl: "http://localhost:3000",
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
    excludeSpecPattern: process.env.CI ? 'cypress/e2e/all.cy.ts' : [],
  },

  component: {
    devServer: {
      framework: 'next',
      bundler: 'webpack',
    },
  },
});
