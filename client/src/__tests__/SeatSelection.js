// src/__tests__/SeatSelection.test.js
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import App from '../App';
import '@testing-library/jest-dom';

describe('Seat Selection Test Case', () => {
  test('Seat selection enables Confirm Booking button', () => {
    render(<App />);

    // Sign in as a normal user to access seating (simulate auth)
    fireEvent.change(screen.getByPlaceholderText(/Username/i), { target: { value: 'testuser' } });
    fireEvent.change(screen.getByPlaceholderText(/Password/i), { target: { value: 'password' } });
    fireEvent.click(screen.getByText(/Sign In/i));

    // Wait for seats to appear, select a seat button that is available and not disabled
    const seatButtons = screen.getAllByRole('button', { name: /1|2|3|4|5|6|7|8|9|10|11|12|13|14/ });
    const firstAvailableSeat = seatButtons.find(btn => !btn.disabled);
    fireEvent.click(firstAvailableSeat);

    // Confirm Booking button should be enabled now
    const confirmButton = screen.getByRole('button', { name: /Confirm Booking|Assign Seats/i });
    expect(confirmButton).not.toBeDisabled();
  });
});

