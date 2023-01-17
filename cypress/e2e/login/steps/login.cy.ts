import { Given, When, Then } from "@badeball/cypress-cucumber-preprocessor"

Given("the user navigates to login page", () => {
  cy.visit('https://the-internet.herokuapp.com/login');
})

When('the user enters valid credentials', () => {
    cy.get('[id="username"]').type('tomsmith');
    cy.get('[id="password"]').type('SuperSecretPassword!');
    cy.get('button[type="submit"]').click();
});

Then('the user is logged in', () => {
    cy.get('[id="flash"][class="flash success"]').should('exist');
});