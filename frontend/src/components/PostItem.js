import React from 'react';
import { Link } from 'react-router-dom';
import QuestionAnswerIcon from '@material-ui/icons/QuestionAnswer';
import EmojiObjectsIcon from '@material-ui/icons/EmojiObjects';

const PostItem = (props) => {
    const { mypost } = props;

    // If there are posts, map through them and display
    if (mypost && mypost.length > 0) {
        return (
            mypost.map((list) => {
                return (
                    <div className="col-6" key={list._id}>
                        <Link to={`/readmore/${list._id}`}>
                            <div className="posts">
                                <p className="pAuthor"> 
                                    <EmojiObjectsIcon className="ico" /> 
                                    {list.author.username} 
                                </p>
                                <h3>{list.Heading}</h3>
                                <p className="datep">Posted on {list.date.split("T")[0]}</p>
                                <p className="descr">{list.description}</p>
                                <p><QuestionAnswerIcon /> {list.comments.length} Comments</p>
                                <p className="LinkRM">Read More...</p>
                            </div>
                        </Link>
                    </div>
                );
            })
        );
    } else {
        // If no posts, show a message and a button to navigate to the posts page
        return (
            <div className="no-posts-container">
                <h3>You haven't created any posts yet.</h3>
                <p>It looks like there are no posts available right now.</p>
                <Link to="/createpost">
                    <button className="create-post-button">Create a Post</button>
                </Link>
            </div>
        );
    }
}

export default PostItem;
