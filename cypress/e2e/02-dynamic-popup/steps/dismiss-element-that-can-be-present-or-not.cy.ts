import { Given, When, Then } from "@badeball/cypress-cucumber-preprocessor";

const ENTRY_AD_URL = "entry_ad";
const FLOATING_MENU_URL = "floating_menu";

const locators = {
  modal: "#modal:visible",
};

Given("the user navigates to a page that may show a popup or not", () => {
  cy.visit(Math.random() > 0.5 ? ENTRY_AD_URL : FLOATING_MENU_URL);
});

When("the user waits for {int} seconds", (seconds: number) => {
  cy.log(`Waiting ${seconds} seconds...`);
  cy.wait(Math.ceil(seconds * 1000));
  cy.log(`Finished waiting`);
});

Then("the modal popup is not present in the page", () => {
  cy.get(locators.modal).should("not.exist");
});
