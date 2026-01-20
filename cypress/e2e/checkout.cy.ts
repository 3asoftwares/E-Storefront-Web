/// <reference types="cypress" />

describe('Checkout Flow', () => {
  beforeEach(() => {
    // Add product to cart before each test
    cy.visit('/products');
    cy.waitForPageLoad();
    cy.get('[data-testid="product-card"]')
      .first()
      .within(() => {
        cy.get('[data-testid="quick-add-button"]').click();
      });
  });

  describe('Guest Checkout', () => {
    it('should allow guest checkout', () => {
      cy.visit('/checkout');
      cy.get('[data-testid="guest-checkout"]').click();
      cy.get('[data-testid="checkout-form"]').should('be.visible');
    });

    it('should validate required fields', () => {
      cy.visit('/checkout');
      cy.get('[data-testid="guest-checkout"]').click();
      cy.get('[data-testid="submit-order"]').click();
      cy.get('[data-testid="error-email"]').should('be.visible');
      cy.get('[data-testid="error-address"]').should('be.visible');
    });
  });

  describe('Shipping Information', () => {
    beforeEach(() => {
      cy.visit('/checkout');
      cy.get('[data-testid="guest-checkout"]').click();
    });

    it('should accept valid shipping information', () => {
      cy.get('[data-testid="email-input"]').type('test@example.com');
      cy.get('[data-testid="first-name"]').type('John');
      cy.get('[data-testid="last-name"]').type('Doe');
      cy.get('[data-testid="address"]').type('123 Main St');
      cy.get('[data-testid="city"]').type('New York');
      cy.get('[data-testid="state"]').type('NY');
      cy.get('[data-testid="zip"]').type('10001');
      cy.get('[data-testid="phone"]').type('1234567890');
      cy.get('[data-testid="continue-to-payment"]').click();
      cy.get('[data-testid="payment-section"]').should('be.visible');
    });

    it('should validate email format', () => {
      cy.get('[data-testid="email-input"]').type('invalid-email');
      cy.get('[data-testid="email-input"]').blur();
      cy.get('[data-testid="error-email"]').should('contain', 'valid email');
    });
  });

  describe('Payment', () => {
    beforeEach(() => {
      cy.visit('/checkout');
      cy.get('[data-testid="guest-checkout"]').click();
      // Fill shipping info
      cy.get('[data-testid="email-input"]').type('test@example.com');
      cy.get('[data-testid="first-name"]').type('John');
      cy.get('[data-testid="last-name"]').type('Doe');
      cy.get('[data-testid="address"]').type('123 Main St');
      cy.get('[data-testid="city"]').type('New York');
      cy.get('[data-testid="state"]').type('NY');
      cy.get('[data-testid="zip"]').type('10001');
      cy.get('[data-testid="continue-to-payment"]').click();
    });

    it('should display payment options', () => {
      cy.get('[data-testid="payment-card"]').should('be.visible');
    });

    it('should display order summary', () => {
      cy.get('[data-testid="order-summary"]').should('be.visible');
      cy.get('[data-testid="order-total"]').should('be.visible');
    });
  });

  describe('Order Confirmation', () => {
    it('should show order confirmation after successful checkout', () => {
      // Mock successful order API
      cy.intercept('POST', '**/graphql', (req) => {
        if (req.body.operationName === 'CreateOrder') {
          req.reply({
            data: {
              createOrder: {
                id: 'order-123',
                orderNumber: 'ORD-2026-001',
                status: 'confirmed',
              },
            },
          });
        }
      });

      cy.visit('/checkout');
      cy.get('[data-testid="guest-checkout"]').click();

      // Fill checkout form
      cy.get('[data-testid="email-input"]').type('test@example.com');
      cy.get('[data-testid="first-name"]').type('John');
      cy.get('[data-testid="last-name"]').type('Doe');
      cy.get('[data-testid="address"]').type('123 Main St');
      cy.get('[data-testid="city"]').type('New York');
      cy.get('[data-testid="state"]').type('NY');
      cy.get('[data-testid="zip"]').type('10001');
      cy.get('[data-testid="continue-to-payment"]').click();
      cy.get('[data-testid="place-order"]').click();

      cy.url().should('include', '/order-confirmation');
      cy.get('[data-testid="order-number"]').should('be.visible');
    });
  });
});
