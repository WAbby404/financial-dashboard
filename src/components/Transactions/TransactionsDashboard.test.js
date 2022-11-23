import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import TransactionsDashboard from './TransactionsDashboard';

test('TransactionsDashboard and Transactions component renders', () => {
  render(<TransactionsDashboard/>);
  expect(screen.getByText('Transaction Dashboard')).toBeInTheDocument();
  expect(screen.getByText('Transactions')).toBeInTheDocument();
});

test('Renders a button to manage transactions', () => {
    render(<TransactionsDashboard/>);
    const manageButton = screen.getByRole('button');
    expect(manageButton.textContent).toEqual('Manage Transactions');
  });

test('Tracks whether Manage Transactions button was clicked and if it brought up the modal', () => {
    render(<TransactionsDashboard/>);
    const manageButton = screen.getByRole('button');
    userEvent.click(manageButton);
    const renderedModal = screen.getByText('TransactionsModal');
    expect(renderedModal).toBeInTheDocument();
  });

  test('When x button on Transaction Modal is pressed the modal is disabled', () => {
    render(<TransactionsDashboard />);
    const manageButton = screen.getByRole('button');
    userEvent.click(manageButton);
    const renderedModal = screen.getByText('TransactionsModal');
    expect(renderedModal).toBeInTheDocument();

    const closeButton = screen.getByText('x');
    userEvent.click(closeButton);
    expect(renderedModal).not.toBeInTheDocument();
  });
  