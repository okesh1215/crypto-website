import axios from 'axios'
import Swal from 'sweetalert2'
import { POSTCREATED } from './Types'
import setauthtoken from '../utils/setauthtoken'
import { GETMYPOST } from './Types'
export const PostCreated = ({ Heading, description }) => async dispatch => {
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
    const post = { post: { Heading, description } };
    const body = JSON.stringify(post);

    try {
        const res = await axios.post('http://localhost:5000/discussion/create', body, config)
        console.log('res' + res);
        dispatch({
            type: POSTCREATED,
            payload: res.data
        })

        // Success Alert
        Swal.fire({
            icon: 'success',
            title: 'Post Created',
            text: 'Your post was successfully created!'
        });

    } catch (err) {
        console.log(err)

        // Error Alert
        Swal.fire({
            icon: 'error',
            title: 'Failed to Create Post',
            text: 'There was an issue creating your post. Please try again later.'
        });
    }
}

export const MyPost = () => async dispatch => {
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

    try {
        const res = await axios.get('http://localhost:5000/discussion/myposts', config);
        console.log('res' + res);
        dispatch({
            type: GETMYPOST,
            payload: res.data
        })

        // Success Alert
        Swal.fire({
            icon: 'success',
            title: 'Posts Fetched',
            text: 'Your posts were successfully fetched!'
        });

    } catch (err) {
        console.log(err)

        // Error Alert
        Swal.fire({
            icon: 'error',
            title: 'Failed to Fetch Posts',
            text: 'There was an issue fetching your posts. Please try again later.'
        });
    }
}
