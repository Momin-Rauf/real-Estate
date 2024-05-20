import { render, fireEvent, screen, waitFor } from '@testing-library/react';
import SignIn from '../pages/SignIn';
import { Provider } from 'react-redux'; // Assuming you are using Redux for state management
import configureStore from 'redux-mock-store'; // Mocking Redux store
import { MemoryRouter } from 'react-router-dom'; // Mocking react-router-dom
import 'text-encoding';

// Mock Redux store
const mockStore = configureStore([]);

// Mock initial state
const initialState = {
  user: {
    loading: false,
    error: null,
  },
};

test('renders SignIn component', () => {
  render(
    <Provider store={mockStore(initialState)}>
      <MemoryRouter>
        <SignIn />
      </MemoryRouter>
    </Provider>
  );
  expect(screen.getByText('Sign In')).toBeInTheDocument();
});

test('submits the form with valid credentials', async () => {
  const store = mockStore(initialState);
  render(
    <Provider store={store}>
      <MemoryRouter>
        <SignIn />
      </MemoryRouter>
    </Provider>
  );

  // Fill in form inputs
  fireEvent.change(screen.getByPlaceholderText('Email'), { target: { value: 'test@example.com' } });
  fireEvent.change(screen.getByPlaceholderText('Password'), { target: { value: 'password123' } });

  // Mock fetch request
  global.fetch = jest.fn().mockResolvedValueOnce({ ok: true, json: () => Promise.resolve({ /* your response data */ }) });

  // Submit form
  fireEvent.click(screen.getByText('Log in'));

  // Wait for form submission
  await waitFor(() => {
    expect(global.fetch).toHaveBeenCalledTimes(1);
    // Add more assertions as needed
  });
});

test('displays error message for invalid credentials', async () => {
  const store = mockStore(initialState);
  render(
    <Provider store={store}>
      <MemoryRouter>
        <SignIn />
      </MemoryRouter>
    </Provider>
  );

  // Fill in form inputs with invalid credentials
  fireEvent.change(screen.getByPlaceholderText('Email'), { target: { value: 'invalid@example.com' } });
  fireEvent.change(screen.getByPlaceholderText('Password'), { target: { value: 'invalidpassword' } });

  // Mock fetch request
  global.fetch = jest.fn().mockResolvedValueOnce({ ok: false, json: () => Promise.resolve({ /* your error response data */ }) });

  // Submit form
  fireEvent.click(screen.getByText('Log in'));

  // Wait for error message to be displayed
  await waitFor(() => {
    expect(screen.getByText('Wrong Credentials')).toBeInTheDocument();
    // Add more assertions as needed
  });
});

// Add more test cases for error handling, navigation, etc. as needed
