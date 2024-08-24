import Profile from '../pages/Profile';
import { render } from '@testing-library/react';
import { BrowserRouter } from "react-router-dom";

describe('testing login page', () => {
    it('testing correct login info', async () => {
        const { getByPlaceholderText, getByTestId } = render(<BrowserRouter><Profile/></BrowserRouter>);
        expect(getByPlaceholderText('Enter your full name')).toBeTruthy();
        expect(getByPlaceholderText('max 50 words')).toBeTruthy();
        expect(getByPlaceholderText("If you're a student, say student")).toBeTruthy();
        expect(getByTestId('submission_link').textContent).toBe('Submit');
    })
});
