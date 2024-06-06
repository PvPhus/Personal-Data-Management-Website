import React, { useEffect, useState } from "react";
import axios from "axios";
import { clickTopbar } from "../assets/js/topbar";
import { useNavigate } from "react-router-dom";
import { useUser } from '../constant/userContext'; 

const FunctionUser = () => {
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
            navigate("/login");
        }
    };

    const handleLogin = () => {
        setIsLoggedIn(true);
        setUserId(userId);
        navigate("/login");
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
        <header>
            <div>
                <div className="functionuser">
                    <div className="functionusers">
                        <a href="#">
                            {user && (<h5>{user.username}</h5>)}
                        </a>
                        <a className="dropdown-toggle" href="#" id="userDropdown" role="button" data-toggle="dropdown">
                            {user && (<img className="image-function" src={`/resources/images/${user.avatar_url}`} />)}
                        </a>
                    </div>

                    {/* Dropdown - User Information */}
                    <div className="functiondrop" id="functiondrop" aria-labelledby="userDropdown">
                        <a className="dropdown-item" href="#">
                            <i className="bx bxs-user-rectangle icon" />
                            Profile
                        </a>
                        <a className="dropdown-item" href="#">
                            <i className="bx bxs-cog icon" />
                            Settings
                        </a>
                        <div className="dropdown-divider" style={{ height: 2, backgroundColor: 'black', width: '80%', marginLeft: 18 }} />
                        <a className="dropdown-item" href="#">
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
            </div>
        </header>
    );
};

export default FunctionUser;
