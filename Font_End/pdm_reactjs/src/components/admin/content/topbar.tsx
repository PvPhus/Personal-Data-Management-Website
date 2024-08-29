import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../../../constant/userContext";
import { clickTopbar } from "../../../assets/js/functionDrop";
import axios from "axios";

const Topbar = () => {
    const navigate = useNavigate();
    const { userId, setUserId } = useUser();
    const [user, setUser] = useState<any>(null);
    const [isLoggedIn, setIsLoggedIn] = useState(!!userId);

    useEffect(() => {
        clickTopbar();
    }, []);

    const handleLogout = () => {
        const confirmLogout = window.confirm("Are you sure you want to logout?");
        if (confirmLogout) {
            clickTopbar();
            setIsLoggedIn(false);
            setUserId(null);
            navigate("/login-register");
        }
    };

    const handleLogin = () => {
        setIsLoggedIn(true);
        setUserId(userId);
        navigate("/login-register");
    };

    const handleInfo = () => {
        navigate(`/infouser/${userId}`);
    };

    useEffect(() => {
        const fetchData = async () => {
            if (userId === null) return;
            try {
                const response = await axios.get(`https://localhost:7227/api/User/get_user_by_userid/${userId}`);
                setUser(response.data);
            } catch (error) {
                return null;
            }
        };
        fetchData();
    }, [userId]);

    return (
        <>
            <nav className="navbar navbar-expand navbar-light bg-white topbar mb-4 static-top shadow">
                {/* Sidebar Toggle (Topbar) */}
                <button id="sidebarToggleTop" className="btn btn-link d-md-none rounded-circle mr-3">
                    <i className="fa fa-bars" />
                </button>
                {/* Topbar Search */}
                <form className="d-none d-sm-inline-block form-inline mr-auto ml-md-3 my-2 my-md-0 mw-100 navbar-search">
                    <div className="input-group">
                        <input type="text" className="form-control bg-light border-0 small" placeholder="Search for..." aria-label="Search" aria-describedby="basic-addon2" />
                        <div className="input-group-append">
                            <button className="btn btn-primary" type="button">
                                <i className="fas fa-search fa-sm" />
                            </button>
                        </div>
                    </div>
                </form>
                {/* Topbar Navbar */}
                <ul className="navbar-nav ml-auto">
                    {/* Nav Item - Search Dropdown (Visible Only XS) */}
                    <li className="nav-item dropdown no-arrow d-sm-none">
                        <a className="nav-link dropdown-toggle" id="searchDropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                            <i className="fas fa-search fa-fw" />
                        </a>
                        {/* Dropdown - Messages */}
                        <div className="dropdown-menu dropdown-menu-right p-3 shadow animated--grow-in" aria-labelledby="searchDropdown">
                            <form className="form-inline mr-auto w-100 navbar-search">
                                <div className="input-group">
                                    <input type="text" className="form-control bg-light border-0 small" placeholder="Search for..." aria-label="Search" aria-describedby="basic-addon2" />
                                    <div className="input-group-append">
                                        <button className="btn btn-primary" type="button">
                                            <i className="fas fa-search fa-sm" />
                                        </button>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </li>
                    {/* Nav Item - Alerts */}
                    <li className="nav-item dropdown no-arrow mx-1">
                        <a className="nav-link dropdown-toggle" id="alertsDropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                            <i className="fas fa-bell fa-fw" />
                            {/* Counter - Alerts */}
                            <span className="badge badge-danger badge-counter">3+</span>
                        </a>
                        {/* Dropdown - Alerts */}
                        <div className="dropdown-list dropdown-menu dropdown-menu-right shadow animated--grow-in" aria-labelledby="alertsDropdown">
                            <h6 className="dropdown-header">
                                Alerts Center
                            </h6>
                            <a className="dropdown-item d-flex align-items-center"  >
                                <div className="mr-3">
                                    <div className="icon-circle bg-primary">
                                        <i className="fas fa-file-alt text-white" />
                                    </div>
                                </div>
                                <div>
                                    <div className="small text-gray-500">December 12, 2019</div>
                                    <span className="font-weight-bold">A new monthly report is ready to download!</span>
                                </div>
                            </a>
                            <a className="dropdown-item d-flex align-items-center"  >
                                <div className="mr-3">
                                    <div className="icon-circle bg-success">
                                        <i className="fas fa-donate text-white" />
                                    </div>
                                </div>
                                <div>
                                    <div className="small text-gray-500">December 7, 2019</div>
                                    $290.29 has been deposited into your account!
                                </div>
                            </a>
                            <a className="dropdown-item d-flex align-items-center"  >
                                <div className="mr-3">
                                    <div className="icon-circle bg-warning">
                                        <i className="fas fa-exclamation-triangle text-white" />
                                    </div>
                                </div>
                                <div>
                                    <div className="small text-gray-500">December 2, 2019</div>
                                    Spending Alert: We've noticed unusually high spending for your account.
                                </div>
                            </a>
                            <a className="dropdown-item text-center small text-gray-500"  >Show All Alerts</a>
                        </div>
                    </li>
                    {/* Nav Item - Messages */}
                    <li className="nav-item dropdown no-arrow mx-1">
                        <a className="nav-link dropdown-toggle" id="messagesDropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                            <i className="fas fa-envelope fa-fw" />
                            {/* Counter - Messages */}
                            <span className="badge badge-danger badge-counter">7</span>
                        </a>
                        {/* Dropdown - Messages */}
                        <div className="dropdown-list dropdown-menu dropdown-menu-right shadow animated--grow-in" aria-labelledby="messagesDropdown">
                            <h6 className="dropdown-header">
                                Message Center
                            </h6>
                            <a className="dropdown-item d-flex align-items-center"  >
                                <div className="dropdown-list-image mr-3">
                                    <img className="rounded-circle" src="img/undraw_profile_1.svg" alt="..." />
                                    <div className="status-indicator bg-success" />
                                </div>
                                <div className="font-weight-bold">
                                    <div className="text-truncate">Hi there! I am wondering if you can help me with a
                                        problem I've been having.</div>
                                    <div className="small text-gray-500">Emily Fowler · 58m</div>
                                </div>
                            </a>
                            <a className="dropdown-item d-flex align-items-center"  >
                                <div className="dropdown-list-image mr-3">
                                    <img className="rounded-circle" src="img/undraw_profile_2.svg" alt="..." />
                                    <div className="status-indicator" />
                                </div>
                                <div>
                                    <div className="text-truncate">I have the photos that you ordered last month, how
                                        would you like them sent to you?</div>
                                    <div className="small text-gray-500">Jae Chun · 1d</div>
                                </div>
                            </a>
                            <a className="dropdown-item d-flex align-items-center"  >
                                <div className="dropdown-list-image mr-3">
                                    <img className="rounded-circle" src="img/undraw_profile_3.svg" alt="..." />
                                    <div className="status-indicator bg-warning" />
                                </div>
                                <div>
                                    <div className="text-truncate">Last month's report looks great, I am very happy with
                                        the progress so far, keep up the good work!</div>
                                    <div className="small text-gray-500">Morgan Alvarez · 2d</div>
                                </div>
                            </a>
                            <a className="dropdown-item d-flex align-items-center"  >
                                <div className="dropdown-list-image mr-3">
                                    <img className="rounded-circle" src="https://source.unsplash.com/Mv9hjnEUHR4/60x60" alt="..." />
                                    <div className="status-indicator bg-success" />
                                </div>
                                <div>
                                    <div className="text-truncate">Am I a good boy? The reason I ask is because someone
                                        told me that people say this to all dogs, even if they aren't good...</div>
                                    <div className="small text-gray-500">Chicken the Dog · 2w</div>
                                </div>
                            </a>
                            <a className="dropdown-item text-center small text-gray-500"  >Read More Messages</a>
                        </div>
                    </li>
                    <div className="topbar-divider d-none d-sm-block" />
                    <div className="functionuser">
                        <div className="functionusers">
                            <a  >
                                {user && (<h5>{user.username}</h5>)}
                            </a>
                            <a className="dropdown-toggle" id="userDropdown" role="button" data-toggle="dropdown">
                                {user && (<img className="image-function" src={`/resources/${user.avatar_url}`} />)}
                            </a>
                        </div>

                        {/* Dropdown - User Information */}
                        <div className="functiondrop" id="functiondrop" aria-labelledby="userDropdown">
                            <a className="dropdown-item" onClick={handleInfo}>
                                <i className="bx bxs-user-rectangle icon" />
                                Profile
                            </a>
                            <a className="dropdown-item"  >
                                <i className="bx bxs-cog icon" />
                                Settings
                            </a>
                            <div className="dropdown-divider" style={{ height: 2, backgroundColor: 'black', width: '80%', marginLeft: 18 }} />
                            <a className="dropdown-item"  >
                                <i className="bx bx-repost icon" />
                                Change Password
                            </a>
                            {isLoggedIn ? (
                                <a className="dropdown-item" onClick={handleLogout}>
                                    <i className="bx bxs-log-out icon" />
                                    Logout
                                </a>
                            ) : (
                                <a className="dropdown-item" onClick={handleLogin}>
                                    <i className="bx bxs-log-in icon" />
                                    Login
                                </a>
                            )}
                        </div>
                    </div>
                </ul>
            </nav>
        </>
    );
};

export default Topbar;