import Chat from '../pages/Chat';
import { render } from '@testing-library/react';
import { BrowserRouter } from "react-router-dom";

describe('testing login page', () => {
    it('testing correct login info', async () => {
        const { getByPlaceholderText, getByText } = render(<BrowserRouter><Chat/></BrowserRouter>);
        expect(getByPlaceholderText('Enter message')).toBeTruthy();
        expect(getByText((content, element) => element.tagName.toLowerCase() === 'form')).toBeTruthy();
        expect(getByText((content, element) => element.tagName.toLowerCase() === 'a' && content == 'Schedule Appointment')).toBeTruthy();
        expect(getByText((content, element) => element.tagName.toLowerCase() === 'button' && content == 'Send'));
    })
});
