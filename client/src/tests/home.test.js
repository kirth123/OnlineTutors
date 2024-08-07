import Home from '../pages/Home';
import { render } from '@testing-library/react';
import { BrowserRouter } from "react-router-dom";

describe('testing login page', () => {
    it('testing correct login info', async () => {
        const { getByPlaceholderText, getByTestId, getByText } = render(<BrowserRouter><Home/></BrowserRouter>);
        expect(getByPlaceholderText('Look for tutor')).toBeTruthy();
        expect(getByText((content, element) => element.tagName.toLowerCase() === 'a' && content == 'Chats')).toBeTruthy();
        expect(getByText((content, element) => element.tagName.toLowerCase() === 'a' && content == 'Profile')).toBeTruthy();
        expect(getByText((content, element) => element.tagName.toLowerCase() === 'a' && content == 'Logout')).toBeTruthy();
        expect(getByText((content, element) => element.tagName.toLowerCase() === 'button' && content == 'Search'));
    })
});
