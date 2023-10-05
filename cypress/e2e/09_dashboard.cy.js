describe('dashboard', ()=> {
    beforeEach(() => {
        cy.visit('http://localhost:3000/');
          cy.getByTestId('cypress-email').type('test@gmail.com');
          cy.getByTestId('cypress-password').type('password');
          cy.get('form').contains('Login').click();
    })
    const setDate = () => {
        const today = new Date().toLocaleDateString().split('/');
        const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'Septemper', 'October', 'November', 'December'];
        today[0] = months[today[0]-1];
        let dateSuffix;
        if(today[1] === '1' || today[1] === '21' || today[1] === '31'){
            dateSuffix = 'st';
        } else if(today[1] === '2' || today[1] === '22'){
            dateSuffix = 'nd';
        } else if(today[1] === '3' || today[1] === '23'){
            dateSuffix = 'rd';
        } else {
            dateSuffix = 'th';
        }
        return `${today[0]}, ${today[1] + dateSuffix}`
    }

    it('displays todays date', ()=> {
        cy.getByTestId('dashboardDate').should('have.text', setDate());
    })

    it('displays the users name', ()=> {
        cy.getByTestId('dashboardUserName').should('exist');
    })

    afterEach(() => {
        cy.getByTestId('cypress-navcontrol').click();
        cy.getByTestId('cypress-signout').click();
    })
})