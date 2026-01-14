// ***********************************************************
// Component Testing Support File
// ***********************************************************

import './commands';
import '@testing-library/cypress/add-commands';

// Import global styles for component testing
import '../../app/globals.css';

// Augment the Cypress namespace to include type definitions for
// your custom command.
declare global {
  namespace Cypress {
    interface Chainable {
      mount: typeof import('cypress/react18').mount;
    }
  }
}

// Import mount function from cypress/react18
import { mount } from 'cypress/react18';

Cypress.Commands.add('mount', mount);

// Prevent TypeScript from reading file as legacy script
export {};
