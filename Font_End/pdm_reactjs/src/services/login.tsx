import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../constant/userContext'; // Import the context

const Login: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string>('');
    const { setUserId } = useUser();
    const navigate = useNavigate();
    const handleRegister = () => {
        navigate('/register');
    }
    const handleLogin = async (event: React.FormEvent) => {
        event.preventDefault();

        try {
            const response = await axios.post('https://localhost:7227/api/User/login', {
                email,
                password
            });

            if (response.status === 200) {
                const { role, user_id } = response.data;

                setUserId(user_id);
                // Save user_id and role to LocalStorage
                localStorage.setItem('userId', user_id);
                localStorage.setItem('role', role);

                if (role === 'NguoiDung') {
                    window.location.href = '/index.html';
                } else if (role === 'Admin') {
                    window.location.href = '/admin.html';
                }
            } else {
                setError('Login failed');
            }
        } catch (error) {
            setError('Login failed');
        }
    };

    return (
        <div className='content'>
            <div className="container">
                <div className="row justify-content-center">
                    <div className="col-xl-10 col-lg-12 col-md-9">
                        <div className="card o-hidden border-0 shadow-lg my-5">
                            <div className="card-body p-0">
                                <div className="row">
                                    <div className="col-lg-6 d-none d-lg-block bg-login-image"></div>
                                    <div className="col-lg-6">
                                        <div className="p-5">
                                            <div className="text-center">
                                                <h1 className="h4 text-gray-900 mb-4">Welcome Back!</h1>
                                            </div>
                                            <form className="user" onSubmit={handleLogin}>
                                                <div className="form-group">
                                                    <input
                                                        type="email"
                                                        className="form-control form-control-user"
                                                        id="exampleInputEmail"
                                                        aria-describedby="emailHelp"
                                                        placeholder="Enter Email Address..."
                                                        value={email}
                                                        onChange={(e) => setEmail(e.target.value)}
                                                        required
                                                    />
                                                </div>
                                                <div className="form-group">
                                                    <input
                                                        type="password"
                                                        className="form-control form-control-user"
                                                        id="exampleInputPassword"
                                                        placeholder="Password"
                                                        value={password}
                                                        onChange={(e) => setPassword(e.target.value)}
                                                        required
                                                    />
                                                </div>
                                                <div className="form-group">
                                                    <div className="custom-control custom-checkbox small">
                                                        <input type="checkbox" className="custom-control-input" id="customCheck" />
                                                        <label className="custom-control-label" htmlFor="customCheck">Remember Me</label>
                                                    </div>
                                                </div>
                                                <button type="submit" className="btn btn-primary btn-user btn-block">
                                                    Login
                                                </button>
                                            </form>
                                            {error && <div className="text-danger text-center mt-3">{error}</div>}
                                            <hr />
                                            <div className="text-center">
                                                <a className="small" href="forgot-password.html">Forgot Password?</a>
                                            </div>
                                            <div className="text-center">
                                                <a className="small" onClick={handleRegister}>Create an Account!</a>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
