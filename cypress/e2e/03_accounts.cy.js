

describe('Accounts Modal', () => {
    beforeEach(() => {
      cy.visit('http://localhost:3000/');
    //   cy.getByTestId('cypress-navcontrol').click();
    //   cy.getByTestId('cypress-signout').click();
      cy.getByTestId('cypress-email').type('test@gmail.com');
      cy.getByTestId('cypress-password').type('password');
      cy.get('form').contains('Login').click();
    })
  
    it('Starts with $0 in each account: Checking, Credit Card & Savings', () => {
        cy.getByTestId('accountsList').children().should('have.length', 3);
        cy.getByTestId('account-0').should('have.value', 0);
        cy.getByTestId('account-1').should('have.value', 0);
        cy.getByTestId('account-2').should('have.value', 0);
    })
  
    it('opens and exits account modal', () => {
        cy.getByTestId('accountsModalOpen').click();
        cy.contains('Edit, Delete or');
        cy.getByTestId('accountsModalClose').click();
        cy.contains('Edit, Delete or').should('not.exist');
    })
  
    it('opens and closes account form', ()=> {
        cy.getByTestId('accountsModalOpen').click();
        cy.getByTestId('accountsFormOpen').click();
        cy.getByTestId('accountsFormName').should('exist');
        cy.getByTestId('accountsFormType').should('exist');
        cy.getByTestId('accountsFormClose').click();
        cy.getByTestId('accountsModalClose').click();
    })
  
    it('requires account name and type', () => {
        cy.getByTestId('accountsModalOpen').click();
        cy.getByTestId('accountsFormOpen').click();
        cy.getByTestId('accountsFormSubmit').click();
        cy.contains('p', 'Name required').should('exist');
        cy.contains('p', 'Type required').should('exist');
        cy.getByTestId('accountsFormClose').click();
        cy.getByTestId('accountsModalClose').click();
    })
  
    it('adds created account to account list & deletes the account', ()=> {
        cy.getByTestId('accountsModalOpen').click();
        cy.getByTestId('accountsFormOpen').click();
        cy.getByTestId('accountsFormName').type('Dewie');
        cy.getByTestId('accountsFormType').click().type('{downarrow}{enter}');
        cy.getByTestId('accountsFormSubmit').click();
        cy.getByTestId('account-3').should('exist');
        cy.getByTestId('accountsListModal').children().should('have.length', 4);

        cy.getByTestId('accountDelete-3').click();
        cy.getByTestId('accountsListModal').children().should('have.length', 3);
        cy.getByTestId('accountsFormClose').click();
        cy.getByTestId('accountsModalClose').click();
    })

    it('success snackbar appears when account is created, and deletion snackbar appears when account is deleted', ()=> {
        cy.getByTestId('accountsModalOpen').click();
        cy.getByTestId('accountsFormOpen').click();
        cy.getByTestId('accountsFormName').type('Dewie');
        cy.getByTestId('accountsFormType').click().type('{downarrow}{enter}');
        cy.getByTestId('accountsFormSubmit').click();
        cy.contains('Account created!').should('exist');

        cy.getByTestId('accountDelete-3').click();
        cy.contains('Account deleted').should('exist');
        cy.getByTestId('accountsFormClose').click();
        cy.getByTestId('accountsModalClose').click();
    })

    it('requires valid account name', () => {
        cy.getByTestId('accountsModalOpen').click();
        cy.getByTestId('accountsFormOpen').click();
        cy.getByTestId('accountsFormName').type('Dewie');
        cy.getByTestId('accountsFormType').click().type('{downarrow}{enter}');
        cy.getByTestId('accountsFormSubmit').click();

        cy.getByTestId('accountsFormName').type('My dog and his corgi butt');
        cy.getByTestId('accountsFormSubmit').click();

        cy.contains('p', 'Name cannot exceed 12 characters').should('exist');

        cy.getByTestId('accountsFormClose').click();
        cy.getByTestId('accountsFormOpen').click();

        cy.getByTestId('accountsFormName').type('Dewie');
        cy.getByTestId('accountsFormType').click().type('{downarrow}{enter}');
        cy.getByTestId('accountsFormSubmit').click();

        cy.contains('p', 'Name must be unique').should('exist');

        cy.getByTestId('accountDelete-3').click();
        cy.getByTestId('accountsFormClose').click();
        cy.getByTestId('accountsModalClose').click();
  
    })
  
    it('clicking on edit button on a preexisting account allows user to edit name and type of account', ()=> {
        cy.getByTestId('accountsModalOpen').click();
        cy.getByTestId('accountsFormOpen').click();
        cy.getByTestId('accountsFormName').type('Dewie');
        cy.getByTestId('accountsFormType').click().type('{downarrow}{enter}');
        cy.getByTestId('accountsFormSubmit').click();
        cy.getByTestId('accountEdit-3').click();

        cy.getByTestId('accountsFormName').type('{selectall}{backspace}{selectall}{backspace}');
        cy.getByTestId('accountsFormName').type('Prison Mike');
        cy.getByTestId('accountsFormType').click().type('{downarrow}{downarrow}{downarrow}{enter}');
        cy.getByTestId('accountsFormSubmit').click();

        cy.getByTestId('accountsListModal').children().should('have.length', 4);
        cy.getByTestId('account-3').children().eq(0).children().eq(0).should('have.text', 'Prison MikeCredit');

        cy.getByTestId('accountDelete-3').click();
        cy.getByTestId('accountsModalClose').click();

    })
  
    it('shows dialog box when canceling or exiting while editing an account', ()=> {
        cy.getByTestId('accountsModalOpen').click();
        cy.getByTestId('accountsFormOpen').click();
        cy.getByTestId('accountsFormName').type('Dewie');
        cy.getByTestId('accountsFormType').click().type('{downarrow}{enter}');
        cy.getByTestId('accountsFormSubmit').click();
        cy.getByTestId('accountEdit-3').click();

        cy.getByTestId('accountsFormClose').click();

        cy.contains('Exit while editing your account?');
        cy.getByTestId('dialogContinue').click();
        cy.getByTestId('accountsModalClose').click();

        cy.contains('Exit while editing your account?');
        cy.getByTestId('dialogExit').click();
    })

    it('keeps form values & an open form when "continue editing" is pressed on the dialog box', ()=> {
        cy.getByTestId('accountsModalOpen').click();
        cy.getByTestId('accountsFormOpen').click();
        cy.getByTestId('accountsFormName').type('Dewie');
        cy.getByTestId('accountsFormType').click().type('{downarrow}{enter}');
        cy.getByTestId('accountsFormSubmit').click();
        cy.getByTestId('accountEdit-3').click();

        cy.getByTestId('accountsFormClose').click();
        cy.contains('Exit while editing your account?');
        cy.getByTestId('dialogContinue').click();

        cy.getByTestId('accountsFormName').find('input').invoke('val').should('equal', 'Dewie');

        cy.getByTestId('accountsModalClose').click();
        cy.getByTestId('dialogContinue').click();

        cy.getByTestId('accountsFormName').find('input').invoke('val').should('equal', 'Dewie');

        cy.getByTestId('accountsModalClose').click();
        cy.getByTestId('dialogExit').click();
    })

    it('renders multiple accounts made by user', ()=> {
        cy.getByTestId('accountsModalOpen').click();
        cy.getByTestId('accountsFormOpen').click();
        cy.getByTestId('accountsFormName').type('Dewie');
        cy.getByTestId('accountsFormType').click().type('{downarrow}{enter}');
        cy.getByTestId('accountsFormSubmit').click();

        cy.getByTestId('accountsFormName').type('Red knight');
        cy.getByTestId('accountsFormType').click().type('{downarrow}{enter}');
        cy.getByTestId('accountsFormSubmit').click();

        cy.getByTestId('accountsListModal').children().should('have.length', 5);

        cy.getByTestId('accountDelete-3').click();
        cy.getByTestId('accountDelete-3').click();

        cy.getByTestId('accountsModalClose').click();
    })

    it('both accounts components reflect eachother', () => {
        cy.getByTestId('accountsModalOpen').click();
        cy.getByTestId('accountsFormOpen').click();
        cy.getByTestId('accountsFormName').type('Dewie');
        cy.getByTestId('accountsFormType').click().type('{downarrow}{enter}');
        cy.getByTestId('accountsFormSubmit').click();

        cy.getByTestId('accountsFormName').type('Dwight');
        cy.getByTestId('accountsFormType').click().type('{downarrow}{downarrow}{downarrow}{enter}');
        cy.getByTestId('accountsFormSubmit').click();

        cy.getByTestId('accountsList').children().should('have.length', 5);
        cy.getByTestId('accountsListModal').children().should('have.length', 5);
        cy.getByTestId('accountDelete-3').click();
        cy.getByTestId('accountDelete-3').click();

        cy.getByTestId('accountsModalClose').click();
    })



    // need to work on this one
    it('reflects transactions in correct account with correct amount', ()=> {
        cy.getByTestId('transactionsModalOpen').click();
        cy.getByTestId('transactionsFormOpen').click();
        cy.getByTestId('transactionsFormTitle').type('groceries')
        cy.getByTestId('transactionsFormAccount').type('{downarrow}{enter}');
        cy.getByTestId('transactionsFormCategory').type('{downarrow}{downarrow}{enter}');
        cy.getByTestId('transactionsFormValue').type('109.88');
        cy.getByTestId('transactionsFormDate').type('15');
        cy.getByTestId('transactionsFormSubmit').click();
        cy.getByTestId('transactionsModalClose').click();

        cy.contains('-$109.88');

        cy.getByTestId('transactionsModalOpen').click();
        cy.getByTestId('transactionDelete-0').click();
        cy.getByTestId('transactionsModalClose').click();
        cy.getByTestId('account-total0').children();
        cy.contains('$0.00');
    })

    it('multiple transactions add up to correct total in account', () => {
        cy.getByTestId('transactionsModalOpen').click();
        cy.getByTestId('transactionsFormOpen').click();
        cy.getByTestId('transactionsFormTitle').type('wegmans')
        cy.getByTestId('transactionsFormAccount').type('{downarrow}{enter}');
        cy.getByTestId('transactionsFormCategory').type('{downarrow}{downarrow}{enter}');
        cy.getByTestId('transactionsFormValue').type('435.24');
        cy.getByTestId('transactionsFormDate').type('11');
        cy.getByTestId('transactionsFormSubmit').click();

        cy.getByTestId('transactionsFormTitle').type('dog num2')
        cy.getByTestId('transactionsFormAccount').type('{downarrow}{enter}');
        cy.getByTestId('transactionsFormCategory').type('{downarrow}{downarrow}{enter}');
        cy.getByTestId('transactionsFormValue').type('2000.50');
        cy.getByTestId('transactionsFormDate').type('8');
        cy.getByTestId('transactionsFormSubmit').click();
        
        cy.getByTestId('transactionsModalClose').click();
        cy.contains('-$2,435.74');

        cy.getByTestId('transactionsModalOpen').click();
        cy.getByTestId('transactionDelete-0').click();
        cy.getByTestId('transactionDelete-0').click();

        cy.getByTestId('transactionsModalClose').click();
    })

    it('when transaction is deleted, account reflects the deletion', ()=> {
        cy.getByTestId('transactionsModalOpen').click();
        cy.getByTestId('transactionsFormOpen').click();
        cy.getByTestId('transactionsFormTitle').type('downtown')
        cy.getByTestId('transactionsFormAccount').type('{downarrow}{enter}');
        cy.getByTestId('transactionsFormCategory').type('{downarrow}{downarrow}{enter}');
        cy.getByTestId('transactionsFormValue').type('80.70');
        cy.getByTestId('transactionsFormDate').type('24');
        cy.getByTestId('transactionsFormSubmit').click();

        cy.getByTestId('transactionsFormTitle').type('concert')
        cy.getByTestId('transactionsFormAccount').type('{downarrow}{enter}');
        cy.getByTestId('transactionsFormCategory').type('{downarrow}{downarrow}{enter}');
        cy.getByTestId('transactionsFormValue').type('165.34');
        cy.getByTestId('transactionsFormDate').type('17');
        cy.getByTestId('transactionsFormSubmit').click();

        
        cy.getByTestId('transactionsModalClose').click();
        cy.contains('-$246.04');

        cy.getByTestId('transactionsModalOpen').click();
        cy.getByTestId('transactionDelete-0').click();
        cy.getByTestId('transactionsModalClose').click();
        cy.contains('-$165.34');

        cy.getByTestId('transactionsModalOpen').click();
        cy.getByTestId('transactionDelete-0').click();
        cy.getByTestId('transactionsModalClose').click();
    })

    it('transfer transaction is reflected in both accounts: the original account & the transfer to account including when they are deleted' , ()=> {
        cy.getByTestId('transactionsModalOpen').click();
        cy.getByTestId('transactionsFormOpen').click();
        cy.getByTestId('transactionsFormTitle').type('nachos')
        cy.getByTestId('transactionsFormAccount').type('{downarrow}{enter}');
        cy.getByTestId('transactionsFormCategory').type('{downarrow}{downarrow}{downarrow}{downarrow}{downarrow}{downarrow}{downarrow}{downarrow}{enter}');
        cy.getByTestId('transactionsFormTransfer').type('{downarrow}{enter}');
        cy.getByTestId('transactionsFormValue').type('10.10');
        cy.getByTestId('transactionsFormDate').type('5');
        cy.getByTestId('transactionsFormSubmit').click();
    
        cy.getByTestId('transactionsModalClose').click();

        cy.contains('-$10.1');
        cy.contains('$10.10');

        cy.getByTestId('transactionsModalOpen').click();
        cy.getByTestId('transactionsFormOpen').click();
        cy.getByTestId('transactionsFormTitle').type('gma money')
        cy.getByTestId('transactionsFormAccount').type('{downarrow}{enter}');
        cy.getByTestId('transactionsFormCategory').type('{downarrow}{downarrow}{downarrow}{downarrow}{downarrow}{downarrow}{downarrow}{downarrow}{enter}');
        cy.getByTestId('transactionsFormTransfer').type('{downarrow}{enter}');
        cy.getByTestId('transactionsFormValue').type('25.66');
        cy.getByTestId('transactionsFormDate').type('9');
        cy.getByTestId('transactionsFormSubmit').click();

        cy.getByTestId('transactionsModalClose').click();

        cy.contains('-$35.76');
        cy.contains('$35.76');

        cy.getByTestId('transactionsModalOpen').click();
        cy.getByTestId('transactionDelete-0').click();
        cy.getByTestId('transactionsModalClose').click();

        cy.contains('-$10.1');
        cy.contains('$10.10');

        cy.getByTestId('transactionsModalOpen').click();
        cy.getByTestId('transactionDelete-0').click();
        cy.getByTestId('transactionsModalClose').click();
    })

    afterEach(() => {
        cy.getByTestId('cypress-navcontrol').click();
        cy.getByTestId('cypress-signout').click();
    })
  
  })