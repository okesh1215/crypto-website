import React, { Fragment, useState, useEffect } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import { connect } from 'react-redux';
import Swal from 'sweetalert2';
import axios from 'axios';
import CreateComment from './CreateComment';
import CommentItem from './CommentItem';
import CreateIcon from '@material-ui/icons/Create';
import EventNoteIcon from '@material-ui/icons/EventNote';
import { CommentCreated } from '../actions/CommentCreated';
import "./ReadmoreItem.css";

const ReadMoreItem = (props) => {
    const { isAuthenticated } = props;
    const { id } = useParams(); // Extract the post ID from the URL
    const history = useHistory();
    const [mypost, setMyPost] = useState({ Heading: '', description: '', author: {} });
    const [comments, setComments] = useState([]); // Initialize as an array


    // Fetch the post details when the component mounts or ID changes
    useEffect(() => {
        const fetchPost = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/discussion/post/${id}`);
                setMyPost(response.data);
            } catch (err) {
                console.error('Error fetching post:', err);
                Swal.fire('Error', 'Failed to load post details.', 'error');
            }
        };

        fetchPost();
    }, [id]);

    // Handle right-click for delete confirmation
    const handleRightClick = async (e) => {
        e.preventDefault(); // Prevent the default context menu
        const token = localStorage.getItem('token');

        if (!token) {
            Swal.fire('Unauthorized', 'Please log in to delete the post.', 'warning');
            return;
        }

        const decodedToken = JSON.parse(atob(token.split('.')[1]));
        const userId = decodedToken.User.id;
        const postAuthorId = mypost.author.id;

        if (userId !== postAuthorId) {
            Swal.fire('Forbidden', 'You are not authorized to delete this post.', 'error');
            return;
        }

        const result = await Swal.fire({
            title: 'Are you sure?',
            text: 'Do you want to delete this post?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes, delete it!',
            cancelButtonText: 'No, cancel!',
        });

        if (result.isConfirmed) {
            try {
                const response = await axios.delete('http://localhost:5000/discussion/deletepost', {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`,
                    },
                    data: { userId, postId: id, postauthorid: postAuthorId },
                });

                if (response.status === 200) {
                    Swal.fire('Deleted!', 'Your post has been deleted.', 'success');
                    history.push('/getpost');
                } else {
                    Swal.fire('Error', response.data.msg || 'Failed to delete the post.', 'error');
                }
            } catch (err) {
                Swal.fire('Error', 'Something went wrong while deleting the post.', 'error');
            }
        }
    };

    // Handle post update using a modal
    const handleUpdateClick = async () => {
        const { value: formValues } = await Swal.fire({
            title: 'Update Post',
            html: `
                <input 
                    id="swal-heading" 
                    class="swal2-input" 
                    placeholder="Heading" 
                    value="${mypost.Heading || ''}">
                <textarea 
                    id="swal-description" 
                    class="swal2-textarea" 
                    placeholder="Description">${mypost.description || ''}</textarea>
            `,
            focusConfirm: false,
            preConfirm: () => {
                const heading = document.getElementById('swal-heading').value.trim();
                const description = document.getElementById('swal-description').value.trim();

                if (!heading || !description) {
                    Swal.showValidationMessage('Both Heading and Description are required.');
                    return false;
                }

                return { Heading: heading, description };
            },
        });

        if (formValues) {
            const token = localStorage.getItem('token');

            if (!token) {
                Swal.fire('Unauthorized', 'Please log in to update the post.', 'warning');
                return;
            }

            const decodedToken = JSON.parse(atob(token.split('.')[1]));
            const userId = decodedToken.User.id;
            const postAuthorId = mypost.author.id;

            if (userId !== postAuthorId) {
                Swal.fire('Forbidden', 'You are not authorized to update this post.', 'error');
                return;
            }

            try {
                const response = await axios.put(
                    'http://localhost:5000/discussion/editpost',
                    { Heading: formValues.Heading, description: formValues.description },
                    {
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${token}`,
                        },
                        data: { userId, postId: id, postauthorid: postAuthorId },
                    }
                );

                if (response.status === 200) {
                    Swal.fire('Updated!', 'Your post has been updated.', 'success');
                    setMyPost((prev) => ({
                        ...prev,
                        Heading: formValues.Heading,
                        description: formValues.description,
                    }));
                } else {
                    Swal.fire('Error', response.data.msg || 'Failed to update the post.', 'error');
                }
            } catch (err) {
                Swal.fire('Error', 'Something went wrong while updating the post.', 'error');
            }
        }
    };

    return (
        <Fragment>
            <div className="rmpostItem" onContextMenu={handleRightClick}>
                <h1 className="rmTitle">{mypost.Heading}</h1>
                <p className="rmabout">
                    <span className="float-left">
                        <CreateIcon style={{ cursor: 'pointer' }} onClick={handleUpdateClick} />
                        Discussion initiated by {mypost.author.username || 'Unknown'}
                    </span>
                    <span className="float-right">
                        <EventNoteIcon /> {mypost.date?.split('T')[0] || 'N/A'}
                    </span>
                </p>
                <p className="rmContent">{mypost.description}</p>
                {isAuthenticated && <CreateComment />}
                <CommentItem id={id} />
            </div>
        </Fragment>
    );
};

const mapStateToProps = (state) => ({
    isAuthenticated: state.auth.isAuthenticated,
});

export default connect(mapStateToProps, { CommentCreated })(ReadMoreItem);
