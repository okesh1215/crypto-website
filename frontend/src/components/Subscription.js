import React, { useState, useEffect } from 'react';
import './Subscription.css';
import axios from 'axios';
import { connect } from 'react-redux';
import { setAlert } from '../actions/alert'; // Assuming you have an alert action to show feedback
import Swal from 'sweetalert2'; // SweetAlert2 for showing alerts

const Subscription = ({ setAlert }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [userSubscription, setUserSubscription] = useState('');
  const [walletBalance, setWalletBalance] = useState(0);

  // Effect to handle subscription changes when page loads
  useEffect(() => {
    const fetchSubscriptionAndBalance = async () => {
      const token = localStorage.getItem('token');

      if (!token) {
        console.error('No token found in localStorage');
        setAlert('You are not logged in. Please log in to check your subscription.', 'error');
        return;
      }

      try {
        // Fetch subscription details
        const subscriptionResponse = await axios.get('http://localhost:5000/subscription/current', {
          headers: { 'x-auth-token': token },
        });

        // Set user subscription from the server response
        setUserSubscription(subscriptionResponse.data.subscriptionType || 'Free Plan');

        // Fetch wallet balance
        const walletResponse = await axios.get('http://localhost:5000/wallet/wallet', {
          headers: {
            'x-auth-token': token,
          },
        });

        // Set wallet balance
        setWalletBalance(walletResponse.data.balance);
      } catch (err) {
        console.error('Failed to fetch subscription or wallet:', err.response || err.message);
        setAlert('Failed to load your data. Please try again.', 'error');
      }
    };

    fetchSubscriptionAndBalance();
  }, [setAlert]);

  // Handle subscription plan selection
  const handleSubscription = async (plan) => {
    const planCost = {
      Basic: 0,
      Pro: 15,
      Premium: 25,
    };
  
    const planHierarchy = {
      Basic: 0,
      Pro: 1,
      Premium: 2,
    };
  
    const token = localStorage.getItem('token');
  
    if (!token) {
      console.error('No token found in localStorage');
      setAlert('You are not logged in. Please log in to subscribe.', 'error');
      return;
    }
  
    if (planHierarchy[plan] < planHierarchy[userSubscription]) {
      Swal.fire({
        icon: 'info',
        title: 'Already Subscribed',
        text: `You are already on a higher subscription plan. Downgrading is not allowed.`,
      });
      return;
    }
  
    if (walletBalance < planCost[plan]) {
      Swal.fire({
        icon: 'error',
        title: 'Insufficient Balance',
        text: `You need at least $${planCost[plan]} to subscribe to the ${plan} plan.`,
      });
      return;
    }
  
    Swal.fire({
      icon: 'warning',
      title: 'Confirm Subscription',
      text: `Are you sure you want to subscribe to the ${plan} plan for $${planCost[plan]}?`,
      showCancelButton: true,
      confirmButtonText: 'Yes, Subscribe!',
      cancelButtonText: 'Cancel',
    }).then(async (result) => {
      if (result.isConfirmed) {
        setIsLoading(true);
        try {
          // Deduct balance via /withdraw endpoint
          await axios.post(
            'http://localhost:5000/wallet/withdraw',
            { amount: planCost[plan] },
            {
              headers: { 'x-auth-token': token },
            }
          );
  
          // Subscribe the user via /subscribe endpoint
          const response = await axios.post(
            'http://localhost:5000/subscription/subscribe',
            { subscriptionType: plan },
            {
              headers: { 'x-auth-token': token },
            }
          );
  
          // Update subscription and wallet balance in the UI
          setAlert(response.data.message, 'success');
          setUserSubscription(plan);
          setWalletBalance((prevBalance) => prevBalance - planCost[plan]);
        } catch (err) {
          console.error('Subscription update or withdrawal failed:', err.response || err.message);
          setAlert('Failed to complete the subscription process. Please try again.', 'error');
        } finally {
          setIsLoading(false);
        }
      }
    });
  };
  

  return (
    <div className="subscription-container">
      <div className="subscription-header">Choose Your Subscription Plan</div>

      {/* Current Subscription */}
      <div className="current-subscription">
        <h3>Your current plan: {userSubscription || 'Free Plan'}</h3>
      </div>

      {/* Benefits Section */}
      <div className="subscription-benefits">
        <div className="benefit-title">Why Subscribe?</div>
        <ul>
          <li>View watchlist and also able to post threads - Free Plan</li>
          <li>Access to comment on other posts - Pro Plan</li>
          <li>Access to the latest news - Premium Plan</li>
        </ul>
      </div>

      {/* Subscription Options */}
      <div className="subscription-options">
        <div className="option-card">
          <div className="ribbon basic">Free</div>
          <div className="option-title">Basic Plan</div>
          <div className="option-price">$0/month</div>
          <button
            className="subscribe-button"
            onClick={() => handleSubscription('Basic')}
            disabled={isLoading || userSubscription === 'Basic' || userSubscription === 'Pro' || userSubscription === 'Premium'}
          >
            {isLoading ? 'Subscribing...' : 'Subscribe'}
          </button>
        </div>

        <div className="option-card">
          <div className="ribbon pro">Pro</div>
          <div className="option-title">Pro Plan</div>
          <div className="option-price">$15/month</div>
          <button
            className="subscribe-button"
            onClick={() => handleSubscription('Pro')}
            disabled={isLoading || userSubscription === 'Pro' || userSubscription === 'Premium'}
          >
            {isLoading ? 'Subscribing...' : 'Subscribe'}
          </button>
        </div>

        <div className="option-card">
          <div className="ribbon premium">Premium</div>
          <div className="option-title">Premium Plan</div>
          <div className="option-price">$25/month</div>
          <button
            className="subscribe-button"
            onClick={() => handleSubscription('Premium')}
            disabled={isLoading || userSubscription === 'Premium'}
          >
            {isLoading ? 'Subscribing...' : 'Subscribe'}
          </button>
        </div>
      </div>
    </div>
  );
};

// Action creator to handle alerts (optional)
const mapDispatchToProps = {
  setAlert,
};

export default connect(null, mapDispatchToProps)(Subscription);
