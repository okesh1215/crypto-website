import axios from 'axios'
import {COMMENTCREATED, GETMYPOST} from './Types'
import setauthtoken from '../utils/setauthtoken'
import Swal from "sweetalert2";

export const CommentCreated = ({ description, id }) => async (dispatch) => {
    console.log(id);

    // Validation: Check if the comment text is empty
    if (!description || description.trim() === "") {
        Swal.fire({
            icon: "error",
            title: "Empty Comment",
            text: "Comment text cannot be empty. Please write something before posting.",
        });
        return; // Stop further execution
    }

    const config = {
        headers: {
            "Content-Type": "application/json",
            "x-auth-token": localStorage.token,
            userid: localStorage.userid,
            postid: id,
        },
    };

    if (localStorage.token) {
        setauthtoken(localStorage.token);
    }
    if (localStorage.userid) {
        axios.defaults.headers.common["userid"] = localStorage.userid;
    } else {
        delete axios.defaults.headers.common["x-auth-token"];
    }
    if (localStorage.postid) {
        axios.defaults.headers.common["postid"] = localStorage.postid;
    } else {
        delete axios.defaults.headers.common["x-auth-token"];
    }

    console.log(
        "inside action",
        localStorage.userid,
        localStorage.token,
        localStorage.postid
    );

    const comment = { text: description };
    const body = JSON.stringify(comment);

    try {
        const res = await axios.post(
            "http://localhost:5000/comment/create",
            body,
            config
        );

        dispatch({
            type: COMMENTCREATED,
            payload: res.data,
        });

        // Success Alert
        Swal.fire({
            icon: "success",
            title: "Comment Posted",
            text: "Your comment was successfully added!",
        });
    } catch (err) {
        console.log(err);

        // Error Alert
        Swal.fire({
            icon: "error",
            title: "Failed to Post Comment",
            text: "There was an issue posting your comment. Please try again.",
        });
    }
};








//==========================================================================


export const MyPost = () => async (dispatch) => {
    const config = {
        headers: {
            "Content-Type": "application/json",
            "x-auth-token": localStorage.token,
            userid: localStorage.userid,
        },
    };

    if (localStorage.token) {
        setauthtoken(localStorage.token);
    }
    if (localStorage.userid) {
        axios.defaults.headers.common["userid"] = localStorage.userid;
    } else {
        delete axios.defaults.headers.common["x-auth-token"];
    }

    try {
        const res = await axios.get(
            "http://localhost:5000/discussion/myposts",
            config
        );

        console.log("res" + res);

        dispatch({
            type: GETMYPOST,
            payload: res.data,
        });

        // Success Alert
        Swal.fire({
            icon: "success",
            title: "My Posts Loaded",
            text: "Your posts were successfully fetched!",
        });
    } catch (err) {
        console.log(err);

        // Error Alert
        Swal.fire({
            icon: "error",
            title: "Failed to Load Posts",
            text: "There was an issue fetching your posts. Please try again later.",
        });
    }
};
