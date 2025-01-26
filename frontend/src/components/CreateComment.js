import React, { useState, Fragment, useEffect } from 'react';
import { connect } from 'react-redux';
import { CommentCreated } from '../actions/CommentCreated';
import PropTypes from 'prop-types';
import { useParams } from 'react-router-dom';
import IconButton from '@material-ui/core/IconButton';
import SendIcon from '@material-ui/icons/Send';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import InputBase from '@material-ui/core/InputBase';
import Divider from '@material-ui/core/Divider';
import AddCommentIcon from '@material-ui/icons/AddComment';
import SweetAlert from 'sweetalert2'; // Import SweetAlert2
import axios from 'axios'; // If using axios for API calls

const CreateComment = ({ CommentCreated, isAuthenticated }) => {
  const { id } = useParams();

  // State for form and subscription type
  const [formData, setFormData] = useState({ description: '' });
  const [subscriptionType, setSubscriptionType] = useState(''); // Default value
  const [alertDisplayed, setAlertDisplayed] = useState(false); // Avoid multiple alerts

  const { description } = formData;

  // Fetcsimh subscription data
  useEffect(() => {
    const fetchSubscription = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        SweetAlert.fire({
          title: 'Not Logged In',
          text: 'Please log in to access this feature.',
          icon: 'error',
          confirmButtonText: 'Log In',
        }).then(() => {
          window.location.href = '/login';
        });
        return;
      }

      try {
        const response = await axios.get('http://localhost:5000/subscription/current', {
          headers: { 'x-auth-token': token },
        });
        setSubscriptionType(response.data.subscriptionType || 'Free Plan');
      } catch (err) {
        console.error('Failed to fetch subscription:', err.response || err.message);
        SweetAlert.fire({
          title: 'Error',
          text: 'Failed to load your subscription. Please try again later.',
          icon: 'error',
        });
      }
    };

    fetchSubscription();
  }, []);

  // Show SweetAlert if subscription type is insufficient
  useEffect(() => {
    if (
      subscriptionType &&
      subscriptionType !== 'Pro' &&
      subscriptionType !== 'Premium' &&
      !alertDisplayed
    ) {
      setAlertDisplayed(true);
      SweetAlert.fire({
        title: 'Upgrade Your Subscription',
        text: 'To access this feature, please upgrade to Pro or Premium.',
        icon: 'warning',
        confirmButtonText: 'Upgrade Now',
        
      }).then((result) => {
        if (result.isConfirmed) {
          window.location.href = '/subscription';
        }
      });
    }
  }, [subscriptionType, alertDisplayed]);

  // Form handling
  const onChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    if (subscriptionType === 'Pro' || subscriptionType === 'Premium') {
      CommentCreated({ description, id });
      setFormData({ description: '' }); // Clear form
    } else {
      SweetAlert.fire({
        title: 'Access Denied',
        text: 'You need a Pro or Premium subscription to comment.',
        icon: 'error',
      });
    }
  };

  const useStyles = makeStyles((theme) => ({
    root: {
      padding: '2px 4px',
      display: 'flex',
      alignItems: 'center',
      width: '100%',
    },
    input: {
      marginLeft: theme.spacing(1),
      flex: 1,
    },
    iconButton: {
      padding: 10,
    },
    divider: {
      height: 28,
      margin: 4,
    },
  }));

  const classes = useStyles();

  return (
    <Fragment>
      <form className="form" onSubmit={onSubmit}>
        <div className="form-group">
          <Paper component="form" className={classes.root}>
            <IconButton className={classes.iconButton} aria-label="menu">
              <AddCommentIcon />
            </IconButton>
            <InputBase
              multiline
              name="description"
              rows={1}
              value={description}
              onChange={onChange}
              className={classes.input}
              placeholder="Add a comment to this discussion"
              inputProps={{ 'aria-label': 'add a comment' }}
            />
            <Divider className={classes.divider} orientation="vertical" />
            <IconButton
              onClick={onSubmit}
              color="primary"
              className={classes.iconButton}
              aria-label="directions"
            >
              <SendIcon />
            </IconButton>
          </Paper>
        </div>
      </form>
    </Fragment>
  );
};

CreateComment.propTypes = {
  isAuthenticated: PropTypes.bool,
  CommentCreated: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  isAuthenticated: state.auth.isAuthenticated,
});

export default connect(mapStateToProps, { CommentCreated })(CreateComment);
