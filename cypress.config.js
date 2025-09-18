import { defineConfig } from "cypress";

export default defineConfig({
  e2e: {
    specPattern: "cypress/e2e/**/*.spec.js",
    baseUrl: "http://localhost:5176",
  },

  component: {
    specPattern: [
      "src/pages/**/*.cy.spec.{js,jsx,ts,tsx}",
      "cypress/component/**/*.cy.{js,jsx,ts,tsx}"
    ],
    devServer: {
      framework: "react",
      bundler: "vite",
    },
  },
});
