import axios from 'axios';
import { setAlert } from "./alert.js";
import {
    REGISTER_FAILURE,
    REGISTER_SUCCESS,
    LOGIN_FAILURE,
    LOGIN_SUCCESS,
    GETWATCHLIST,
    WATHCLISTERROR,
    LOGOUT
} from './Types';
import Swal from "sweetalert2";


// Regular expression for the email validation
const emailRegex = /^[a-zA-Z0-9]+@(gmail\.com|in|bl\.students\.amrita\.edu|bl\.amrita\.edu)$/;

export const register = ({ name, email, password }) => async (dispatch) => {
    const config = {
        headers: {
            'Content-Type': 'application/json',
        },
    };

    // Validate the email format using regex
    if (!emailRegex.test(email)) {
        Swal.fire({
            icon: 'error',
            title: 'Invalid Email',
            text: 'Please enter a valid email address (e.g., yourname@gmail.com, yourname@bl.amrita.edu, etc.)',
        });
        return; // Stop the function if the email is invalid
    }

    const body = JSON.stringify({ name, email, password });

    try {
        console.log(body);
        const res = await axios.post('http://localhost:5000/register', body, config);

        console.log('res: ' + res);

        dispatch({
            type: REGISTER_SUCCESS,
            payload: res.data,
        });

        // Success Alert
        Swal.fire({
            icon: 'success',
            title: 'Registration Successful',
            text: 'Welcome to Cryptex! You can now Explore.',
        });
    } catch (err) {
        console.log(err);

        // Check for duplicate email error
        if (err.response && err.response.data && err.response.data.message && err.response.data.message.includes('duplicate key error')) {
            // Duplicate key error
            Swal.fire({
                icon: 'error',
                title: 'Registration Failed',
                text: 'This email is already registered. Please use a different email address.',
            });
        } else {
            // Handle other errors
            const errors = err.response?.data?.errors;
            if (errors) {
                errors.forEach((error) => {
                    dispatch(setAlert(error.msg, 'danger'));

                    // Error Alert for each validation issue
                    Swal.fire({
                        icon: 'error',
                        title: 'Registration Failed',
                        text: error.msg,
                    });
                });
            }
        }

        dispatch({
            type: REGISTER_FAILURE,
        });
    }
};


// LOGIN USER
export const login = (email, password) => async (dispatch) => {
    const config = {
        headers: {
            'Content-Type': 'application/json',
        },
    };

    const body = JSON.stringify({ email, password });

    try {
        const res = await axios.post('http://localhost:5000/login', body, config);

        const { token, userid, subscriptionType } = res.data;

        if (token) {
            localStorage.setItem('token', token);
            localStorage.setItem('userid', userid);
            localStorage.setItem('subscriptionType', subscriptionType);
        }

        dispatch({
            type: LOGIN_SUCCESS,
            payload: res.data,
        });

        // Success Alert
        Swal.fire({
            icon: 'success',
            title: 'Login Successful',
            text: 'Welcome back!',
        });
    } catch (err) {
        dispatch({
            type: LOGIN_FAILURE,
        });

        // Error Alert
        Swal.fire({
            icon: 'error',
            title: 'Login Failed',
            text: 'Invalid email or password. Please try again.',
        });
    }
};

// Get Watchlist
export const getWatchList = () => async (dispatch) => {
    try {
        console.log('inside action');
        const res = await axios.get('http://localhost:5000/watchlist');

        console.log('Watchlist response: ', res);

        dispatch({
            type: GETWATCHLIST,
            payload: res.data,
        });

        // Success Alert
        Swal.fire({
            icon: 'success',
            title: 'Watchlist Loaded',
            text: 'Your watchlist was successfully fetched!',
        });
    } catch (err) {
        dispatch({
            type: WATHCLISTERROR,
            payload: { msg: err.response?.statusText, status: err.response?.status },
        });

        console.log('Error fetching watchlist: ', err);

        // Error Alert
        Swal.fire({
            icon: 'error',
            title: 'Failed to Load Watchlist',
            text: 'Unable to fetch your watchlist. Please try again later.',
        });
    }
};

// Logout user
export const logout = () => (dispatch) => {
    // Clear the localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('userid');
    localStorage.removeItem('subscriptionType');

    dispatch({ type: LOGOUT });

    // Info Alert
    Swal.fire({
        icon: 'info',
        title: 'Logged Out',
        text: 'You have been logged out successfully.',
    });
};
