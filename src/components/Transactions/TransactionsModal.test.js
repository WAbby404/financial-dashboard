import { render, screen, cleanup } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import TransactionsModal from './TransactionsModal';

beforeEach(() => {
  render(<TransactionsModal />);
});

afterEach(cleanup);

test('TransactionsModal component renders', () => {
  expect(screen.getByText('TransactionsModal')).toBeInTheDocument();
});

test('Manage Transactions button brings up form or disables it', () => {
  const manageBtn = screen.getByRole('button');
  userEvent.click(manageBtn);
  const nameInput = screen.getByRole('textbox', {name: /name/i});
  expect(nameInput).toBeDisabled();
  userEvent.click(manageBtn);
  expect(nameInput).not.toBeInTheDocument();
});

test('Add button enables form to add a transaction', () => {
  const manageBtn = screen.getByRole('button');
  userEvent.click(manageBtn);
  const nameInput = screen.getByRole('textbox', {name: /name/i});
  expect(nameInput).toBeDisabled();
  const addButton = screen.getByText('Add');
  userEvent.click(addButton);
  expect(nameInput).not.toBeDisabled();
});

test('Simulates entering data into inputs, and expects transaction to be in document', () => {
  const manageBtn = screen.getByRole('button');
  userEvent.click(manageBtn);
  const addButton = screen.getByText('Add');
  userEvent.click(addButton);

  const nameInput = screen.getByRole('textbox', {name: /name/i}); 
  userEvent.clear(nameInput);
  userEvent.type(nameInput, 'Dewie');
  expect(nameInput.value).toEqual('Dewie');

  userEvent.selectOptions(
    screen.getByRole('combobox'),
    screen.getByRole('option', { name: 'Entertainment' }),
  )
  expect(screen.getByRole('option', { name: 'Entertainment' }).selected).toBe(true);

  const dateInput = screen.getByRole('textbox', {name: /Day of the month/i}); 
  userEvent.type(dateInput, '10');
  expect(dateInput.value).toEqual('10');

  const posInput = screen.getByRole('button', {name: '+'} );
  userEvent.click(posInput);
  expect(posInput).toBeDisabled();

  const negInput = screen.getByRole('button', {name: '-'} );
  userEvent.click(negInput);
  expect(negInput).toBeDisabled();

  const valueInput = screen.getByRole('textbox', {name: /value/i}); 
  userEvent.type(valueInput, '100');
  expect(valueInput.value).toEqual('100');

  const reoccuringInput = screen.getByRole('button', {name: /switch/i} );
  userEvent.click(reoccuringInput);
  const reoccuringResponse = screen.getByText('yes');
  expect(reoccuringResponse).toBeInTheDocument();

});

test('Input values are validated upon submission', ()=> {
  const manageBtn = screen.getByRole('button');
  userEvent.click(manageBtn);
  const addButton = screen.getByText('Add');
  userEvent.click(addButton);

  // Checking for Empty values
  const submitBtn = screen.getByText('Submit');
  userEvent.click(submitBtn);
  const nameEmptyError = screen.queryByText(/Transaction name required./);
  const dateEmptyError = screen.queryByText(/Transaction date required./);
  const valueEmptyError = screen.queryByText(/Transaction value required./);
  expect(nameEmptyError).toBeInTheDocument();
  expect(dateEmptyError).toBeInTheDocument();
  expect(valueEmptyError).toBeInTheDocument();

  // Checking values have correct input types / boundaries
  const nameInput = screen.getByRole('textbox', {name: /name/i}); 
  userEvent.type(nameInput, 'Dewie: Fluffytron9000');

  const dateInput = screen.getByRole('textbox', {name: /Day of the month/i}); 
  userEvent.type(dateInput, 'Boots with the fur');

  const valueInput = screen.getByRole('textbox', {name: /Value/i}); 
  userEvent.type(valueInput, '1000999');

  userEvent.click(submitBtn);

  const nameError = screen.queryByText(/Transaction name cannot exceed 10 characters./);
  expect(nameError).toBeInTheDocument();
  const dateError = screen.queryByText(/Date must be a number between 1 and 30./);
  expect(dateError).toBeInTheDocument();
  const valueError = screen.queryByText(/Value must be a number between 0.01 and 1,000,000.00./);
  expect(valueError).toBeInTheDocument();
});

test('When transaction is submitted, form fields reset', () =>{
  const manageBtn = screen.getByRole('button');
  userEvent.click(manageBtn);
  const addButton = screen.getByText('Add');
  userEvent.click(addButton);

  let nameInput = screen.getByRole('textbox', {name: /name/i}); 
  userEvent.type(nameInput, 'Wegmans');
  let dateInput = screen.getByRole('textbox', {name: /Day of the month/i}); 
  userEvent.type(dateInput, '29');
  let valueInput = screen.getByRole('textbox', {name: /value/i}); 
  userEvent.type(valueInput, '248.12');
  const submitBtn = screen.getByText('Submit');
  userEvent.click(submitBtn);

  const successMessage = screen.getByText('Transaction was a success!');
  expect(successMessage).toBeInTheDocument();

  expect(nameInput.value).toEqual('');
  expect(dateInput.value).toEqual('');
  expect(valueInput.value).toEqual('');
});

