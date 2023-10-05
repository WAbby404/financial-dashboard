describe('Goals Modal', ()=> {
    beforeEach(() => {
        cy.visit('http://localhost:3000/');
        //   cy.getByTestId('cypress-navcontrol').click();
        //   cy.getByTestId('cypress-signout').click();
          cy.getByTestId('cypress-email').type('test@gmail.com');
          cy.getByTestId('cypress-password').type('password');
          cy.get('form').contains('Login').click();
    })

    it('starts with no goals & empty list case', () => {
        cy.getByTestId('goalsList').children().should('have.length', 1);
        cy.contains('Goal list empty, add a goal in Manage Goals');
    })

    it('opens and exits goals modal', ()=> {
        cy.getByTestId('goalsModalOpen').click();
        cy.contains('Edit, Delete or');
        cy.getByTestId('goalsModalClose').click();
        cy.contains('Edit, Delete or').should('not.exist');
    })

    it('opens and closes goal form', ()=> {
        cy.getByTestId('goalsModalOpen').click();
        cy.getByTestId('goalsFormOpen').click();
        cy.getByTestId('goalsFormName').should('exist');
        cy.getByTestId('goalsFormCurrent').should('exist');
        cy.getByTestId('goalsFormTotal').should('exist');
        cy.getByTestId('goalsFormClose').click();
        cy.getByTestId('goalsModalClose').click();
    })

    it('requires goal name, current amount & total amount', ()=> {
        cy.getByTestId('goalsModalOpen').click();
        cy.getByTestId('goalsFormOpen').click();
        cy.getByTestId('goalsFormSubmit').click();
        cy.contains('p', 'Name required').should('exist');
        cy.contains('p', 'Current required').should('exist');
        cy.contains('p', 'Total required').should('exist');
        cy.getByTestId('goalsModalClose').click();
    })

    it('requires valid name, current amount & total amount', ()=> {
        cy.getByTestId('goalsModalOpen').click();
        cy.getByTestId('goalsFormOpen').click();
        cy.getByTestId('goalsFormName').type("Mayonnaise is an instrument");
        cy.getByTestId('goalsFormCurrent').type('-3');
        cy.getByTestId('goalsFormTotal').type('1000000000000000000000');
        cy.getByTestId('goalsFormSubmit').click();

        cy.contains('p', 'Name cannot exceed 12 characters').should('exist');
        cy.contains('p', 'Current must be a positive value').should('exist');
        cy.contains('p', 'Total cannot exceed $9,999,999.99').should('exist');

        cy.getByTestId('goalsModalClose').click();
    })

    it('adds created goal to goal list & deletes the account', ()=> {
        cy.getByTestId('goalsModalOpen').click();
        cy.getByTestId('goalsFormOpen').click();
        cy.getByTestId('goalsFormName').type('Jake the dog');
        cy.getByTestId('goalsFormCurrent').type('25');
        cy.getByTestId('goalsFormTotal').type('100');
        cy.getByTestId('goalsFormSubmit').click();
        cy.getByTestId('goal-0').should('exist');
        cy.getByTestId('goalsListModal').children().should('have.length', 1);

        cy.getByTestId('goalDelete-0').click();
        cy.getByTestId('goalsListModal').children().should('have.length', 1);
        cy.contains('Goal list empty, add a goal in Manage Goals');
        cy.getByTestId('goalsFormClose').click();
        cy.getByTestId('goalsModalClose').click();
    })

    it('success snackbar appears when goal is created, deletion snackbar appears when goal is deleted', () => {
        cy.getByTestId('goalsModalOpen').click();
        cy.getByTestId('goalsFormOpen').click();
        cy.getByTestId('goalsFormName').type('Jake the dog');
        cy.getByTestId('goalsFormCurrent').type('25');
        cy.getByTestId('goalsFormTotal').type('100');
        cy.getByTestId('goalsFormSubmit').click();
        cy.contains('Goal created!').should('exist');

        cy.getByTestId('goalDelete-0').click();
        cy.contains('Goal deleted.').should('exist');
        cy.getByTestId('goalsFormClose').click();
        cy.getByTestId('goalsModalClose').click();
    })

    it('clicking on edit button on a preexisitng goal allows user to edit all elements of the goal', ()=> {
        cy.getByTestId('goalsModalOpen').click();
        cy.getByTestId('goalsFormOpen').click();
        cy.getByTestId('goalsFormName').type('Finn human');
        cy.getByTestId('goalsFormCurrent').type('25');
        cy.getByTestId('goalsFormTotal').type('100');
        cy.getByTestId('goalsFormSubmit').click();
        cy.getByTestId('goal-0').children().eq(1).children().eq(0).should('have.text', 'Finn human');
        cy.getByTestId('goalEdit-0').click();

        cy.getByTestId('goalsFormName').type('{selectall}{backspace}{selectall}{backspace}');
        cy.getByTestId('goalsFormName').type('Prison Mike');
        cy.getByTestId('goalsFormCurrent').type('{selectall}{backspace}{selectall}{backspace}');
        cy.getByTestId('goalsFormCurrent').type('0');
        cy.getByTestId('goalsFormTotal').type('{selectall}{backspace}{selectall}{backspace}');
        cy.getByTestId('goalsFormTotal').type('55');
        cy.getByTestId('goalsFormSubmit').click();

        cy.getByTestId('goalsListModal').children().should('have.length', 1);
        cy.getByTestId('goal-0').children().eq(1).children().eq(0).should('have.text', 'Prison Mike');

        cy.getByTestId('goalDelete-0').click();
        cy.getByTestId('goalsModalClose').click();
    })

    it('shows dialog box when canceling of exiting while editing a goal', ()=> {
        cy.getByTestId('goalsModalOpen').click();
        cy.getByTestId('goalsFormOpen').click();
        cy.getByTestId('goalsFormName').type('Dont look');
        cy.getByTestId('goalsFormCurrent').type('5');
        cy.getByTestId('goalsFormTotal').type('25');
        cy.getByTestId('goalsFormSubmit').click();
        cy.getByTestId('goalEdit-0').click();

        cy.getByTestId('goalsFormClose').click();

        cy.contains('Exit while editing your goal?');
        cy.getByTestId('dialogContinue').click();
        cy.getByTestId('goalsModalClose').click();

        cy.contains('Exit while editing your goal?');
        cy.getByTestId('dialogExit').click();
    })

    it('keeps form values & an open form when "continue editing" is pressed on the dialog box', ()=> {
        cy.getByTestId('goalsModalOpen').click();
        cy.getByTestId('goalsFormOpen').click();
        cy.getByTestId('goalsFormName').type('Unacceptable');
        cy.getByTestId('goalsFormCurrent').type('100');
        cy.getByTestId('goalsFormTotal').type('1000');
        cy.getByTestId('goalsFormSubmit').click();
        cy.getByTestId('goalEdit-0').click();

        cy.getByTestId('goalsFormClose').click();
        cy.contains('Exit while editing your goal?');
        cy.getByTestId('dialogContinue').click();

        cy.getByTestId('goalsFormName').find('input').invoke('val').should('equal', 'Unacceptable');

        cy.getByTestId('goalsModalClose').click();
        cy.getByTestId('dialogContinue').click();

        cy.getByTestId('goalsFormName').find('input').invoke('val').should('equal', 'Unacceptable');

        cy.getByTestId('dialogExit').click();
    })

    it('renders multiple goals', ()=> {
        cy.getByTestId('goalsModalOpen').click();
        cy.getByTestId('goalsFormOpen').click();
        cy.getByTestId('goalsFormName').type('Algebraic');
        cy.getByTestId('goalsFormCurrent').type('100');
        cy.getByTestId('goalsFormTotal').type('1000');
        cy.getByTestId('goalsFormSubmit').click();

        cy.getByTestId('goalsFormName').type('Bubblegum');
        cy.getByTestId('goalsFormCurrent').type('100');
        cy.getByTestId('goalsFormTotal').type('1000');
        cy.getByTestId('goalsFormSubmit').click();

        cy.contains('Bubblegum').should('exist');
        cy.contains('Algebraic').should('exist');
        cy.getByTestId('goalDelete-0').click();
        cy.getByTestId('goalDelete-0').click();

        cy.getByTestId('goalsModalClose').click();
    })

    it('both goal components reflect eachother', ()=> {
        cy.getByTestId('goalsModalOpen').click();
        cy.getByTestId('goalsFormOpen').click();
        cy.getByTestId('goalsFormName').type('Marceline');
        cy.getByTestId('goalsFormCurrent').type('0');
        cy.getByTestId('goalsFormTotal').type('2500');
        cy.getByTestId('goalsFormSubmit').click();

        cy.getByTestId('goalsFormName').type('Ice King');
        cy.getByTestId('goalsFormCurrent').type('10');
        cy.getByTestId('goalsFormTotal').type('20');
        cy.getByTestId('goalsFormSubmit').click();

        cy.getByTestId('goalsListModal').children().should('have.length', 2);
        cy.getByTestId('goalsList').children().should('have.length', 2);


        cy.getByTestId('goalDelete-0').click();

        cy.getByTestId('goalsListModal').children().should('have.length', 1);
        cy.getByTestId('goalsList').children().should('have.length', 1);

        cy.getByTestId('goalDelete-0').click();
        cy.getByTestId('goalsModalClose').click();
    })

    afterEach(() => {
        cy.getByTestId('cypress-navcontrol').click();
        cy.getByTestId('cypress-signout').click();
    })
})