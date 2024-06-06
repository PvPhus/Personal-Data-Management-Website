import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Register: React.FC = () => {
    // Khai báo các state và giá trị mặc định sử dụng useState
    const [username, setUsername] = useState(''); // Tên người dùng
    const [password, setPassword] = useState(''); // Mật khẩu
    const [confirmPassword, setConfirmPassword] = useState(''); // Xác nhận mật khẩu
    const [email, setEmail] = useState(''); // Email
    const [role] = useState('NguoiDung'); // Vai trò mặc định là 'NguoiDung'
    const [avatar_url] = useState(''); // URL hình đại diện
    const [token] = useState(''); // Token
    const [errorMessage, setErrorMessage] = useState(''); // Thông báo lỗi
    const [successMessage, setSuccessMessage] = useState(''); // Thông báo thành công
    const navigate = useNavigate(); // Sử dụng hook useNavigate để chuyển hướng trang

    // Xử lý sự kiện khi người dùng nhấn nút đăng ký
    const handleRegister = async (event: React.FormEvent) => {
        event.preventDefault(); // Ngăn chặn hành động mặc định của form

        // Kiểm tra xem mật khẩu và xác nhận mật khẩu có khớp nhau không
        if (password !== confirmPassword) {
            setErrorMessage('Passwords do not match.'); // Thông báo lỗi nếu mật khẩu không khớp
            setSuccessMessage(''); // Xóa thông báo thành công (nếu có)
            return;
        }

        try {
            // Kiểm tra xem tài khoản đã tồn tại chưa
            const response = await axios.get(`https://localhost:7227/api/User/user/${email}`);
            const userExists = response.data.exists;

            if (userExists) {
                // Nếu tài khoản đã tồn tại, hiển thị thông báo lỗi
                setErrorMessage('Tài khoản đã tồn tại. Hãy thử đăng ký tài khoản khác!');
                setSuccessMessage(''); // Xóa thông báo thành công (nếu có)
                return;
            }

            // Gửi request đăng ký tài khoản
            const registerResponse = await axios.post('https://localhost:7227/api/User/register', {
                username,
                email,
                password,
                role,
                avatar_url,
                token,
            });

            if (registerResponse.status === 200) {
                // Nếu đăng ký thành công, hiển thị thông báo thành công và chuyển hướng tới trang đăng nhập
                setSuccessMessage('Đăng ký thành công!');
                setErrorMessage(''); // Xóa thông báo lỗi (nếu có)
                setUsername(''); // Xóa giá trị trong trường tên người dùng
                setPassword(''); // Xóa giá trị trong trường mật khẩu
                setConfirmPassword(''); // Xóa giá trị trong trường xác nhận mật khẩu
                setEmail(''); // Xóa giá trị trong trường email
                navigate('/login'); // Chuyển hướng tới trang đăng nhập
            }
        } catch (error) {
            // Nếu có lỗi xảy ra trong quá trình gửi request, hiển thị thông báo lỗi
            setErrorMessage('Đăng ký thất bại, hãy thử lại!');
            setSuccessMessage(''); // Xóa thông báo thành công (nếu có)
        }
    };

    return (
        <>
            <main>
                {/* Content */}
                <div className="content">
                    <div className="container">
                        <div className="card o-hidden border-0 shadow-lg my-5">
                            <div className="card-body p-0">
                                {/* Nested Row within Card Body */}
                                <div className="row">
                                    <div className="col-lg-5 d-none d-lg-block bg-register-image" />
                                    <div className="col-lg-7">
                                        <div className="p-5">
                                            <div className="text-center">
                                                <h1 className="h4 text-gray-900 mb-4">Create an Account!</h1>
                                            </div>
                                            <form onSubmit={handleRegister}>
                                                <div>
                                                    <input
                                                        type="text"
                                                        id="username"
                                                        value={username}
                                                        onChange={(e) => setUsername(e.target.value)}
                                                        required
                                                        className="form-control form-control-user"
                                                        placeholder="Name: "
                                                    />
                                                </div>
                                                <div>
                                                    <input
                                                        type="email"
                                                        id="email"
                                                        value={email}
                                                        onChange={(e) => setEmail(e.target.value)}
                                                        required
                                                        className="form-control form-control-user"
                                                        placeholder="Email: "
                                                    />
                                                </div>
                                                <div>
                                                    <input
                                                        type="password"
                                                        id="password"
                                                        value={password}
                                                        onChange={(e) => setPassword(e.target.value)}
                                                        required
                                                        className="form-control form-control-user"
                                                        placeholder="Password: "
                                                    />
                                                </div>
                                                <div>
                                                    <input
                                                        type="password"
                                                        id="confirmPassword"
                                                        value={confirmPassword}
                                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                                        required
                                                        className="form-control form-control-user"
                                                        placeholder="Confirm Password: "
                                                    />
                                                </div>
                                                <button className="btn btn-primary btn-user btn-block" type="submit">Register</button>
                                            </form>
                                            {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
                                            {successMessage && <p style={{ color: 'green' }}>{successMessage}</p>}
                                            <div>
                                                <hr />
                                                <div className="text-center">
                                                    <a className="small" href="forgot-password.html">Forgot Password?</a>
                                                </div>
                                                <div className="text-center">
                                                    <a className="small" href="login.html">Already have an account? Login!</a>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </>
    );
};

export default Register;
