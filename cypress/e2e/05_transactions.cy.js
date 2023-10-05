describe('Transactions Modal', () => {
    beforeEach(() => {
        cy.visit('http://localhost:3000/');
        //   cy.getByTestId('cypress-navcontrol').click();
        //   cy.getByTestId('cypress-signout').click();
          cy.getByTestId('cypress-email').type('test@gmail.com');
          cy.getByTestId('cypress-password').type('password');
          cy.get('form').contains('Login').click();
    })

    it('starts with no transactions & empty list case', ()=> {
        cy.getByTestId('transactionsList').children().should('have.length', 1);
        cy.contains('Transaction list empty, add a goal in Manage Transactions');
    })

    it('opens and exits transactions modal', ()=> {
        cy.getByTestId('transactionsModalOpen').click();
        cy.contains('Edit, Delete or');
        cy.getByTestId('transactionsModalClose').click();
        cy.contains('Edit, Delete or').should('not.exist');
    })

    it('opens and closes transaction form', ()=> {
        cy.getByTestId('transactionsModalOpen').click();
        cy.getByTestId('transactionsFormOpen').click();
        cy.getByTestId('transactionsFormTitle').should('exist');
        cy.getByTestId('transactionsFormAccount').should('exist');
        cy.getByTestId('transactionsFormCategory').should('exist');
        cy.getByTestId('transactionsFormValue').should('exist');
        cy.getByTestId('transactionsFormDate').should('exist');
        
        cy.getByTestId('transactionsFormClose').click();
        cy.getByTestId('transactionsModalClose').click();
    })

    it('requires transaction name, account, category, value & day of month', ()=> {
        cy.getByTestId('transactionsModalOpen').click();
        cy.getByTestId('transactionsFormOpen').click();
        cy.getByTestId('transactionsFormSubmit').click();

        cy.contains('p', 'Title required').should('exist');
        cy.contains('p', 'Account required').should('exist');
        cy.contains('p', 'Category required').should('exist');
        cy.contains('p', 'Date required').should('exist');
        cy.contains('p', 'Value required').should('exist');

        cy.getByTestId('transactionsModalClose').click();
    })

    it('transfer input appears when transfer category is selected', ()=> {
        cy.getByTestId('transactionsModalOpen').click();
        cy.getByTestId('transactionsFormOpen').click();

        cy.getByTestId('transactionsFormAccount').type('{downarrow}{enter}');
        cy.getByTestId('transactionsFormCategory').type('{downarrow}{downarrow}{downarrow}{downarrow}{downarrow}{downarrow}{downarrow}{downarrow}{enter}');
        cy.getByTestId('transactionsFormTransfer').should('exist');
    
        cy.getByTestId('transactionsModalClose').click();
    })

    it('requires "transfer to" input when transfer category is selected', ()=> {
        cy.getByTestId('transactionsModalOpen').click();
        cy.getByTestId('transactionsFormOpen').click();

        cy.getByTestId('transactionsFormAccount').type('{downarrow}{enter}');
        cy.getByTestId('transactionsFormCategory').type('{downarrow}{downarrow}{downarrow}{downarrow}{downarrow}{downarrow}{downarrow}{downarrow}{enter}');
        cy.getByTestId('transactionsFormSubmit').click();

        cy.contains('p', 'Transfer account required');
    
        cy.getByTestId('transactionsModalClose').click();
        
    })

    let monthDays = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    let currentMonth = monthDays[new Date().getMonth()];

    it('requires valid transaction name, value & day of month', ()=> {
        cy.getByTestId('transactionsModalOpen').click();
        cy.getByTestId('transactionsFormOpen').click();
        cy.getByTestId('transactionsFormTitle').type('qwertyuiopasdfghjkl')
        cy.getByTestId('transactionsFormAccount').type('{downarrow}{enter}');
        cy.getByTestId('transactionsFormCategory').type('{downarrow}{downarrow}{enter}');
        cy.getByTestId('transactionsFormValue').type('9000000000000000000000');
        cy.getByTestId('transactionsFormDate').type('45');

        cy.getByTestId('transactionsFormSubmit').click();

        cy.contains('p', 'Title cannot exceed 10 characters').should('exist');
        cy.contains('p', `Date must be a whole number between 1 and ${currentMonth}`).should(`exist`);
        cy.contains('p', 'Value cannot exceed $9,999,999.99').should('exist');
    
        cy.getByTestId('transactionsModalClose').click();
    })

    it('adds created transaction to transaction list & deletes the transaction', ()=> {
        cy.getByTestId('transactionsModalOpen').click();
        cy.getByTestId('transactionsFormOpen').click();
        cy.getByTestId('transactionsFormTitle').type('groceries')
        cy.getByTestId('transactionsFormAccount').type('{downarrow}{enter}');
        cy.getByTestId('transactionsFormCategory').type('{downarrow}{downarrow}{enter}');
        cy.getByTestId('transactionsFormValue').type('204.34');
        cy.getByTestId('transactionsFormDate').type('15');
        
        cy.getByTestId('transactionsFormSubmit').click();
        cy.getByTestId('transaction-0').should('exist');
        cy.getByTestId('transactionsListModal').children().should('have.length', 1);

        cy.getByTestId('transactionDelete-0').click();
        cy.getByTestId('transactionsListModal').children().should('have.length', 1);
        cy.getByTestId('transactionsFormClose').click();
        cy.getByTestId('transactionsModalClose').click();

        cy.contains('Transaction list empty, add a goal in Manage Transactions');
    })

    it('form shows correct categories based on which account type is selected', ()=> {
        cy.getByTestId('transactionsModalOpen').click();
        cy.getByTestId('transactionsFormOpen').click();
        cy.getByTestId('transactionsFormTitle').type('groceries')
        cy.getByTestId('transactionsFormAccount').type('{downarrow}{enter}');
        cy.getByTestId('transactionsFormCategory').type('{downarrow}{downarrow}{downarrow}{downarrow}{downarrow}{downarrow}{downarrow}{enter}');
        // debit will have: personal, housing, health, transportation, entertainment, food, money in & transfer
        // credit will have: personal, housing, health, transportation, entertainment, food & Credit Card Payment

        cy.getByTestId('transactionsFormCategory').find('input').invoke('val').should('equal', 'Money In');
        cy.getByTestId('transactionsFormCategory').type('{downarrow}{downarrow}{downarrow}{downarrow}{downarrow}{downarrow}{downarrow}{downarrow}{downarrow}{downarrow}{enter}');
        cy.getByTestId('transactionsFormCategory').find('input').invoke('val').should('equal', 'Transfer');

        cy.getByTestId('transactionsFormAccount').type('{downarrow}{enter}');
        cy.getByTestId('transactionsFormCategory').type('{downarrow}{downarrow}{downarrow}{downarrow}{downarrow}{downarrow}{downarrow}{enter}');
        cy.getByTestId('transactionsFormCategory').find('input').invoke('val').should('equal', 'Credit Card Payment');

        cy.getByTestId('transactionsModalClose').click();
    })

    it('success snackbar appears when transaction is created, deletion snackbar appears when transaction is deleted', ()=> {
        cy.getByTestId('transactionsModalOpen').click();
        cy.getByTestId('transactionsFormOpen').click();
        cy.getByTestId('transactionsFormTitle').type('dog toys')
        cy.getByTestId('transactionsFormAccount').type('{downarrow}{enter}');
        cy.getByTestId('transactionsFormCategory').type('{downarrow}{downarrow}{enter}');
        cy.getByTestId('transactionsFormValue').type('204.34');
        cy.getByTestId('transactionsFormDate').type('15');
        cy.getByTestId('transactionsFormSubmit').click();

        cy.contains('Transaction created!').should('exist');

        cy.getByTestId('transactionDelete-0').click();
        cy.getByTestId('transactionsListModal').children().should('have.length', 1);
        cy.getByTestId('transactionsFormClose').click();
        cy.getByTestId('transactionsModalClose').click();
    })

    it('clicking on edit button on a preexisitng transaction allows user to edit all elements of the transaction', ()=> {
        cy.getByTestId('transactionsModalOpen').click();
        cy.getByTestId('transactionsFormOpen').click();
        cy.getByTestId('transactionsFormTitle').type('bacon pan')
        cy.getByTestId('transactionsFormAccount').type('{downarrow}{enter}');
        cy.getByTestId('transactionsFormCategory').type('{downarrow}{downarrow}{enter}');
        cy.getByTestId('transactionsFormValue').type('25.99');
        cy.getByTestId('transactionsFormDate').type('9');
        cy.getByTestId('transactionsFormSubmit').click();
        cy.getByTestId('transactionEdit-0').click();

        cy.getByTestId('transactionsListModal').children().should('have.length', 1);

        cy.getByTestId('transactionsFormTitle').find('input').invoke('val').should('equal', 'bacon pan');
        cy.getByTestId('transactionsFormAccount').find('input').invoke('val').should('equal', 'Checking');
        cy.getByTestId('transactionsFormCategory').find('input').invoke('val').should('equal', 'Housing');
        cy.getByTestId('transactionsFormValue').find('input').invoke('val').should('equal', '25.99');
        cy.getByTestId('transactionsFormDate').find('input').invoke('val').should('equal', '9');

        cy.getByTestId('transactionsModalClose').click();
        cy.getByTestId('dialogExit').click();
    })

    it('shows dialog box when canceling or exiting while editing a transaction', ()=> {
        cy.getByTestId('transactionsModalOpen').click();
        cy.getByTestId('transactionsFormOpen').click();
        cy.getByTestId('transactionsFormTitle').type('totoro')
        cy.getByTestId('transactionsFormAccount').type('{downarrow}{enter}');
        cy.getByTestId('transactionsFormCategory').type('{downarrow}{downarrow}{enter}');
        cy.getByTestId('transactionsFormValue').type('12.40');
        cy.getByTestId('transactionsFormDate').type('2');
        cy.getByTestId('transactionsFormSubmit').click();
        cy.getByTestId('transactionEdit-0').click();


        cy.getByTestId('transactionsFormClose').click();
        cy.contains('Exit while editing your transaction?').should('exist');
        cy.getByTestId('dialogContinue').click();

        cy.getByTestId('transactionsModalClose').click();
        cy.contains('Exit while editing your transaction?').should('exist');
        cy.getByTestId('dialogExit').click();
    })

    it('keeps form values & an open form when "continue editing" is pressed on the dialog box', ()=> {
        cy.getByTestId('transactionsModalOpen').click();
        cy.getByTestId('transactionsFormOpen').click();
        cy.getByTestId('transactionsFormTitle').type('bananaphon')
        cy.getByTestId('transactionsFormAccount').type('{downarrow}{enter}');
        cy.getByTestId('transactionsFormCategory').type('{downarrow}{downarrow}{enter}');
        cy.getByTestId('transactionsFormValue').type('99.99');
        cy.getByTestId('transactionsFormDate').type('1');
        cy.getByTestId('transactionsFormSubmit').click();
        cy.getByTestId('transactionEdit-0').click();

        cy.getByTestId('transactionsFormClose').click();
        cy.getByTestId('dialogContinue').click();

        cy.getByTestId('transactionsFormTitle').find('input').invoke('val').should('equal', 'bananaphon');
        cy.getByTestId('transactionsFormAccount').find('input').invoke('val').should('equal', 'Checking');
        cy.getByTestId('transactionsFormCategory').find('input').invoke('val').should('equal', 'Housing');
        cy.getByTestId('transactionsFormValue').find('input').invoke('val').should('equal', '99.99');
        cy.getByTestId('transactionsFormDate').find('input').invoke('val').should('equal', '1');

        cy.getByTestId('transactionsModalClose').click();
        cy.getByTestId('dialogExit').click();
    })

    it('renders multiple transactions made by user' , ()=> {
        cy.getByTestId('transactionsModalOpen').click();
        cy.getByTestId('transactionsFormOpen').click();
        cy.getByTestId('transactionsFormTitle').type('badgerbadg')
        cy.getByTestId('transactionsFormAccount').type('{downarrow}{enter}');
        cy.getByTestId('transactionsFormCategory').type('{downarrow}{downarrow}{enter}');
        cy.getByTestId('transactionsFormValue').type('80');
        cy.getByTestId('transactionsFormDate').type('23');
        cy.getByTestId('transactionsFormSubmit').click();

        cy.getByTestId('transactionsFormTitle').type('muffins')
        cy.getByTestId('transactionsFormAccount').type('{downarrow}{enter}');
        cy.getByTestId('transactionsFormCategory').type('{downarrow}{downarrow}{enter}');
        cy.getByTestId('transactionsFormValue').type('10.99');
        cy.getByTestId('transactionsFormDate').type('20');
        cy.getByTestId('transactionsFormSubmit').click();

        cy.getByTestId('transactionsListModal').children().should('have.length', 2);

        cy.getByTestId('transactionDelete-0').click();
        cy.getByTestId('transactionDelete-0').click();
        cy.getByTestId('transactionsModalClose').click();
    })

    it('both transaction components reflect eachother', ()=> {
        cy.getByTestId('transactionsModalOpen').click();
        cy.getByTestId('transactionsFormOpen').click();
        cy.getByTestId('transactionsFormTitle').type('popcorn')
        cy.getByTestId('transactionsFormAccount').type('{downarrow}{enter}');
        cy.getByTestId('transactionsFormCategory').type('{downarrow}{downarrow}{enter}');
        cy.getByTestId('transactionsFormValue').type('10');
        cy.getByTestId('transactionsFormDate').type('10');
        cy.getByTestId('transactionsFormSubmit').click();

        cy.getByTestId('transactionsFormTitle').type('watch')
        cy.getByTestId('transactionsFormAccount').type('{downarrow}{enter}');
        cy.getByTestId('transactionsFormCategory').type('{downarrow}{downarrow}{enter}');
        cy.getByTestId('transactionsFormValue').type('75.66');
        cy.getByTestId('transactionsFormDate').type('20');
        cy.getByTestId('transactionsFormSubmit').click();

        cy.getByTestId('transactionsList').children().should('have.length', 2);
        cy.getByTestId('transactionsListModal').children().should('have.length', 2);
        cy.getByTestId('transactionDelete-0').click();
        cy.getByTestId('transactionDelete-0').click();

        cy.getByTestId('transactionsModalClose').click();
    })

    afterEach(() => {
        cy.getByTestId('cypress-navcontrol').click();
        cy.getByTestId('cypress-signout').click();
    })
})