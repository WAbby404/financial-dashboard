describe('Login Page', () => {
    beforeEach(() => {
      cy.visit('http://localhost:3000/')
    })
  
    it('greets with login page', () => {
      // cy.get('[data-testid="cypress-navcontrol"]').click();
      // cy.get('[data-testid="cypress-signout"]').click();
      cy.contains('h2', 'Sign In');
    })
  
    it('requires email & password', () => {
      cy.get('form').contains('Login').click();
      cy.contains('p', 'Email required');
      cy.contains('p', 'Password required');
    })
  
    it('requires valid username and password', () => {
      cy.getByTestId('cypress-email').type('example@example.com');
      cy.getByTestId('cypress-password').type('password');
      cy.get('form').contains('Login').click();
      cy.get('div').contains('Email not registered.');
    })
  
    it('navigates to dashboard on successful login', () => {
      cy.getByTestId('cypress-email').type('test@gmail.com');
      cy.getByTestId('cypress-password').type('password');
      cy.get('form').contains('Login').click();
      cy.get('h1').contains("123's");
  
      cy.getByTestId('cypress-navcontrol').click();
      cy.getByTestId('cypress-signout').click();
    })
  
})