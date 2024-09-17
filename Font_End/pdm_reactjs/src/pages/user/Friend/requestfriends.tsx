import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import { useParams, useNavigate, Navigate } from "react-router-dom";
import { useUser } from '../../../constant/userContext';
import Sidebar from "../../../components/user/sidebar";
import FunctionUser from "../../../components/user/function";
import { clickTabData } from "../../../assets/js/tabdata";

const ListRequestFriend: React.FC = () => {
    const { userId } = useUser();
    const [users, setUsers] = useState<any[]>([]);
    const [requestFriends, setRequestFriends] = useState<any[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string>('');
    const [successMessage, setSuccessMessage] = useState<string>('');
    const navigate = useNavigate();

    useEffect(() => {
        fetchUsers();
        clickTabData();
        fecthRequestFriend();
    }, [userId]);

    const fetchUsers = async () => {
        try {
            const response = await axios.get(`https://localhost:7227/api/User/get_all_users?user_id=${userId}`);
            setUsers(response.data);
            setLoading(false);
        } catch (error) {
            setError('Error fetching data');
            setLoading(false);
        }
    };

    const fecthRequestFriend = async () => {
        try {
            const response = await axios.get(`https://localhost:7227/api/FriendRequest/get_all_request_friend?user_id=${userId}`);
            setRequestFriends(response.data);
            setLoading(false);
        } catch (error) {
            setError('Error fetching data');
            setLoading(false);
        }
    }

    const handleInforuser = async (user_id: number) => {
        navigate(`/informationuser/${user_id}`);
    };

    const handleAddFriend = async (user_id: number) => {
        try {
            await axios.post('https://localhost:7227/api/FriendRequest/create_friend_request', {
                sender_id: userId,
                receiver_id: user_id
            });
            setSuccessMessage('Successful request, please wait!');
            setTimeout(() => {
                fetchUsers();
                fecthRequestFriend();
                setSuccessMessage('');
            }, 1500);
        } catch (error) {
            console.error('Error creating join request:', error);
        }
    }

    const handleAccept = async (request_id: number) => {
        try {
            await axios.put(`https://localhost:7227/api/FriendRequest/friend_accept?request_id=${request_id}`);
            setSuccessMessage("Make friends successfully!");
            setTimeout(() => {
                fecthRequestFriend();
                setSuccessMessage('');
            }, 1300);
        } catch (error) {
            console.error('Error', error);
            setSuccessMessage("Making friends is not successful!");
            setTimeout(() => {
                setSuccessMessage('');
            }, 1300);
        }
    };

    const handleBlock = async (request_id:number) => {
        const confirmDelete = window.confirm("Are you sure you will block this friend?");
        if (!confirmDelete) {
            return;
        }

        try {
            await axios.put(`https://localhost:7227/api/FriendRequest/friend_block?request_id=${request_id}`);
            setSuccessMessage('Block this friend successful!');
            setTimeout(() => {
                fecthRequestFriend();
                setSuccessMessage('');
            }, 1300);

        } catch (err) {
            console.error('Failed to block this friend', err);
            setSuccessMessage('Failed to block this friend');
            setTimeout(() => {
                setSuccessMessage('');
            }, 1300);
        }
    };

    const handleDeclined = async (request_id:number) => {
        try {
            await axios.delete(`https://localhost:7227/api/FriendRequest/friend_destroy?request_id=${request_id}`);
            setSuccessMessage('Cancel this friend successful!');
            setTimeout(() => {
                fecthRequestFriend();
                setSuccessMessage('');
            }, 1300);

        } catch (err) {
            console.error('Failed to cancel this friend', err);
            setSuccessMessage('Failed to cancel this friend');
            setTimeout(() => {
                setSuccessMessage('');
            }, 1300);
        }
    };

    const handleDestroy = async (request_id:number) => {
        const confirmDelete = window.confirm("Are you sure you will cancel this friend?");
        if (!confirmDelete) {
            return;
        }

        try {
            await axios.delete(`https://localhost:7227/api/FriendRequest/friend_destroy?request_id=${request_id}`);
            setSuccessMessage('Cancel this friend successful!');
            setTimeout(() => {
                fecthRequestFriend();
            }, 1300);

        } catch (err) {
            console.error('Failed to cancel this friend', err);
            setSuccessMessage('Failed to cancel this friend');
            setTimeout(() => {
                setSuccessMessage('');
            }, 1300);
        }
    };

    const handleChat = async (user_id:number) => {
        navigate(`/chatfriend/${user_id}`);
    };
    

    return (
        <>
            <Sidebar />
            <FunctionUser />
            <main>
                {successMessage && <div className="alert alert-success fixed-top text-center" style={{ zIndex: 1000 }}>
                    {successMessage}
                </div>}
                <div className="content">
                    <div className="alert alert-primary" style={{ zIndex: 30, width: '75.5%', position: 'fixed', fontSize: 'larger', fontWeight: 'bold', textAlign: 'center' }}>
                        REQUEST FRIENDS
                    </div>
                    <div className="contentGroup">
                        <div className="dataChat">
                            <div className="search-data">
                                <i className="bx bx-search-alt" />
                                <input className="search-word" type="text" placeholder="Search" />
                            </div>
                            <div className="list-users">
                                {users.map(user => {
                                    // Kiểm tra nếu user_id đã tồn tại trong requestFriend (là sender hoặc receiver)
                                    // const isFriendBock = requestFriends.map(requestFriend => requestFriend.status === 'Block');
                                    const isFriendRequestSent = requestFriends.some(requestFriend =>
                                        requestFriend.sender_id === user.user_id || requestFriend.receiver_id === user.user_id 
                                        // || requestFriend.status !== 'Block'
                                    );
                                    return (
                                        <div className="form-user" key={user.user_id}>
                                            <button className="infor-user" onClick={() => handleInforuser(user.user_id)}>
                                                <div className="avatar-user">
                                                    <img src={`/resources/${user.avatar_url}`} alt="avatar" />
                                                </div>
                                            </button>
                                            <h6>{user.username}</h6>
                                            <div className="botton-user">
                                                <button className="infor-user" onClick={() => handleInforuser(user.user_id)}><i className="bx bxs-info-circle" /></button>
                                                <button className="add-user" onClick={() => handleAddFriend(user.user_id)} hidden={isFriendRequestSent}><i className="bx bxs-user-plus" /></button>
                                                <button className="chat-user" onClick={() => handleChat(user.user_id)} hidden={!isFriendRequestSent}><i className='bx bxs-chat'></i></button>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                        <div className="dataGroup">
                            <h5>REQUIREMENT</h5>
                            <div className="tabs">
                                <div className="tab" data-target="data-accepted">Accepted</div>
                                <div className="tab" data-target="data-spending">Pending</div>
                                <div className="tab" data-target="data-block">Block</div>
                            </div>
                            <div className="data-accepted active">
                                {requestFriends
                                    .filter(requestFriend => requestFriend.status === "Accepted")
                                    .map(requestFriend => (
                                        <div className="form-user" key={requestFriend.request_id}>
                                           <button className="infor-user" onClick={() => handleInforuser(requestFriend.user_id)}>
                                                <div className="avatar-user">
                                                    <img src={`/resources/${requestFriend.avatar_url}`} alt="avatar" />
                                                </div>
                                            </button>

                                            <h6>{requestFriend.username}</h6>
                                            <div className="botton-user">
                                                <h6>{new Date(requestFriend.request_date).toLocaleDateString("vi-VN")}</h6>
                                                <h6>{requestFriend.status}</h6>
                                                <button className="chat-user" onClick={()=>handleChat(requestFriend.user_id)}><i className='bx bxs-chat'></i></button>
                                                <button className="destroy-user" onClick={()=>handleDestroy(requestFriend.request_id)}><i className='bx bxs-user-x'></i></button>
                                                <button className="block-user" onClick={()=>handleBlock(requestFriend.request_id)}><i className='bx bx-block'></i></button>
                                            </div>
                                        </div>
                                    ))}
                            </div>
                            <div className="data-spending">
                                {requestFriends
                                    .filter(requestFriend => requestFriend.status === "Pending" ) 
                                    // && requestFriend.sender_id !== userId
                                    .map(requestFriend => (
                                        <div className="form-user" key={requestFriend.request_id}>
                                            <button className="infor-user" onClick={() => handleInforuser(requestFriend.user_id)}>
                                                <div className="avatar-user">
                                                    <img src={`/resources/${requestFriend.avatar_url}`} alt="avatar" />
                                                </div>
                                            </button>

                                            <h6>{requestFriend.username}</h6>
                                            <div className="botton-user">
                                                <h6>{new Date(requestFriend.request_date).toLocaleDateString("vi-VN")}</h6>
                                                <h6>{requestFriend.status}</h6>
                                                <button className="accept-user" onClick={()=>handleAccept(requestFriend.request_id)} hidden={requestFriend.sender_id === userId}><i className='bx bxs-user-check'></i></button>
                                                <button className="declined-user" onClick={()=>handleDeclined(requestFriend.request_id)}><i className='bx bxs-x-circle'></i></button>
                                            </div>
                                        </div>
                                    ))}
                            </div>
                            <div className="data-block">
                                {requestFriends
                                    .filter(requestFriend => requestFriend.status === "Block")
                                    .map(requestFriend => (
                                        <div className="form-user" key={requestFriend.request_id}>
                                            <button className="infor-user" onClick={() => handleInforuser(requestFriend.user_id)}>
                                                <div className="avatar-user">
                                                    <img src={`/resources/${requestFriend.avatar_url}`} alt="avatar" />
                                                </div>
                                            </button>
                                            <h6>{requestFriend.username}</h6>
                                            <div className="botton-user">
                                                <h6>{new Date(requestFriend.request_date).toLocaleDateString("vi-VN")}</h6>
                                                <h6>{requestFriend.status}</h6>
                                                <button className="cancel-user" onClick={()=>handleDestroy(requestFriend.request_id)}><i className='bx bxs-x-circle'></i></button>
                                            </div>
                                        </div>
                                    ))}
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </>
    );
};

export default ListRequestFriend;
