import React from 'react';
import { render, screen } from '@testing-library/react';
import UserApp from './UserApp';
import AdminApp from './AdminApp';

test('renders UserApp without crashing', () => {
  render(<UserApp />);
  // Kiểm tra một phần tử mà bạn biết sẽ có trong UserApp
  const userElement = screen.getByText(/Welcome to User Dashboard/i);

  expect(userElement).toBeInTheDocument();
});

test('renders AdminApp without crashing', () => {
  render(<AdminApp />);
  // Kiểm tra một phần tử mà bạn biết sẽ có trong AdminApp
  const adminElement = screen.getByText(/Welcome to Admin Dashboard/i);
  expect(adminElement).toBeInTheDocument();
});
