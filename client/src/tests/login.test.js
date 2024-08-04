import axios from 'axios';
import Login from '../pages/Login';
import MockAdapter from 'axios-mock-adapter';
import { render, fireEvent, waitFor, screen, configure, getByPlaceholderText } from '@testing-library/react';
import { ToastContainer, toast } from "react-toastify";
import { BrowserRouter } from "react-router-dom";

describe('testing login page', () => {
    it('testing correct login info', async () => {
        /*const client = process.env.REACT_APP_CLIENT;
        const server = process.env.REACT_APP_SERVER;
        const requestData = { username: 'freeman12', password: 'asdf' };
        const responseData = { status: true, msg: 'Logged in successfully' };
        const url = `${client}/login`;*/

        const { getByPlaceholderText, getByTestId } = render(<BrowserRouter><Login/></BrowserRouter>);
        expect(getByPlaceholderText('Enter your username')).toBeTruthy();
        expect(getByPlaceholderText('Enter your password')).toBeTruthy();
        expect(getByTestId('submission_link').textContent).toBe('Submit');
        expect(getByTestId('signup_link').textContent).toBe('Signup');

        /*waitFor(async () => {
            expect(await screen.findByText('Logged in successfully')).toBeInTheDocument();
        });*/
    })
});
