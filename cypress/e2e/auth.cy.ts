/// <reference types="cypress" />

describe('Authentication', () => {
  beforeEach(() => {
    cy.clearLocalStorage();
    cy.visit('/');
  });

  describe('Login', () => {
    it('should display login form', () => {
      cy.visit('/login');
      cy.get('[data-testid="login-form"]').should('be.visible');
      cy.get('[data-testid="email-input"]').should('be.visible');
      cy.get('[data-testid="password-input"]').should('be.visible');
      cy.get('[data-testid="login-button"]').should('be.visible');
    });

    it('should show validation errors for empty fields', () => {
      cy.visit('/login');
      cy.get('[data-testid="login-button"]').click();
      cy.get('[data-testid="error-email"]').should('be.visible');
      cy.get('[data-testid="error-password"]').should('be.visible');
    });

    it('should show error for invalid credentials', () => {
      cy.intercept('POST', '**/graphql', (req) => {
        if (req.body.operationName === 'Login') {
          req.reply({
            errors: [{ message: 'Invalid credentials' }],
          });
        }
      });

      cy.visit('/login');
      cy.get('[data-testid="email-input"]').type('wrong@email.com');
      cy.get('[data-testid="password-input"]').type('wrongpassword');
      cy.get('[data-testid="login-button"]').click();
      cy.get('[data-testid="login-error"]').should('be.visible');
    });

    it('should redirect to home after successful login', () => {
      cy.intercept('POST', '**/graphql', (req) => {
        if (req.body.operationName === 'Login') {
          req.reply({
            data: {
              login: {
                token: 'mock-jwt-token',
                user: {
                  id: '1',
                  email: 'test@example.com',
                  name: 'Test User',
                },
              },
            },
          });
        }
      });

      cy.visit('/login');
      cy.get('[data-testid="email-input"]').type('test@example.com');
      cy.get('[data-testid="password-input"]').type('password123');
      cy.get('[data-testid="login-button"]').click();
      cy.url().should('eq', Cypress.config().baseUrl + '/');
    });

    it('should show/hide password toggle', () => {
      cy.visit('/login');
      cy.get('[data-testid="password-input"]').should('have.attr', 'type', 'password');
      cy.get('[data-testid="toggle-password"]').click();
      cy.get('[data-testid="password-input"]').should('have.attr', 'type', 'text');
    });
  });

  describe('Signup', () => {
    it('should display signup form', () => {
      cy.visit('/signup');
      cy.get('[data-testid="signup-form"]').should('be.visible');
      cy.get('[data-testid="name-input"]').should('be.visible');
      cy.get('[data-testid="email-input"]').should('be.visible');
      cy.get('[data-testid="password-input"]').should('be.visible');
      cy.get('[data-testid="confirm-password-input"]').should('be.visible');
    });

    it('should validate password match', () => {
      cy.visit('/signup');
      cy.get('[data-testid="password-input"]').type('password123');
      cy.get('[data-testid="confirm-password-input"]').type('password456');
      cy.get('[data-testid="signup-button"]').click();
      cy.get('[data-testid="error-confirm-password"]').should('contain', 'match');
    });

    it('should validate password strength', () => {
      cy.visit('/signup');
      cy.get('[data-testid="password-input"]').type('weak');
      cy.get('[data-testid="password-input"]').blur();
      cy.get('[data-testid="password-strength"]').should('contain', 'weak');
    });

    it('should register new user successfully', () => {
      cy.intercept('POST', '**/graphql', (req) => {
        if (req.body.operationName === 'Register') {
          req.reply({
            data: {
              register: {
                token: 'mock-jwt-token',
                user: {
                  id: '1',
                  email: 'newuser@example.com',
                  name: 'New User',
                },
              },
            },
          });
        }
      });

      cy.visit('/signup');
      cy.get('[data-testid="name-input"]').type('New User');
      cy.get('[data-testid="email-input"]').type('newuser@example.com');
      cy.get('[data-testid="password-input"]').type('SecurePass123!');
      cy.get('[data-testid="confirm-password-input"]').type('SecurePass123!');
      cy.get('[data-testid="signup-button"]').click();
      cy.url().should('eq', Cypress.config().baseUrl + '/');
    });
  });

  describe('Logout', () => {
    beforeEach(() => {
      // Mock logged in state
      cy.window().then((win) => {
        win.localStorage.setItem('auth-token', 'mock-jwt-token');
        win.localStorage.setItem('user', JSON.stringify({ id: '1', name: 'Test User' }));
      });
    });

    it('should logout user and redirect to home', () => {
      cy.visit('/');
      cy.get('[data-testid="user-menu"]').click();
      cy.get('[data-testid="logout-button"]').click();
      cy.get('[data-testid="login-link"]').should('be.visible');
    });

    it('should clear auth data on logout', () => {
      cy.visit('/');
      cy.get('[data-testid="user-menu"]').click();
      cy.get('[data-testid="logout-button"]').click();
      cy.window().then((win) => {
        expect(win.localStorage.getItem('auth-token')).to.be.null;
      });
    });
  });

  describe('Forgot Password', () => {
    it('should display forgot password form', () => {
      cy.visit('/forgot-password');
      cy.get('[data-testid="forgot-password-form"]').should('be.visible');
      cy.get('[data-testid="email-input"]').should('be.visible');
    });

    it('should send reset email', () => {
      cy.intercept('POST', '**/graphql', (req) => {
        if (req.body.operationName === 'ForgotPassword') {
          req.reply({
            data: {
              forgotPassword: { success: true },
            },
          });
        }
      });

      cy.visit('/forgot-password');
      cy.get('[data-testid="email-input"]').type('test@example.com');
      cy.get('[data-testid="submit-button"]').click();
      cy.get('[data-testid="success-message"]').should('be.visible');
    });
  });
});
