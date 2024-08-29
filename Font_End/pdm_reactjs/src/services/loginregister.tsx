import React, { useEffect, useState } from "react";
import '../assets/css/loginregister.css'
import { clickLoginRegister } from "../assets/js/loginregister";
import { useUser } from "../constant/userContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const LoginRegister: React.FC = () => {
    const [username, setUsername] = useState(''); // Tên người dùng
    const [confirmPassword, setConfirmPassword] = useState(''); // Xác nhận mật khẩu
    const [token] = useState(''); // Token
    const [errorMessage, setErrorMessage] = useState(''); // Thông báo lỗi
    const [successMessage, setSuccessMessage] = useState(''); // Thông báo thành công
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string>('');
    const {userId, setUserId } = useUser();
    const navigate = useNavigate();
    
    useEffect(() => {
        clickLoginRegister();
    }, [userId]);

    const handleRegister = async (event: React.FormEvent) => {
        event.preventDefault(); // Ngăn chặn hành động mặc định của form

        // Kiểm tra xem mật khẩu và xác nhận mật khẩu có khớp nhau không
        if (password !== confirmPassword) {
            setErrorMessage('Mật khẩu xác nhận chưa trùng nhau.');
            setTimeout(() => {
                setErrorMessage('');
            }, 2000);
            return;
        }

        try {
            // Kiểm tra xem tài khoản đã tồn tại chưa
            const response = await axios.get(`https://localhost:7227/api/User/user/${email}`);
            const userExists = response.data.exists;

            if (userExists) {
                setErrorMessage('Tài khoản đã tồn tại. Hãy thử đăng ký tài khoản khác!');
                setTimeout(() => {
                    setErrorMessage('');
                }, 2000);
                return;
            }

            // Gửi request đăng ký tài khoản
            const registerResponse = await axios.post('https://localhost:7227/api/User/register', {
                username,
                email,
                password,
                token,
            });

            if (registerResponse.status === 204) {
                console.log('Registration successful.');
                setSuccessMessage("Đăng ký thành công!");
                setTimeout(() => {
                    setUsername('');
                    setEmail('');
                    setPassword('');
                    setConfirmPassword('');
                    setSuccessMessage('');
                }, 2000);
            }
        } catch (error) {
            // Nếu có lỗi xảy ra trong quá trình gửi request, hiển thị thông báo lỗi
            setErrorMessage('Đăng ký thất bại, hãy thử lại!');
            setTimeout(() => {
                setErrorMessage('');
            }, 2000);
        }
    };

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
                    navigate(`/alldata/${userId}}`)
                } else {
                    navigate(`/show-files`)
                }
            } else {
                setError('Login failed');
            }
        } catch (error) {
            setError('Login failed');
        }
    };
    return (
        <>

            <div className="container" id="container">
                <div className="form-container sign-up">
                    <form onSubmit={handleRegister}>
                        <h2>Create Account</h2>
                        <div className="social-icons">
                            <a className="icon">P</a>
                            <a className="icon"><i className='bx bxs-data'></i></a>
                            <a className="icon">M</a>
                        </div>
                        <input
                            type="text"
                            id="username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                            className="form-control form-control-user"
                            placeholder="Name: "
                        />
                        <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="form-control form-control-user"
                            placeholder="Email: "
                        />
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="form-control form-control-user"
                            placeholder="Password: "
                        />
                        <input
                            type="password"
                            id="confirmPassword"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                            className="form-control form-control-user"
                            placeholder="Confirm Password: "
                        />
                        {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
                        {successMessage && <p style={{ color: 'green' }}>{successMessage}</p>}
                        <button type="submit">Register</button>
                    </form>
                </div>
                <div className="form-container sign-in">
                    <form onSubmit={handleLogin}>
                        <h1>Sign In</h1>
                        <div className="social-icons">
                            <a className="icon">P</a>
                            <a className="icon"> <i className='bx bxs-data'></i> </a>
                            <a className="icon">M</a>

                        </div>

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
                        <input
                            type="password"
                            className="form-control form-control-user"
                            id="exampleInputPassword"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                        <a href="#">Forget Your Password?</a>
                        {error && <div className="text-danger text-center mt-3">{error}</div>}
                        <button type="submit">Login</button>
                    </form>
                </div>
                <div className="toggle-container">
                    <div className="toggle">
                        <div className="toggle-panel toggle-left">
                            <h1>Welcome Back!</h1>
                            <p>Enter your personal details to use all of site features</p>
                            <button className="hidden" id="login">Login</button>
                        </div>
                        <div className="toggle-panel toggle-right">
                            <h1>Hello, Friend!</h1>
                            <p>Welcome to the program <br /> Personal Data Management</p>
                            <button className="hidden" id="register">Register</button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};
export default LoginRegister;