describe('Analytics modal' , ()=> {
    beforeEach(() => {
        cy.visit('http://localhost:3000/');
        //   cy.getByTestId('cypress-navcontrol').click();
        //   cy.getByTestId('cypress-signout').click();
        cy.getByTestId('cypress-email').type('test@gmail.com');
        cy.getByTestId('cypress-password').type('password');
        cy.get('form').contains('Login').click();
    })

    it('starts with no graph & empty values', ()=> {
        cy.getByTestId('analyticsIncome').should('have.text', '$0.00');
        cy.getByTestId('analyticsExpenses').should('have.text', '$0.00');
        cy.getByTestId('analyticsCashflow').should('have.text', '$0.00');
        cy.getByTestId('analyticsSpent').should('have.text', '%0.00');
        cy.getByTestId('analyticsGraph').should('not.exist');

        cy.getByTestId('analyticsDebit').should('have.text', '$0.00');
        cy.getByTestId('analyticsSavings').should('have.text', '$0.00');
        cy.getByTestId('analyticsCC').should('have.text', '$0.00');
        cy.getByTestId('analyticsTotal').should('have.text', '$0.00');
    })

    it('populates correct fields when a transaction is added & graph appears', ()=> {
        cy.getByTestId('transactionsModalOpen').click();
        cy.getByTestId('transactionsFormOpen').click();
        cy.getByTestId('transactionsFormTitle').type('cheerios')
        cy.getByTestId('transactionsFormAccount').type('{downarrow}{enter}');
        cy.getByTestId('transactionsFormCategory').type('{downarrow}{downarrow}{enter}');
        cy.getByTestId('transactionsFormValue').type('10');
        cy.getByTestId('transactionsFormDate').type('2');
        cy.getByTestId('transactionsFormSubmit').click();
        cy.getByTestId('transactionsModalClose').click();

        cy.getByTestId('transactionsModalOpen').click();
        cy.getByTestId('transactionsFormOpen').click();
        cy.getByTestId('transactionsFormTitle').type('frosted')
        cy.getByTestId('transactionsFormAccount').type('{downarrow}{enter}');
        cy.getByTestId('transactionsFormCategory').type('{downarrow}{downarrow}{downarrow}{downarrow}{downarrow}{downarrow}{downarrow}{enter}');
        cy.getByTestId('transactionsFormValue').type('1000.99');
        cy.getByTestId('transactionsFormDate').type('10');
        cy.getByTestId('transactionsFormSubmit').click();
        cy.getByTestId('transactionsModalClose').click();

        cy.getByTestId('analyticsExpenses').should('have.text', '$10.00');
        cy.getByTestId('analyticsIncome').should('have.text', '$1,000.99');
        cy.getByTestId('analyticsCashflow').should('have.text', '$990.99');
        cy.getByTestId('analyticsSpent').should('have.text', '%99.00');
        cy.getByTestId('analyticsDebit').should('have.text', '$990.99');
        cy.getByTestId('analyticsTotal').should('have.text', '$990.99');
        cy.getByTestId('analyticsGraph').should('exist');

        cy.getByTestId('transactionsModalOpen').click();
        cy.getByTestId('transactionDelete-0').click();
        cy.getByTestId('transactionDelete-0').click();
        cy.getByTestId('transactionsModalClose').click();
    })

    it('when transactions are deleted, values are reflected in values', ()=> {
        cy.getByTestId('transactionsModalOpen').click();
        cy.getByTestId('transactionsFormOpen').click();
        cy.getByTestId('transactionsFormTitle').type('beach')
        cy.getByTestId('transactionsFormAccount').type('{downarrow}{enter}');
        cy.getByTestId('transactionsFormCategory').type('{downarrow}{downarrow}{enter}');
        cy.getByTestId('transactionsFormValue').type('100');
        cy.getByTestId('transactionsFormDate').type('15');
        cy.getByTestId('transactionsFormSubmit').click();
        cy.getByTestId('transactionsModalClose').click();

        cy.getByTestId('analyticsExpenses').should('have.text', '$100.00');
        cy.getByTestId('analyticsCashflow').should('have.text', '-$100.00');
        cy.getByTestId('analyticsSpent').should('have.text', '%10000');
        cy.getByTestId('analyticsDebit').should('have.text', '-$100.00');
        cy.getByTestId('analyticsTotal').should('have.text', '-$100.00');

        cy.getByTestId('transactionsModalOpen').click();
        cy.getByTestId('transactionsFormOpen').click();
        cy.getByTestId('transactionsFormTitle').type('tacos')
        cy.getByTestId('transactionsFormAccount').type('{downarrow}{enter}');
        cy.getByTestId('transactionsFormCategory').type('{downarrow}{downarrow}{enter}');
        cy.getByTestId('transactionsFormValue').type('200');
        cy.getByTestId('transactionsFormDate').type('20');
        cy.getByTestId('transactionsFormSubmit').click();
        cy.getByTestId('transactionsModalClose').click();

        cy.getByTestId('analyticsExpenses').should('have.text', '$300.00');
        cy.getByTestId('analyticsCashflow').should('have.text', '-$300.00');
        cy.getByTestId('analyticsSpent').should('have.text', '%30000');
        cy.getByTestId('analyticsDebit').should('have.text', '-$300.00');
        cy.getByTestId('analyticsTotal').should('have.text', '-$300.00');

        cy.getByTestId('transactionsModalOpen').click();
        cy.getByTestId('transactionDelete-0').click();
        cy.getByTestId('transactionsModalClose').click();

        cy.getByTestId('analyticsExpenses').should('have.text', '$100.00');
        cy.getByTestId('analyticsCashflow').should('have.text', '-$100.00');
        cy.getByTestId('analyticsSpent').should('have.text', '%10000');
        cy.getByTestId('analyticsDebit').should('have.text', '-$100.00');
        cy.getByTestId('analyticsTotal').should('have.text', '-$100.00');

        cy.getByTestId('transactionsModalOpen').click();
        cy.getByTestId('transactionDelete-0').click();
        cy.getByTestId('transactionsModalClose').click();

        cy.getByTestId('analyticsIncome').should('have.text', '$0.00');
        cy.getByTestId('analyticsExpenses').should('have.text', '$0.00');
        cy.getByTestId('analyticsCashflow').should('have.text', '$0.00');
        cy.getByTestId('analyticsSpent').should('have.text', '%0.00');
        cy.getByTestId('analyticsGraph').should('not.exist');

        cy.getByTestId('analyticsDebit').should('have.text', '$0.00');
        cy.getByTestId('analyticsSavings').should('have.text', '$0.00');
        cy.getByTestId('analyticsCC').should('have.text', '$0.00');
        cy.getByTestId('analyticsTotal').should('have.text', '$0.00');
    })

    it('when all transactions are deleted, numbers go back to 0 & graph shows 0 case', ()=> {
        cy.getByTestId('transactionsModalOpen').click();
        cy.getByTestId('transactionsFormOpen').click();
        cy.getByTestId('transactionsFormTitle').type('beach')
        cy.getByTestId('transactionsFormAccount').type('{downarrow}{enter}');
        cy.getByTestId('transactionsFormCategory').type('{downarrow}{downarrow}{enter}');
        cy.getByTestId('transactionsFormValue').type('100');
        cy.getByTestId('transactionsFormDate').type('15');
        cy.getByTestId('transactionsFormSubmit').click();
        cy.getByTestId('transactionsModalClose').click();

        cy.getByTestId('transactionsModalOpen').click();
        cy.getByTestId('transactionDelete-0').click();
        cy.getByTestId('transactionsModalClose').click();

        cy.getByTestId('analyticsIncome').should('have.text', '$0.00');
        cy.getByTestId('analyticsExpenses').should('have.text', '$0.00');
        cy.getByTestId('analyticsCashflow').should('have.text', '$0.00');
        cy.getByTestId('analyticsSpent').should('have.text', '%0.00');
        cy.getByTestId('analyticsGraph').should('not.exist');

        cy.getByTestId('analyticsDebit').should('have.text', '$0.00');
        cy.getByTestId('analyticsSavings').should('have.text', '$0.00');
        cy.getByTestId('analyticsCC').should('have.text', '$0.00');
        cy.getByTestId('analyticsTotal').should('have.text', '$0.00');
    })

    afterEach(() => {
        cy.getByTestId('cypress-navcontrol').click();
        cy.getByTestId('cypress-signout').click();
    })
} )