import React, { Fragment, useState } from 'react';
import { Link, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { login } from '../actions/auth';
import { TextField, Button } from '@material-ui/core';
import Swal from 'sweetalert2'; // Import SweetAlert2
import "./Login.css";
import Header from "./Header";

const Login = ({ login, isAuthenticated, error }) => {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });

    const { email, password } = formData;

    // Update state for each input
    const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

    const onSubmit = async e => {
        e.preventDefault();
        await login(email, password); // Dispatch the login action

        // Display error message using SweetAlert2 if login fails
        if (error) {
            Swal.fire({
                icon: 'error',
                title: 'Login Failed',
                text: error || 'User not found. Please check your credentials.',
            });
        }
    };

    // Redirect to CoinSummary if authenticated
    if (localStorage.userid) {
        return <Redirect to='/CoinSummary' />;
    }

    return (
        <Fragment>
            <>
                <Header />
                <div className="signForm">
                    <div className="container bx">
                        <div className="col-6">
                            <img className="loginImg" src="media/cryto.jpg" alt="data not loaded" />
                        </div>
                        <div className="col-6">
                            <h1 className="large text-primary">Sign In</h1>
                            <p className="lead"><i className="fas fa-user"></i> Sign into your Account</p>
                            <form className="form" onSubmit={e => onSubmit(e)}>
                                <div className="form-group">
                                    <TextField
                                        required
                                        type="email"
                                        id="email"
                                        label="E Mail"
                                        className="inpb"
                                        value={email}
                                        name="email"
                                        onChange={e => onChange(e)}
                                        variant="outlined"
                                    />
                                </div>
                                <div className="form-group">
                                    <TextField
                                        required
                                        type="password"
                                        id="password"
                                        label="Password"
                                        className="inpb"
                                        value={password}
                                        name="password"
                                        onChange={e => onChange(e)}
                                        variant="outlined"
                                    />
                                </div>
                                <Button type="submit" variant="contained" color="primary">
                                    Log In
                                </Button>
                            </form>
                            <p className="my-1">
                                Don't have an account? <Link to="/register" className="themeText">Sign Up</Link>
                            </p>
                        </div>
                    </div>
                </div>
            </>
        </Fragment>
    );
};

Login.propTypes = {
    login: PropTypes.func.isRequired,
    isAuthenticated: PropTypes.bool,
    error: PropTypes.string, // Include error prop
};

const mapStateToProps = state => ({
    isAuthenticated: state.auth.isAuthenticated,
    error: state.auth.error, // Map error state
});

export default connect(mapStateToProps, { login })(Login);
