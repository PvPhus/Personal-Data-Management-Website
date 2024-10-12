import React, { useState, useEffect, ChangeEvent, FormEvent } from "react";
import axios from 'axios';
import { useUser } from "../../../constant/userContext";
import Sidebar from "../../../components/user/sidebar";
import FunctionUser from "../../../components/user/function";

const InforUser = () => {
    const { userId } = useUser();
    const [message, setMessage] = useState("");
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [userDetails, setUserDetails] = useState({
        user_id: userId,
        username: "",
        email: "",
        avatar_url: "",
        join_date: ""
    });

    useEffect(() => {
        const fetchUserDetails = async () => {
            try {
                if (userId) {
                    const response = await axios.get(`https://localhost:7227/api/User/get_user_by_userid/${userId}`);
                    const userData = response.data;
                    setUserDetails({
                        user_id: userData.user_id,
                        username: userData.username,
                        email: userData.email,
                        avatar_url: userData.avatar_url,
                        join_date: userData.join_date
                    });
                    console.log('User details:', userData);
                }
            } catch (error) {
                console.error('Error fetching user details:', error);
            }
        };
        fetchUserDetails();
    }, [userId]);

    const handleAvatarChange = (event: ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            setSelectedFile(file);
            setUserDetails(prevDetails => ({
                ...prevDetails,

                avatar_url: URL.createObjectURL(file) // Hiển thị ảnh ngay khi người dùng chọn
            }));
        }
    };
    const handleUpdate = async (event: FormEvent) => {
        event.preventDefault();

        if (userDetails.username.trim() === "") {
            setMessage('Please enter a username.');
            return;
        }

        if (selectedFile) {
            const formData = new FormData();
            formData.append('file', selectedFile);
            formData.append('username', userDetails.username);
            try {
                // Upload the file first
                const uploadResponse = await axios.post('https://localhost:7227/api/File/upload', formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                });

                const avatarUrl = uploadResponse.data.filePath;
                setUserDetails(prevDetails => ({
                    ...prevDetails,
                    avatar_url: avatarUrl
                }));

                // Update user info with the new avatar URL and username
                await axios.put(`https://localhost:7227/api/User/update_user_info?user_id=${userId}&username=${userDetails.username}&avatar_url=${avatarUrl}`);
                setMessage('User information successfully updated!');
            } catch (error) {
                setMessage('There was an error updating user information!');
            }
        } else {
            try {
                await axios.put(`https://localhost:7227/api/User/update_user_info?user_id=${userId}&username=${userDetails.username}&avatar_url=${userDetails.avatar_url}`);
                setMessage('Username successfully updated!');
            } catch (error) {
                setMessage('There was an error updating the username!');
            }
        }

        setTimeout(() => {
            setMessage('');
        }, 2000);
    };

    // const handleUpdate = async (event: FormEvent) => {
    //     event.preventDefault();

    //     if (!selectedFile || userDetails.username.trim() === "") {
    //         setMessage('Please choose a file and enter a new username before submitting.');
    //         return;
    //     }

    //     const formData = new FormData();
    //     formData.append('file', selectedFile);
    //     formData.append('username', userDetails.username);

    //     try {
    //         // Upload the file first
    //         const uploadResponse = await axios.post('https://localhost:7227/api/File/upload', formData, {
    //             headers: {
    //                 'Content-Type': 'multipart/form-data'
    //             }
    //         });

    //         const avatarUrl = uploadResponse.data.filePath; // Assuming the response contains the file path

    //         // Update the userDetails with the new avatar URL
    //         setUserDetails(prevDetails => ({
    //             ...prevDetails,
    //             avatar_url: avatarUrl
    //         }));

    //         // Then, update the user info with the new avatar URL and username
    //         const updateResponse = await axios.put(`https://localhost:7227/api/User/update_user_info?user_id=${userId}&username=${userDetails.username}&avatar_url=${avatarUrl}`);

    //         setMessage('User information successfully updated!');
    //         setTimeout(() => {
    //             setMessage('');
    //         }, 2000);
    //         console.log('User information successfully updated:', updateResponse.data);
    //     } catch (error) {
    //         console.error('There was an error updating user information!', error);
    //         setMessage('There was an error updating user information!');
    //     }
    // };


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
                                <form method="POST" onSubmit={handleUpdate}>

                                    <div className="row">
                                        <div className="col-md-6">
                                            <div className="form-group">
                                                <label>Avatar:</label>
                                                <img style={{ height: '150px', width: '150px' }} src={`/resources/${userDetails.avatar_url}`} alt="Avatar" className="img-fluid" />
                                                <input
                                                    type="file"
                                                    name="avatar"
                                                    id="avatar"
                                                    className="form-control"
                                                    onChange={handleAvatarChange}
                                                />
                                                <input
                                                    hidden
                                                    type="text"
                                                    name="avatar"
                                                    id="avatar"
                                                    className="form-control"
                                                    onChange={handleAvatarChange}
                                                    value={userDetails.avatar_url}
                                                />
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
                                                    onChange={e => setUserDetails({ ...userDetails, username: e.target.value })}
                                                    readOnly={userId !== userDetails.user_id}
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
                                                    onChange={e => setUserDetails({ ...userDetails, email: e.target.value })}
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
                                    <button type="submit" className="btn btn-primary">Update</button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

        </>
    );
}

export default InforUser;