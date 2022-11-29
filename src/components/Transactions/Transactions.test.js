import { render, screen, cleanup } from '@testing-library/react';
import Transactions from './Transactions';

afterEach(cleanup);

test('Transactions component renders', () => {
  render(<Transactions />);
  expect(screen.getByText('Transactions')).toBeInTheDocument();
});

test('Renders an empty message if empty', () => {
    render(<Transactions />);
    expect(screen.getByText('Transaction list empty')).toBeInTheDocument();
});

test('Should render a list item for a new transaction', () => {
  const item = { name: 'Wegmans', category: 'Food', date: 22, positive: false, reoccuring: false, value: 32.59, id: 1};
  render(<Transactions newTransaction={item}/>);
  const listItem = screen.getByRole('listitem');
  expect(listItem.innerHTML).toContain('Wegmans');
});


