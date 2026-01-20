/// <reference types="cypress" />

describe('Products Page', () => {
  beforeEach(() => {
    cy.fixture('products').as('productsData');
    cy.visit('/products');
    cy.waitForPageLoad();
  });

  describe('Product Listing', () => {
    it('should display products grid', () => {
      cy.get('[data-testid="products-grid"]').should('be.visible');
      cy.get('[data-testid="product-card"]').should('have.length.at.least', 1);
    });

    it('should display product information correctly', () => {
      cy.get('[data-testid="product-card"]')
        .first()
        .within(() => {
          cy.get('[data-testid="product-name"]').should('be.visible');
          cy.get('[data-testid="product-price"]').should('be.visible');
          cy.get('[data-testid="product-image"]').should('be.visible');
        });
    });

    it('should show loading state initially', () => {
      cy.intercept('POST', '**/graphql', (req) => {
        req.on('response', (res) => {
          res.setDelay(1000);
        });
      });
      cy.visit('/products');
      cy.get('[data-testid="loading-skeleton"]').should('be.visible');
    });
  });

  describe('Filtering', () => {
    it('should filter products by category', () => {
      cy.get('[data-testid="category-filter"]').select('Electronics');
      cy.url().should('include', 'category=electronics');
      cy.get('[data-testid="product-card"]').each(($card) => {
        cy.wrap($card).should('contain', 'Electronics');
      });
    });

    it('should filter products by price range', () => {
      cy.get('[data-testid="price-min"]').type('50');
      cy.get('[data-testid="price-max"]').type('200');
      cy.get('[data-testid="apply-filters"]').click();
      cy.url().should('include', 'minPrice=50');
      cy.url().should('include', 'maxPrice=200');
    });

    it('should clear all filters', () => {
      cy.get('[data-testid="category-filter"]').select('Electronics');
      cy.get('[data-testid="clear-filters"]').click();
      cy.url().should('not.include', 'category');
    });
  });

  describe('Sorting', () => {
    it('should sort products by price low to high', () => {
      cy.get('[data-testid="sort-select"]').select('price-asc');
      cy.url().should('include', 'sort=price-asc');
    });

    it('should sort products by price high to low', () => {
      cy.get('[data-testid="sort-select"]').select('price-desc');
      cy.url().should('include', 'sort=price-desc');
    });

    it('should sort products by newest', () => {
      cy.get('[data-testid="sort-select"]').select('newest');
      cy.url().should('include', 'sort=newest');
    });
  });

  describe('Pagination', () => {
    it('should display pagination controls', () => {
      cy.get('[data-testid="pagination"]').should('be.visible');
    });

    it('should navigate to next page', () => {
      cy.get('[data-testid="pagination-next"]').click();
      cy.url().should('include', 'page=2');
    });

    it('should navigate to specific page', () => {
      cy.get('[data-testid="pagination-page-3"]').click();
      cy.url().should('include', 'page=3');
    });
  });

  describe('Product Details', () => {
    it('should navigate to product detail page', () => {
      cy.get('[data-testid="product-card"]').first().click();
      cy.url().should('include', '/product/');
    });

    it('should display product details correctly', () => {
      cy.get('[data-testid="product-card"]').first().click();
      cy.get('[data-testid="product-title"]').should('be.visible');
      cy.get('[data-testid="product-price"]').should('be.visible');
      cy.get('[data-testid="product-description"]').should('be.visible');
      cy.get('[data-testid="add-to-cart-button"]').should('be.visible');
    });

    it('should show product images gallery', () => {
      cy.get('[data-testid="product-card"]').first().click();
      cy.get('[data-testid="product-gallery"]').should('be.visible');
    });
  });
});
