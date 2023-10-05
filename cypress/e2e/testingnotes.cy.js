
// context('todos', ()=> {
  // it
// })

// "seeding the database" - placing data within database before running a test

// cy.clearLocalStorage();

// commands, assertions, fixtures?

// test length of accounts array, .should('have.length', 0)
// test the children of an element getByTestId.children().first().should('have.text', 'blah');
// .contains - does the screen contain this element (optional) with this text (anywhere on the screen)
// .eq - equals ex: getByTestId('blah').eq(1) - will grab the second 'blah', like a zero-indexed array

// make tests fail first

// If I should always use data attributes, then when should I use cy.contains()?

// A rule of thumb is to ask yourself this:
// If the content of the element changed would you want the test to fail?

// If the answer is yes: then use cy.contains()
// If the answer is no: then use a data attribute.

// // This is how you asign elements to variables, this is called an 'alias"
// cy.get('a').as('links')
// cy.get('@links').first().click()

// You only need to do one thing to know whether you've coupled your tests incorrectly, or if one test is relying on the state of a previous one.
// Change it to it.only on the test and refresh the browser.

// cy.clock() - fakes system time, ex: cy.clock(new Date(1606453199 * 1000))
// cy.tick(1000) - move forward 1 second in time
// .should('have.been.calledWith')
// restore time to normal:

// cy.clock().then((clock) => {
  // clock.restore();
// })

// at 30 min, stubbing a notification from browser, onBeforeLoad, .stub
// https://www.youtube.com/watch?v=uNd9HxIHptY

// getByTestId().invoke('width').then(width => {
  // getByTestId.should('have.css', 'width').and('eq', `${width * 0.75}px`)
// })

// .focused() - get element that is focused
// .should('have.class', 'whateverclass')
// .should('have.value', 'whatever')
// .should('be.visible')
// .get('.todo-list li').filter('.completed').find('.toggle')
// ^ get the todo list items, filter them down to the completed ones, find child item with class toggle

// const filters = [{links:'Active', expectedLength: 3}, {links:'Completed', expectedLength: 1}]
// cy.wrap(filters) - puts the var filters in the context of cypress
//  .each(filter => {
  // 
// })