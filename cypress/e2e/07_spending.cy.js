describe('Spending Modal', ()=> {
    beforeEach(() => {
        cy.visit('http://localhost:3000/');
        //   cy.getByTestId('cypress-navcontrol').click();
        //   cy.getByTestId('cypress-signout').click();
          cy.getByTestId('cypress-email').type('test@gmail.com');
          cy.getByTestId('cypress-password').type('password');
          cy.get('form').contains('Login').click();
    })

    it('starts with no accordion or graph rendering on screen', ()=> {
        cy.contains('Add transactions to see your spending chart');
    })

    it('shows graph and accordion when a transaction is added', ()=> {
        cy.getByTestId('transactionsModalOpen').click();
        cy.getByTestId('transactionsFormOpen').click();
        cy.getByTestId('transactionsFormTitle').type('stamps')
        cy.getByTestId('transactionsFormAccount').type('{downarrow}{enter}');
        cy.getByTestId('transactionsFormCategory').type('{downarrow}{downarrow}{enter}');
        cy.getByTestId('transactionsFormValue').type('10.50');
        cy.getByTestId('transactionsFormDate').type('1');
        cy.getByTestId('transactionsFormSubmit').click();
        cy.getByTestId('transactionsModalClose').click();

        cy.getByTestId('spendingGraph').should('exist');
        cy.getByTestId('spendingAccordion').should('exist');

        cy.getByTestId('transactionsModalOpen').click();
        cy.getByTestId('transactionDelete-0').click();
        cy.getByTestId('transactionsModalClose').click();
    })

    it('expands correct category on accordion when graph is clicked', ()=> {
        cy.getByTestId('transactionsModalOpen').click();
        cy.getByTestId('transactionsFormOpen').click();
        cy.getByTestId('transactionsFormTitle').type('stamps')
        cy.getByTestId('transactionsFormAccount').type('{downarrow}{enter}');
        cy.getByTestId('transactionsFormCategory').type('{downarrow}{downarrow}{enter}');
        cy.getByTestId('transactionsFormValue').type('10.50');
        cy.getByTestId('transactionsFormDate').type('1');
        cy.getByTestId('transactionsFormSubmit').click();
        cy.getByTestId('transactionsModalClose').click();

        cy.getByTestId('spendingGraph').click();
        cy.getByTestId('spendingAccordionTypographyName0').should('have.text', 'stamps');
        cy.getByTestId('spendingAccordionTypographyMoney0').should('have.text', '$10.5');

        cy.getByTestId('transactionsModalOpen').click();
        cy.getByTestId('transactionDelete-0').click();
        cy.getByTestId('transactionsModalClose').click();

    })
    
    it('renders multiple transactions under correct category of the accordion', ()=> {
        cy.getByTestId('transactionsModalOpen').click();
        cy.getByTestId('transactionsFormOpen').click();
        cy.getByTestId('transactionsFormTitle').type('cargo')
        cy.getByTestId('transactionsFormAccount').type('{downarrow}{enter}');
        cy.getByTestId('transactionsFormCategory').type('{downarrow}{downarrow}{enter}');
        cy.getByTestId('transactionsFormValue').type('1000.99');
        cy.getByTestId('transactionsFormDate').type('11');
        cy.getByTestId('transactionsFormSubmit').click();

        cy.getByTestId('transactionsFormTitle').type('waterbottl')
        cy.getByTestId('transactionsFormAccount').type('{downarrow}{enter}');
        cy.getByTestId('transactionsFormCategory').type('{downarrow}{downarrow}{enter}');
        cy.getByTestId('transactionsFormValue').type('9.9');
        cy.getByTestId('transactionsFormDate').type('18');
        cy.getByTestId('transactionsFormSubmit').click();
        cy.getByTestId('transactionsModalClose').click();

        cy.getByTestId('spendingGraph').click();
        cy.getByTestId('spendingAccordionTypographyName1').should('have.text', 'waterbottl');
        cy.getByTestId('spendingAccordionTypographyMoney1').should('have.text', '$9.9');
        cy.getByTestId('spendingAccordionTypographyName0').should('have.text', 'cargo');
        cy.getByTestId('spendingAccordionTypographyMoney0').should('have.text', '$1,000.99');

        cy.getByTestId('transactionsModalOpen').click();
        cy.getByTestId('transactionDelete-0').click();
        cy.getByTestId('transactionDelete-0').click();
        cy.getByTestId('transactionsModalClose').click();
    })

    it('adds up transactions to correct total above accordion', ()=> {
        cy.getByTestId('transactionsModalOpen').click();
        cy.getByTestId('transactionsFormOpen').click();
        cy.getByTestId('transactionsFormTitle').type('shoes')
        cy.getByTestId('transactionsFormAccount').type('{downarrow}{enter}');
        cy.getByTestId('transactionsFormCategory').type('{downarrow}{downarrow}{enter}');
        cy.getByTestId('transactionsFormValue').type('50.55');
        cy.getByTestId('transactionsFormDate').type('12');
        cy.getByTestId('transactionsFormSubmit').click();

        cy.getByTestId('transactionsFormTitle').type('muffins')
        cy.getByTestId('transactionsFormAccount').type('{downarrow}{enter}');
        cy.getByTestId('transactionsFormCategory').type('{downarrow}{downarrow}{enter}');
        cy.getByTestId('transactionsFormValue').type('50.50');
        cy.getByTestId('transactionsFormDate').type('17');
        cy.getByTestId('transactionsFormSubmit').click();
        cy.getByTestId('transactionsModalClose').click();

        cy.getByTestId('spendingTotal').should('have.text', '$101.05 total')

        cy.getByTestId('transactionsModalOpen').click();
        cy.getByTestId('transactionDelete-0').click();
        cy.getByTestId('transactionDelete-0').click();
        cy.getByTestId('transactionsModalClose').click();
    })

    // it('shows another accordion category when a transaction of another categroy is made', ()=> {
    //     cy.getByTestId('transactionsModalOpen').click();
    //     cy.getByTestId('transactionsFormOpen').click();
    //     cy.getByTestId('transactionsFormTitle').type('cat')
    //     cy.getByTestId('transactionsFormAccount').type('{downarrow}{enter}');
    //     cy.getByTestId('transactionsFormCategory').type('{downarrow}{downarrow}{enter}');
    //     cy.getByTestId('transactionsFormValue').type('100');
    //     cy.getByTestId('transactionsFormDate').type('9');
    //     cy.getByTestId('transactionsFormSubmit').click();

    //     cy.getByTestId('transactionsFormTitle').type('chipotle')
    //     cy.getByTestId('transactionsFormAccount').type('{downarrow}{enter}');
    //     cy.getByTestId('transactionsFormCategory').type('{downarrow}{downarrow}{downarrow}{downarrow}{enter}');
    //     cy.getByTestId('transactionsFormValue').type('36.55');
    //     cy.getByTestId('transactionsFormDate').type('7');
    //     cy.getByTestId('transactionsFormSubmit').click();
    //     cy.getByTestId('transactionsModalClose').click();

    //     cy.getByTestId('spendingAccordionBar0').should('have.text', 'Housing');
    //     cy.getByTestId('spendingAccordionBar1').should('have.text', 'Transportation');

    //     cy.getByTestId('transactionsModalOpen').click();
    //     cy.getByTestId('transactionDelete-0').click();
    //     cy.getByTestId('transactionDelete-0').click();
    //     cy.getByTestId('transactionsModalClose').click();
    // })

    it('when all transactions are deleted, graph and accordion disappear and 0 case appears', ()=> {
        cy.getByTestId('transactionsModalOpen').click();
        cy.getByTestId('transactionsFormOpen').click();
        cy.getByTestId('transactionsFormTitle').type('cat')
        cy.getByTestId('transactionsFormAccount').type('{downarrow}{enter}');
        cy.getByTestId('transactionsFormCategory').type('{downarrow}{downarrow}{enter}');
        cy.getByTestId('transactionsFormValue').type('100');
        cy.getByTestId('transactionsFormDate').type('9');
        cy.getByTestId('transactionsFormSubmit').click();
        cy.getByTestId('transactionDelete-0').click();
        cy.getByTestId('transactionsModalClose').click();

        cy.getByTestId('spendingGraph').should('not.exist');
        cy.getByTestId('spendingAccordion').should('not.exist');

        cy.contains('Add transactions to see your spending chart');
    })

    afterEach(() => {
        cy.getByTestId('cypress-navcontrol').click();
        cy.getByTestId('cypress-signout').click();
    })
})