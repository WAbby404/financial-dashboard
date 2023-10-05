describe('Nav bar', () => {
    beforeEach(() => {
        cy.visit('http://localhost:3000/');
        // cy.getByTestId('cypress-navcontrol').click();
        // cy.getByTestId('cypress-signout').click();
        cy.getByTestId('cypress-email').type('test@gmail.com');
        cy.getByTestId('cypress-password').type('password');
        cy.get('form').contains('Login').click();
        cy.getByTestId('cypress-navcontrol').click();
      })

    it('opens when hamburger button is clicked', ()=> {
        cy.getByTestId('cypress-signout').should('exist');
        cy.getByTestId('cypress-signout').click();
    })

    it('closes nav on close nav button click', ()=> {
        cy.getByTestId('navClose').click();
        cy.getByTestId('transactionsModalOpen').should('exist');

        cy.getByTestId('cypress-navcontrol').click();
        cy.getByTestId('cypress-signout').click();
    })

    it('signs the user out on signout button', ()=> {
        cy.getByTestId('cypress-signout').click();
        cy.getByTestId('cypress-email').should('exist');
    })

})