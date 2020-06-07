import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import App from './App';

test('renders boilerplate text', () => {
  const { getByText } = render(<App />);
  const linkElement = getByText(/streetbot-app/i);
  expect(linkElement).toBeInTheDocument();
});
