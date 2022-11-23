import { render, screen } from '@testing-library/react';
import Dashboard from './Dashboard';

test('Renders the Dashboard component', ()=> {
    render(<Dashboard/>);
    expect(screen.getByText('Dashboard')).toBeInTheDocument();
});