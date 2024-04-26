import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom'; // Import jest-dom to extend Jest with custom matchers
import AppFunctional from './AppFunctional'; // Adjust the import path as necessary

describe('AppFunctional component sanity tests', () => {
  test('sanity - component renders without crashing', () => {
    render(<AppFunctional />);
    expect(screen.getByText('Submit')).toBeInTheDocument();
  });

  test('sanity - button labels are correct', () => {
    render(<AppFunctional />);
    expect(screen.getByText('LEFT')).toBeInTheDocument();
    expect(screen.getByText('UP')).toBeInTheDocument();
    expect(screen.getByText('RIGHT')).toBeInTheDocument();
    expect(screen.getByText('DOWN')).toBeInTheDocument();
    expect(screen.getByText('reset')).toBeInTheDocument();
  });

  test('sanity - initial steps count is zero', () => {
    render(<AppFunctional />);
    expect(screen.getByText('You moved 0 times')).toBeInTheDocument();
  });

  test('sanity - moving increases step count', () => {
    render(<AppFunctional />);
    const upButton = screen.getByText('UP');
    fireEvent.click(upButton);
    expect(screen.getByText('You moved 1 time')).toBeInTheDocument(); // Check for correct pluralization as well
  });

  test('sanity - email input starts empty and can be changed', () => {
    render(<AppFunctional />);
    const input = screen.getByPlaceholderText('Type email');
    expect(input.value).toBe(''); // Check initial state is empty
    fireEvent.change(input, { target: { value: 'test@example.com' } });
    expect(input.value).toBe('test@example.com'); // Check input changes correctly
  });
});
