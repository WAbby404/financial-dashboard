import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import TransactionsModal from './TransactionsModal';

beforeEach(() => {
  render(<TransactionsModal />);
});


test('TransactionsModal component renders', () => {
  expect(screen.getByText('TransactionsModal')).toBeInTheDocument();
});


test('Render buttons that can manage transactions and exit btn: x, edit, add, delete', () => {
  const allBtns = screen.getAllByRole('button');
  expect(allBtns.length).toEqual(4);
});


test('Add button enables form to add a transaction', () => {
  const editButton = screen.getByText('Edit');
  userEvent.click(editButton);
  const addButton = screen.getByText('Add');
  userEvent.click(addButton);
  const nameInput = screen.getByRole('textbox', {name: /name/i});
  expect(nameInput).toBeInTheDocument();
  expect(nameInput).not.toBeDisabled();
});


test('Edit button disables form until a transaction is selected', () => {
  const editButton = screen.getByText('Edit');
  userEvent.click(editButton);
  const nameInput = screen.getByRole('textbox', {name: /name/i});
  expect(nameInput).toBeDisabled();
});


test('Simulates entering data into inputs', () => {
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

test('When transaction is submitted, form fields reset and form closes', () =>{
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

  userEvent.click(addButton);
  nameInput = screen.getByRole('textbox', {name: /name/i}); 
  expect(nameInput.value).toEqual('');
  dateInput = screen.getByRole('textbox', {name: /Day of the month/i});
  expect(dateInput.value).toEqual('');
  valueInput = screen.getByRole('textbox', {name: /value/i});
  expect(valueInput.value).toEqual('');
});

