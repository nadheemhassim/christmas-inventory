import { render, screen } from '@testing-library/react';
import App from './App';

test('renders Christmas Inventory System', () => {
  render(<App />);
  const headingElement = screen.getByText(/Christmas Inventory System/i);
  expect(headingElement).toBeInTheDocument();
});

test('renders Products button', () => {
  render(<App />);
  const productsButton = screen.getByText(/Products/i);
  expect(productsButton).toBeInTheDocument();
});