test('Transaction persists when manage transaction form is closed', () => {
  const manageBtn = screen.getByRole('button');
  userEvent.click(manageBtn);
  const addButton = screen.getByText('Add');
  userEvent.click(addButton);

  let nameInput = screen.getByRole('textbox', {name: /name/i}); 
  userEvent.type(nameInput, 'Wegmans');
  let dateInput = screen.getByRole('textbox', {name: /Day of the month/i}); 
  userEvent.type(dateInput, '29');
  let valueInput = screen.getByRole('textbox', {name: /value/i}); 
  userEvent.type(valueInput, '248.12');
  const submitBtn = screen.getByText('Submit');
  userEvent.click(submitBtn);

  userEvent.click(manageBtn);
  const submitResponse = screen.getByRole('listitem');
  expect(submitResponse).toHaveTextContent('Wegmans');
});

test('Clicking the delete button enables a delete button on transactions', () => {
  const manageBtn = screen.getByRole('button');
  userEvent.click(manageBtn);
  const addButton = screen.getByText('Add');
  userEvent.click(addButton);

  let nameInput = screen.getByRole('textbox', {name: /name/i}); 
  userEvent.type(nameInput, 'Wegmans');
  let dateInput = screen.getByRole('textbox', {name: /Day of the month/i}); 
  userEvent.type(dateInput, '29');
  let valueInput = screen.getByRole('textbox', {name: /value/i}); 
  userEvent.type(valueInput, '248.12');
  const submitBtn = screen.getByText('Submit');
  userEvent.click(submitBtn);

  const deleteButton = screen.getByText('Delete');
  userEvent.click(deleteButton);

  const deleteButtons = screen.getAllByText('Delete');
  expect(deleteButtons.length).toEqual(2);
});

test('Clicking delete button deletes transaction', ()=>{
  const manageBtn = screen.getByRole('button');
  userEvent.click(manageBtn);
  const addButton = screen.getByText('Add');
  userEvent.click(addButton);

  let nameInput = screen.getByRole('textbox', {name: /name/i}); 
  userEvent.type(nameInput, 'Wegmans');
  let dateInput = screen.getByRole('textbox', {name: /Day of the month/i}); 
  userEvent.type(dateInput, '29');
  let valueInput = screen.getByRole('textbox', {name: /value/i}); 
  userEvent.type(valueInput, '248.12');
  const submitBtn = screen.getByText('Submit');
  userEvent.click(submitBtn);

  const deleteButton = screen.getByText('Delete');
  userEvent.click(deleteButton);
});

test('Edit button enables a select button on transactions and disables form', () => {
  const manageBtn = screen.getByRole('button');
  userEvent.click(manageBtn);
  const addButton = screen.getByText('Add');
  userEvent.click(addButton);

  let nameInput = screen.getByRole('textbox', {name: /name/i}); 
  userEvent.type(nameInput, 'Wegmans');
  let dateInput = screen.getByRole('textbox', {name: /Day of the month/i}); 
  userEvent.type(dateInput, '29');
  let valueInput = screen.getByRole('textbox', {name: /value/i}); 
  userEvent.type(valueInput, '248.12');
  const submitBtn = screen.getByText('Submit');
  userEvent.click(submitBtn);

  const deleteBtn = screen.getByText('Delete');
  userEvent.click(deleteBtn);

  const editBtn = screen.getByText('Edit');
  userEvent.click(editBtn);

  const selectButton = screen.getByText('Select');
  expect(selectButton).toBeInTheDocument();
  expect(nameInput).toBeDisabled();
});

test('Pressing the select button on a transaction populates form with that transactions values', ()=> {
  const manageBtn = screen.getByRole('button');
  userEvent.click(manageBtn);
  const addButton = screen.getByText('Add');
  userEvent.click(addButton);

  let nameInput = screen.getByRole('textbox', {name: /name/i}); 
  userEvent.type(nameInput, 'Wegmans');
  let dateInput = screen.getByRole('textbox', {name: /Day of the month/i}); 
  userEvent.type(dateInput, '29');
  let valueInput = screen.getByRole('textbox', {name: /value/i}); 
  userEvent.type(valueInput, '248.12');
  const submitBtn = screen.getByText('Submit');
  userEvent.click(submitBtn);

  const editBtn = screen.getByText('Edit');
  userEvent.click(editBtn);

  const selectButton = screen.getByText('Select');
  userEvent.click(selectButton);

  let newNameInput = screen.getByRole('textbox', {name: /name/i}); 
  expect(newNameInput.value).toEqual('Wegmans');
});

// test('Edit button disables form until a transaction is selected, then populates form with that transactions values', () => {
//   const manageBtn = screen.getByRole('button');
//   userEvent.click(manageBtn);
//   const editButton = screen.getByText('Edit');
//   userEvent.click(editButton);
//   const nameInput = screen.getByRole('textbox', {name: /name/i});
//   expect(nameInput).toBeDisabled();


// });




