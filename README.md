# cypress-ts-bdd

The goal of this repository is providing a way to learn how to scaffold a Cypress test project using Cucumber and Typescript.
You can find extended explanation about how to configure the project in my website [danigarcia.org](https://danigarcia.org).

## 1. Project Configuration

In order to create a basic project scaffolding, we'll follow these steps:

### Link local and remote repositories

- Create a ssh private and public key
```bash
$ ssh-keygen -t ed25519 -C "your_email@example.com"

Generating public/private ed25519 key pair.
Enter file in which to save the key (/home/daniel/.ssh/id_ed25519):
Enter passphrase (empty for no passphrase):
Enter same passphrase again:
Your identification has been saved in /home/daniel/.ssh/id_ed25519
Your public key has been saved in /home/daniel/.ssh/id_ed25519.pub
The key fingerprint is:
SHA256:+Fss5a3UMmvRY+t6EjbDJC9kVCnWtP0NxsToFsZAZFY your_email@example.com
The key's randomart image is:
+--[ED25519 256]--+
|         *O=Eo.  |
|        +ooo=o.  |
|       o ..o..+  |
|       .+ . oo o |
|      .oS=.o  . .|
|       ..+Oo+    |
|        ooB*oo   |
|         =o=o    |
|        ..+=.    |
+----[SHA256]-----+
```

- Add public key to GitHub (Settings > SSH and GPG keys > New SSH Key)
- Configure local git

```bash
$ git config --global user.name "FIRST_NAME LAST_NAME"
$ git config --global user.email "your_email@example.com"
```

- Add private key to SSH Agent
```bash
$ eval "$(ssh-agent -s)"
> Agent pid 59566
$ ssh-add ~/.ssh/id_ed25519
```

### Project initialization and package selection

```bash
$ npm init
$ npm i -D cypress
$ npm i -D @badeball/cypress-cucumber-preprocessor
$ npm i -D @bahmutov/cypress-esbuild-preprocessor
$ npm i -D typescript
$ npm i -D @types/node @types/cypress-cucumber-preprocessor
```

### Execute Cypress to generate default configuration files

```bash
npx cypress open
```

### Configure step definition location in package.json
```json
  "cypress-cucumber-preprocessor": {
    "stepDefinitions": [
      "cypress/e2e/**/*.ts"
    ]
  }
```
### Configure Typescript

- Add `tsconfig.json` file:
```json
{
    "compilerOptions": {
        "target": "ES2021",
        "lib": ["ES2021", "DOM"],
        "types": ["cypress", "node"],
        "moduleResolution": "node16",
        "esModuleInterop": true,
        "allowSyntheticDefaultImports": true
    },
    "include": ["**/*.ts"]
}
```

### Configure Cypress

- Add `cypress/support/tasks.ts`
```typescript
const tasks = {
    stdout: (...data: Array<any>) => {
        console.log(data)
    }
};

export default tasks;
```

- Add cucumber preprocessor to `cypress.config.ts`
```typescript
import { defineConfig } from "cypress";
import { addCucumberPreprocessorPlugin } from "@badeball/cypress-cucumber-preprocessor";

async function setupNodeEvents(
  on: Cypress.PluginEvents,
  config: Cypress.PluginConfigOptions
): Promise<Cypress.PluginConfigOptions> {
  await addCucumberPreprocessorPlugin(on, config);
  return config;
}

export default defineConfig({
  e2e: {
    setupNodeEvents,
  },
});
```

- Add bundler preprocessor to `cypress.config.ts`
```typescript
import { defineConfig } from "cypress";
import { addCucumberPreprocessorPlugin } from "@badeball/cypress-cucumber-preprocessor";
import createEsbuildPlugin from "@badeball/cypress-cucumber-preprocessor/esbuild";
import createBundler from "@bahmutov/cypress-esbuild-preprocessor/src";

async function setupNodeEvents(
  on: Cypress.PluginEvents,
  config: Cypress.PluginConfigOptions
): Promise<Cypress.PluginConfigOptions> {
  await addCucumberPreprocessorPlugin(on, config);
  on(
    "file:preprocessor",
    createBundler({ plugins: [createEsbuildPlugin(config)] })
  );
  return config;
}

export default defineConfig({
  e2e: {
    setupNodeEvents,
  },
});
```

- Add tasks to `cypress.config.ts`
```typescript
import { defineConfig } from "cypress";
import { addCucumberPreprocessorPlugin } from "@badeball/cypress-cucumber-preprocessor";
import createEsbuildPlugin from "@badeball/cypress-cucumber-preprocessor/esbuild";
import createBundler from "@bahmutov/cypress-esbuild-preprocessor/src";
import tasks from "./cypress/support/tasks";

async function setupNodeEvents(
  on: Cypress.PluginEvents,
  config: Cypress.PluginConfigOptions
): Promise<Cypress.PluginConfigOptions> {
  await addCucumberPreprocessorPlugin(on, config);
  on(
    "file:preprocessor",
    createBundler({ plugins: [createEsbuildPlugin(config)] })
  );
  on("task", tasks);
  return config;
}

export default defineConfig({
  e2e: {
    setupNodeEvents,
  },
});
```

- Configure feature and step implementation file locations, as well as baseURL.
```typescript
import { defineConfig } from "cypress";
import { addCucumberPreprocessorPlugin } from "@badeball/cypress-cucumber-preprocessor";
import createEsbuildPlugin from "@badeball/cypress-cucumber-preprocessor/esbuild";
import createBundler from "@bahmutov/cypress-esbuild-preprocessor/src";
import tasks from "./cypress/support/tasks";

async function setupNodeEvents(
  on: Cypress.PluginEvents,
  config: Cypress.PluginConfigOptions
): Promise<Cypress.PluginConfigOptions> {
  await addCucumberPreprocessorPlugin(on, config);
  on(
    "file:preprocessor",
    createBundler({ plugins: [createEsbuildPlugin(config)] })
  );
  on("task", tasks);
  return config;
}

export default defineConfig({
  e2e: {
    setupNodeEvents,
    specPattern: "./cypress/e2e/**/*.{feature,features}",
    supportFile: "./cypress/support/e2e.ts",
	baseUrl: "https://the-internet.herokuapp.com"
  },
});
```

- Create file for environment variables, `cypress.env.json`:
```json
{
    "USERNAME": "tomsmith",
    "PASSWORD": "SuperSecretPassword!"
}
```

### Create a feature with a basic scenario

```gherkin
Feature: User is able to sign in the web application
    Scenario: User logs in successfully
        Given the user navigates to login page
        When the user provides valid credentials
        Then the main page is displayed to the authenticated user
```

### Implement steps

```typescript
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
```

### Add Cucumber support for VS Code
- Install [Cucumber (Gherkin) Full Support extension](https://marketplace.visualstudio.com/items?itemName=alexkrechik.cucumberautocomplete)
- Create file `.vscode/settings.json` and add:
```
{
    "cucumberautocomplete.steps": [
        "cypress/e2e/*/**/steps/*.ts"
    ],
    "cucumberautocomplete.strictGherkinCompletion": false,
    "cucumberautocomplete.smartSnippets": true
}
```

### Open Cypress IDE and run test

```
npx cypress open
```