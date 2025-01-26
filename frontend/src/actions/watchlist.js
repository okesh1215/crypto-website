import axios from 'axios';
import Swal from 'sweetalert2';
import { GETWATCHLIST, WATHCLISTERROR } from './Types';

import setauthtoken from '../utils/setauthtoken';

export const getWatchList = (userid) => async (dispatch) => {
    const config = {
        headers: {
            'Content-Type': 'application/json',
            'x-auth-token': localStorage.token,
            'userid': localStorage.userid
        }
    }
    if (localStorage.token) {
        setauthtoken(localStorage.token)
    }
    if (localStorage.userid) {
        axios.defaults.headers.common['userid'] = localStorage.userid;
    } else {
        delete axios.defaults.headers.common['x-auth-token'];
    }
    console.log('inside action', localStorage.userid, localStorage.token);

    try {
        const res = await axios.get('http://localhost:5000/watchlist');
        console.log('res' + res);
        dispatch({
            type: GETWATCHLIST,
            payload: res.data
        });

        // Success Alert
        Swal.fire({
            icon: 'success',
            title: 'Watchlist Loaded',
            text: 'Your watchlist has been successfully loaded!'
        });

    } catch (err) {
        dispatch({
            type: WATHCLISTERROR,
            payload: { msg: err.response.statusText, status: err.response.status }
        });

        // Error Alert
        Swal.fire({
            icon: 'error',
            title: 'Error Fetching Watchlist',
            text: 'There was an error fetching your watchlist. Please try again later.'
        });

        if (err) {
            console.log(err);
        }
    }
}

export const putWatchList = (mywatchlist) => async (dispatch) => {
    if (localStorage.token) {
        setauthtoken(localStorage.token)
    }
    if (localStorage.userid) {
        axios.defaults.headers.common['userid'] = localStorage.userid;
    } else {
        delete axios.defaults.headers.common['x-auth-token'];
    }
    console.log('inside action', localStorage.userid, localStorage.token);
    const config = {
        headers: {
            'Content-Type': 'application/json',
            'x-auth-token': localStorage.token,
            'userid': localStorage.userid
        }
    }
    const body = JSON.stringify({ mywatchlist });
    console.log(body);

    try {
        console.log('inside action');
        const res = await axios.put('http://localhost:5000/watchlist', body, config);

        console.log('res' + res);

        // Success Alert
        Swal.fire({
            icon: 'success',
            title: 'Watchlist Updated',
            text: 'Your watchlist has been successfully updated!'
        });

    } catch (err) {
        // Error Alert
        Swal.fire({
            icon: 'error',
            title: 'Error Updating Watchlist',
            text: 'There was an error updating your watchlist. Please try again later.'
        });

        console.log(err);
    }
}
