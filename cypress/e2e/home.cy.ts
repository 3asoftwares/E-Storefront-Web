/// <reference types="cypress" />

describe('Home Page', () => {
  beforeEach(() => {
    cy.visit('/');
    cy.waitForPageLoad();
  });

  it('should display the homepage with header and navigation', () => {
    cy.get('header').should('be.visible');
    cy.get('nav').should('be.visible');
    cy.contains('3A Softwares').should('be.visible');
  });

  it('should display featured products section', () => {
    cy.get('[data-testid="featured-products"]').should('be.visible');
    cy.get('[data-testid="product-card"]').should('have.length.at.least', 1);
  });

  it('should display categories section', () => {
    cy.get('[data-testid="categories-section"]').should('be.visible');
  });

  it('should navigate to product page when clicking on a product', () => {
    cy.get('[data-testid="product-card"]').first().click();
    cy.url().should('include', '/product/');
  });

  it('should have a working search functionality', () => {
    cy.get('[data-testid="search-input"]').type('headphones');
    cy.get('[data-testid="search-button"]').click();
    cy.url().should('include', 'search');
  });

  it('should display cart icon with count', () => {
    cy.get('[data-testid="cart-icon"]').should('be.visible');
  });

  it('should be responsive on mobile viewport', () => {
    cy.viewport('iphone-x');
    cy.get('[data-testid="mobile-menu-button"]').should('be.visible');
  });

  it('should load page within acceptable time', () => {
    cy.visit('/', {
      onBeforeLoad: (win) => {
        win.performance.mark('start');
      },
    });
    
    cy.window().then((win) => {
      win.performance.mark('end');
      win.performance.measure('pageLoad', 'start', 'end');
      const measure = win.performance.getEntriesByName('pageLoad')[0];
      expect(measure.duration).to.be.lessThan(3000); // 3 seconds
    });
  });
});
