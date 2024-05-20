import { render, fireEvent, screen } from '@testing-library/react';
import About from './pages/About'; // Import the component you want to test

test('loads items eventually', async () => {
  render(<About/>);
  
});
