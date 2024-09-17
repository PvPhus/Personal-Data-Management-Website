import React, { useState, useEffect, ChangeEvent, FormEvent } from "react";
import axios from 'axios';
import { useUser } from "../../../constant/userContext";
import Sidebar from "../../../components/user/sidebar";
import FunctionUser from "../../../components/user/function";
import { useParams } from "react-router-dom";

const InformationUser = () => {
    const { userId } = useUser();
    const { user_id } = useParams();
    const [message, setMessage] = useState("");
    const [userDetails, setUserDetails] = useState({
        username: "",
        email: "",
        avatar_url: "",
        join_date: ""
    });
    useEffect(() => {
        fetchUserDetails();
    }, [user_id]);

    const fetchUserDetails = async () => {
        try {
            const response = await axios.get(`https://localhost:7227/api/User/get_user_by_userid/${user_id}`);
            const userData = response.data;

            setUserDetails({
                username: userData.username,
                email: userData.email,
                avatar_url: userData.avatar_url,
                join_date: userData.join_date
            });
        } catch (error) {
            console.error('Error fetching user details:', error);
        }
    };


    return (
        <>
            <Sidebar />
            <FunctionUser />
            <main>
                <div className="content">
                    <div className="alert alert-primary text-center" style={{ zIndex: 30, width: "75.5%", position: "fixed", fontSize: "larger", fontWeight: "bold" }}>
                        Profile
                    </div>
                    <div className="container-fluid">
                        {/* Page Heading */}
                        <h1 className="h3 mb-2 text-gray-800">Information</h1>
                        {/* DataTales Example */}
                        <div className="card shadow mb-4">
                            <div className="card-body">
                                {message && (
                                    <div className="alert alert-success fixed-top text-center" style={{ zIndex: 1000 }}>
                                        {message}
                                    </div>
                                )}


                                <div className="row">
                                    <div className="col-md-6">
                                        <div className="form-group">
                                            <label>Avatar:</label>
                                            <img style={{ height: '150px', width: '150px' }} src={`/resources/${userDetails.avatar_url}`} alt="Avatar" className="img-fluid" />

                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="form-group">
                                            <label>Username:</label>
                                            <input
                                                type="text"
                                                name="username"
                                                id="username"
                                                className="form-control"
                                                value={userDetails.username}
                                                readOnly
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-md-6">
                                        <div className="form-group">
                                            <label>Email:</label>
                                            <input
                                                readOnly
                                                type="email"
                                                name="email"
                                                id="email"
                                                className="form-control"
                                                value={userDetails.email}

                                            />
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="form-group">
                                            <label>Join Date:</label>
                                            <input
                                                type="datetime-local"
                                                name="join_date"
                                                id="join_date"
                                                className="form-control"
                                                value={userDetails.join_date.split('.')[0]}
                                                readOnly
                                            />
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
}

export default InformationUser;