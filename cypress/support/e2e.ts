import "./commands";

const COOKIE_POPUP_BUTTON_LOCATOR = "#modal:visible .modal-footer p";

function tryToClickButtonUntilFound(
  buttonLocator: string,
  poolingIntervalMs: number
) {
  return new Cypress.Promise((resolve) => {
    const intervalId = setInterval(() => {
      const button = Cypress.$(buttonLocator);
      if (button.length) {
        console.log("FOUND!");
        button.trigger("click");
        clearInterval(intervalId);
        resolve("Button clicked");
      }
    }, poolingIntervalMs);
  });
}

before(() => {
  tryToClickButtonUntilFound(COOKIE_POPUP_BUTTON_LOCATOR, 2000);
});