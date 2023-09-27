describe('Login Page', () => {
  beforeEach(() => {
    cy.visit('http://localhost:3000/')
  })

  it('greets with login page', () => {
    cy.contains('h2', 'Sign In');
  })

  it('requires email & password', () => {
    cy.get('form').contains('Login').click();
    cy.contains('p', 'Email required.');
    cy.contains('p', 'Password required.');
  })

  it('requires valid username and password', () => {
    cy.get("[data-testid='email']").type('example@example.com');
    cy.get("[data-testid='password']").type('password');
    cy.get('form').contains('Login').click();
    cy.get('div').contains('Email not registered.');
  })

  it('navigates to dashboard on successful login', () => {
    cy.get("[data-testid='email']").type('test@gmail.com');
    cy.get("[data-testid='password']").type('testing');
    cy.get('form').contains('Login').click();
    cy.get('h1').contains("Testing123's");

    cy.get('[data-testid="cypress-navcontrol"]').click();
    cy.get('[data-testid="cypress-signout"]').click();
  })

  // afterEach(() => {

  // })

})

// describe('Register Page', () => {
//   beforeEach(() => {
//     cy.visit('http://localhost:3000/')
//   })

//   it('Switches to the register page', () => {
//     cy.contains("Register")
//     .should('exist')
//   })
// })