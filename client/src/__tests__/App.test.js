// App.test.js
import React from 'react';
import { render, fireEvent, screen, waitFor } from '@testing-library/react';
import App from '../App';
import '@testing-library/jest-dom';
describe('Seat Selection', () => {
  it('allows user to sign in and select seats based on group size', async () => {
    render(<App />);

    // Fill sign in form
    fireEvent.change(screen.getByPlaceholderText('Username'), {
      target: { value: 'testuser' },
    });
    fireEvent.change(screen.getByPlaceholderText('Password'), {
      target: { value: 'password123' },
    });
    fireEvent.change(screen.getByDisplayValue('User'), {
      target: { value: 'user' },
    });

    fireEvent.click(screen.getByText('Sign In'));

    // Wait for seat map to load
    await waitFor(() => {
      expect(screen.getByText('Cinema Seating Prototype')).toBeInTheDocument();
    });

    // Set group size to 2
    fireEvent.change(screen.getByLabelText(/Group Size/i), {
      target: { value: 2 },
    });

    // Try to select a seat in the first row (ensure it's enabled)
    const seatButton = screen.getAllByRole('button').find(btn =>
      btn.className.includes('available')
    );

    expect(seatButton).toBeInTheDocument();
    fireEvent.click(seatButton);

    // Confirm booking button should now be enabled
    expect(screen.getByText(/Confirm Booking/i)).toBeEnabled();
  });
});
