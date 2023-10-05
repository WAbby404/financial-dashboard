describe('Register Page', () => {
    beforeEach(() => {
      cy.visit('http://localhost:3000/')
      cy.getByTestId("cypress-toregister").click();
    })
  
    it('switches to the register page', () => {
      cy.getByTestId('cypress-registername').should('exist');
      cy.getByTestId('cypress-registeremail').should('exist');
      cy.getByTestId('cypress-registerpassword').should('exist');
    })
  
    it('requires name, email & password', () => {
      cy.getByTestId('cypress-register').click();
      cy.contains('p', 'Name required').should('exist');
      cy.contains('p', 'Email required').should('exist');
      cy.contains('p', 'Password required').should('exist');
    })
  
    it('requires valid name, email & password', () => {
      cy.getByTestId('cypress-registername').type('Greg');
      cy.getByTestId('cypress-registeremail').type('notarealemail');
      cy.getByTestId('cypress-registerpassword').type('greg');
  
      cy.getByTestId('cypress-register').click();
      cy.contains('p', 'Must be a valid email').should('exist');
      cy.contains('p', 'Password must be at least 6 characters').should('exist');
      cy.contains('p', 'Name required').should('not.exist');
    })
  
    // need to manually delete account made, so dont run this every time
  
    // it('navigates to dashboard on successful register', () => {
    //   cy.get("[data-testid='cypress-registername']").type('Greg');
    //   cy.get("[data-testid='cypress-registeremail']").type('email@gmail.com');
    //   cy.get("[data-testid='cypress-registerpassword']").type('password');
    //   cy.get("[data-testid='cypress-register']").click();
  
    //   cy.get('h1').contains("Greg's");
    //   cy.get('[data-testid="cypress-navcontrol"]').click();
    //   cy.get('[data-testid="cypress-signout"]').click();
    // })
  
    it('switches to login page', () => {
      cy.getByTestId("cypress-tologin").click();
      cy.getByTestId('cypress-email').should('exist');
    })
})