/// <reference types="cypress" />

// ***********************************************
// Custom Commands for E-Storefront-Web
// ***********************************************

declare global {
  namespace Cypress {
    interface Chainable {
      /**
       * Custom command to login with email and password
       * @example cy.login('user@example.com', 'password123')
       */
      login(email: string, password: string): Chainable<void>;

      /**
       * Custom command to add product to cart
       * @example cy.addToCart('product-id')
       */
      addToCart(productId: string): Chainable<void>;

      /**
       * Custom command to clear cart
       * @example cy.clearCart()
       */
      clearCart(): Chainable<void>;

      /**
       * Custom command to check if element is in viewport
       * @example cy.get('element').isInViewport()
       */
      isInViewport(): Chainable<boolean>;

      /**
       * Custom command to wait for page load
       * @example cy.waitForPageLoad()
       */
      waitForPageLoad(): Chainable<void>;

      /**
       * Custom command to intercept GraphQL operations
       * @example cy.interceptGQL('GetProducts')
       */
      interceptGQL(operationName: string): Chainable<void>;
    }
  }
}

// Login command
Cypress.Commands.add('login', (email: string, password: string) => {
  cy.visit('/login');
  cy.get('[data-testid="email-input"]').type(email);
  cy.get('[data-testid="password-input"]').type(password);
  cy.get('[data-testid="login-button"]').click();
  cy.url().should('not.include', '/login');
});

// Add to cart command
Cypress.Commands.add('addToCart', (productId: string) => {
  cy.get(`[data-testid="add-to-cart-${productId}"]`).click();
  cy.get('[data-testid="cart-count"]').should('be.visible');
});

// Clear cart command
Cypress.Commands.add('clearCart', () => {
  cy.window().then((win) => {
    win.localStorage.removeItem('cart');
  });
  cy.reload();
});

// Check if element is in viewport
Cypress.Commands.add('isInViewport', { prevSubject: true }, (subject) => {
  const bottom = Cypress.$(cy.state('window')).height()!;
  const rect = subject[0].getBoundingClientRect();
  
  expect(rect.top).to.be.lessThan(bottom);
  expect(rect.bottom).to.be.greaterThan(0);
  
  return cy.wrap(subject);
});

// Wait for page load
Cypress.Commands.add('waitForPageLoad', () => {
  cy.document().its('readyState').should('eq', 'complete');
  cy.get('body').should('be.visible');
});

// Intercept GraphQL operations
Cypress.Commands.add('interceptGQL', (operationName: string) => {
  cy.intercept('POST', '**/graphql', (req) => {
    if (req.body.operationName === operationName) {
      req.alias = operationName;
    }
  });
});

// Prevent TypeScript from reading file as legacy script
export {};
