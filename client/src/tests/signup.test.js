import Signup from '../pages/Signup';
import { render } from '@testing-library/react';
import { BrowserRouter } from "react-router-dom";

describe('testing login page', () => {
    it('testing correct login info', async () => {
        const { getByPlaceholderText, getByTestId } = render(<BrowserRouter><Signup/></BrowserRouter>);
        expect(getByPlaceholderText('Enter your username')).toBeTruthy();
        expect(getByPlaceholderText('Enter your password')).toBeTruthy();
        expect(getByTestId('submission_link').textContent).toBe('Submit');
        expect(getByTestId('login_link').textContent).toBe('Login');
    })
});
