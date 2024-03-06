import { Given, When, Then } from "@badeball/cypress-cucumber-preprocessor";

const LOGIN_PAGE_URL = "login";

Given("the user navigates to login page", () => {
  cy.visit(LOGIN_PAGE_URL);
});

When("the user provides valid credentials", () => {
  const userName = Cypress.env("USERNAME");
  const password = Cypress.env("PASSWORD");

  cy.get("#username").clear().type(userName);
  cy.get("#password").clear().type(password);

  cy.get("button").click();
});

Then("the main page is displayed to the authenticated user", () => {
  cy.get('[class="flash success"]').should("exist").and("be.visible");
  cy.get('a[href="/logout"]').should("exist").and("be.visible");
});
