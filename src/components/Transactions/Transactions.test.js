import { render, screen } from '@testing-library/react';
import Transactions from './Transactions';

test('Transactions component renders', () => {
  render(<Transactions />);
  expect(screen.getByText('Transactions')).toBeInTheDocument();
});

test('Renders an empty message if empty', () => {
    render(<Transactions />);
    expect(screen.getByText('Transaction list empty')).toBeInTheDocument();
});

test('Should render a sorted list of items', () => {
  const items = [{ name: 'Wegmans', category: 'Food', date: 22, positive: false, reoccuring: false, value: 32.59, id: 1},
                { name: 'kPot', category: 'Food', date: 3, positive: false, reoccuring: false, value: 99.73, id: 2},
                { name: 'gma', category: 'Income', date: 11, positive: true, reoccuring: true, value: 25, id: 3},
                { name: 'guitar', category: 'goal', date: 5, positive: true, reoccuring: true, value: 10, id: 4}];

  render(<Transactions allTransactions={items}/>);
  const renderedItems = screen.getAllByTestId("date");
  // Get dates in a descended order array and checks if they are the same as rendered on screen
  const renderedDates = items.sort((a,b) => b.date - a.date ).map((item) => `${item.date}`);
  // console.log(renderedDates);
  expect(renderedItems.length).toEqual(items.length);
  expect(renderedItems.map((item) => item.textContent)).toEqual(renderedDates);
});

test('Transactions have an edit and delete button', () => {
  const items = [{ name: 'Wegmans', category: 'Food', date: 22, positive: false, reoccuring: false, value: 32.59, id: 1},
                { name: 'kPot', category: 'Food', date: 3, positive: false, reoccuring: false, value: 99.73, id: 2},
                { name: 'gma', category: 'Income', date: 11, positive: true, reoccuring: true, value: 25, id: 3},
                { name: 'guitar', category: 'goal', date: 5, positive: true, reoccuring: true, value: 10, id: 4}];

  render(<Transactions allTransactions={items}/>);
  const editButtons = screen.getAllByText('Edit');
  expect(editButtons.length).toEqual(items.length);
  const deleteButtons = screen.getAllByText('Delete');
  expect(deleteButtons.length).toEqual(items.length);
});

// test('Edit Button Allows you to change values of a transaction', () => {

// });
