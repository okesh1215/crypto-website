import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './CommentItem.css';

import { FaEdit, FaTrash } from 'react-icons/fa'; // Icons for Edit and Delete
import Swal from 'sweetalert2';

const CommentItem = (props) => {
    const { id } = props;
    const token = localStorage.getItem('token'); // Retrieve the token from localStorage
    const userId = localStorage.getItem('userid'); // Retrieve the user ID from localStorage

    const config = {
        headers: {
            postid: id,
            'x-auth-token': token,
            userid: userId,
        },
    };

    const [comments, setComments] = useState([]);

    useEffect(() => {
        axios.get('http://localhost:5000/comment/getcomments', config)
            .then((response) => {
                setComments(response.data);
            })
            .catch((err) => console.error(err));
    }, []);

    const handleEdit = async (commentId, commentAuthorId, currentText) => {
        if (userId !== commentAuthorId) {
            Swal.fire('Unauthorized', 'You can only edit your own comments.', 'error');
            return;
        }

        const { value: newText } = await Swal.fire({
            title: 'Edit Comment',
            input: 'textarea',
            inputLabel: 'Update your comment:',
            inputValue: currentText,
            showCancelButton: true,
        });

        if (newText && newText.trim()) {
            axios.put(
                'http://localhost:5000/comment/editcomment',
                { text: newText.trim() },
                {
                    headers: {
                        'x-auth-token': token,
                        userid: userId,
                        commentid: commentId,
                        commentauthorid: commentAuthorId,
                        'Content-Type': 'application/json',
                    },
                }
            )
                .then(() => {
                    Swal.fire('Success', 'Comment updated successfully!', 'success');
                    setComments((prev) =>
                        prev.map((c) =>
                            c._id === commentId ? { ...c, text: newText.trim() } : c
                        )
                    );
                })
                .catch((err) => {
                    console.error(err);
                    Swal.fire('Error', 'Failed to update comment.', 'error');
                });
        }
    };

    const handleDelete = (commentId, commentAuthorId) => {
        if (userId !== commentAuthorId) {
            Swal.fire('Unauthorized', 'You can only delete your own comments.', 'error');
            return;
        }

        Swal.fire({
            title: 'Are you sure?',
            text: 'This action cannot be undone.',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Delete',
            cancelButtonText: 'Cancel',
        }).then((result) => {
            if (result.isConfirmed) {
                axios.delete('http://localhost:5000/comment/deletecomment', {
                    headers: {
                        'x-auth-token': token,
                        userid: userId,
                        commentid: commentId,
                        commentauthorid: commentAuthorId,
                    },
                })
                    .then(() => {
                        Swal.fire('Deleted!', 'Comment deleted successfully.', 'success');
                        setComments((prev) => prev.filter((c) => c._id !== commentId));
                    })
                    .catch((err) => {
                        console.error(err);
                        Swal.fire('Error', 'Failed to delete comment.', 'error');
                    });
            }
        });
    };

    return (
        comments.map((comm) => (
            <div className="Comm" key={comm._id}>
                <div className="aboutComm">
                    <span className="nameComm">{comm.author.username} says...</span>
                    <span className="dateComm">{comm.date.split('T')[0]}</span>
                    <div className="actionIcons">
                        <FaEdit
                            className="editIcon"
                            onClick={() => handleEdit(comm._id, comm.author.id, comm.text)}
                        />
                        <FaTrash
                            className="deleteIcon"
                            onClick={() => handleDelete(comm._id, comm.author.id)}
                        />
                    </div>
                </div>
                <div className="commentText">{comm.text}</div>
            </div>
        ))
    );
};

export default CommentItem;
