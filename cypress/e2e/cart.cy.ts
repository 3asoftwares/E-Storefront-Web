/// <reference types="cypress" />

describe('Shopping Cart', () => {
  beforeEach(() => {
    cy.clearCart();
    cy.visit('/');
    cy.waitForPageLoad();
  });

  describe('Add to Cart', () => {
    it('should add product to cart from product listing', () => {
      cy.visit('/products');
      cy.get('[data-testid="product-card"]').first().within(() => {
        cy.get('[data-testid="quick-add-button"]').click();
      });
      cy.get('[data-testid="cart-count"]').should('contain', '1');
    });

    it('should add product to cart from product detail page', () => {
      cy.visit('/products');
      cy.get('[data-testid="product-card"]').first().click();
      cy.get('[data-testid="add-to-cart-button"]').click();
      cy.get('[data-testid="cart-count"]').should('contain', '1');
    });

    it('should update quantity when adding same product', () => {
      cy.visit('/products');
      cy.get('[data-testid="product-card"]').first().click();
      cy.get('[data-testid="add-to-cart-button"]').click();
      cy.get('[data-testid="add-to-cart-button"]').click();
      cy.get('[data-testid="cart-count"]').should('contain', '2');
    });

    it('should show success notification after adding to cart', () => {
      cy.visit('/products');
      cy.get('[data-testid="product-card"]').first().within(() => {
        cy.get('[data-testid="quick-add-button"]').click();
      });
      cy.get('[data-testid="toast-success"]').should('be.visible');
    });
  });

  describe('Cart Page', () => {
    beforeEach(() => {
      // Add a product to cart first
      cy.visit('/products');
      cy.get('[data-testid="product-card"]').first().within(() => {
        cy.get('[data-testid="quick-add-button"]').click();
      });
      cy.visit('/cart');
    });

    it('should display cart items', () => {
      cy.get('[data-testid="cart-item"]').should('have.length.at.least', 1);
    });

    it('should display cart summary', () => {
      cy.get('[data-testid="cart-subtotal"]').should('be.visible');
      cy.get('[data-testid="cart-total"]').should('be.visible');
    });

    it('should update item quantity', () => {
      cy.get('[data-testid="quantity-increase"]').first().click();
      cy.get('[data-testid="item-quantity"]').first().should('contain', '2');
    });

    it('should remove item from cart', () => {
      cy.get('[data-testid="remove-item"]').first().click();
      cy.get('[data-testid="empty-cart-message"]').should('be.visible');
    });

    it('should show empty cart message when no items', () => {
      cy.get('[data-testid="remove-item"]').first().click();
      cy.get('[data-testid="empty-cart-message"]').should('be.visible');
      cy.get('[data-testid="continue-shopping"]').should('be.visible');
    });

    it('should navigate to checkout', () => {
      cy.get('[data-testid="checkout-button"]').click();
      cy.url().should('include', '/checkout');
    });
  });

  describe('Cart Persistence', () => {
    it('should persist cart after page reload', () => {
      cy.visit('/products');
      cy.get('[data-testid="product-card"]').first().within(() => {
        cy.get('[data-testid="quick-add-button"]').click();
      });
      cy.reload();
      cy.get('[data-testid="cart-count"]').should('contain', '1');
    });

    it('should persist cart across browser sessions', () => {
      cy.visit('/products');
      cy.get('[data-testid="product-card"]').first().within(() => {
        cy.get('[data-testid="quick-add-button"]').click();
      });
      
      // Simulate new session by clearing session storage but keeping local storage
      cy.window().then((win) => {
        win.sessionStorage.clear();
      });
      cy.visit('/');
      cy.get('[data-testid="cart-count"]').should('contain', '1');
    });
  });

  describe('Cart Drawer', () => {
    it('should open cart drawer when clicking cart icon', () => {
      cy.visit('/products');
      cy.get('[data-testid="product-card"]').first().within(() => {
        cy.get('[data-testid="quick-add-button"]').click();
      });
      cy.get('[data-testid="cart-icon"]').click();
      cy.get('[data-testid="cart-drawer"]').should('be.visible');
    });

    it('should close cart drawer when clicking outside', () => {
      cy.visit('/products');
      cy.get('[data-testid="product-card"]').first().within(() => {
        cy.get('[data-testid="quick-add-button"]').click();
      });
      cy.get('[data-testid="cart-icon"]').click();
      cy.get('[data-testid="cart-drawer-overlay"]').click({ force: true });
      cy.get('[data-testid="cart-drawer"]').should('not.be.visible');
    });
  });
});
