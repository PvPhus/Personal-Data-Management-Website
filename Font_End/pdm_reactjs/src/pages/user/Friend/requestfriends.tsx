import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
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
            console.log(requestFriends.filter(requestFriend => requestFriend.status === "Pending"));

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

    const handleBlock = async (request_id: number) => {
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

    const handleDeclined = async (request_id: number) => {
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

    const handleDestroy = async (request_id: number) => {
        const confirmDelete = window.confirm("Are you sure you will cancel this friend?");
        if (!confirmDelete) {
            return;
        }

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

    const handleChat = async (user_id: number) => {
        navigate(`/chatfriend/${user_id}`);
    };

    // if (loading) {
    //     return <div>Loading...</div>;
    // }

    // if (error) {
    //     return <div>{error}</div>;
    // }

    return (
        <>
            <Sidebar />
            <FunctionUser />
            <main>
                {successMessage && <div className="alert alert-success fixed-top text-center" style={{ zIndex: 1000 }}>
                    {successMessage}
                </div>}
                {error && <div className="alert alert-warning fixed-top text-center" style={{ zIndex: 1000 }}>
                    {error}
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
                                    // Kiểm tra xem đã có lời mời kết bạn giữa user hiện tại và user đang hiển thị không
                                    const friendRequest = requestFriends.find(requestFriend =>
                                        (requestFriend.sender_id === userId && requestFriend.receiver_id === user.user_id) ||
                                        (requestFriend.sender_id === user.user_id && requestFriend.receiver_id === userId)
                                    );

                                    // Kiểm tra nếu trạng thái là "Block"
                                    const isBlocked = friendRequest && friendRequest.status === 'Block';

                                    // Kiểm tra nếu đã gửi/nhận lời mời kết bạn
                                    const isFriendRequestSent = friendRequest && friendRequest.status !== 'Block';

                                    // Ẩn người dùng nếu trạng thái là "Block"
                                    if (isBlocked) return null;

                                    return (
                                        <div className="form-user" key={user.user_id}>
                                            <button className="infor-user" onClick={() => handleInforuser(user.user_id)}>
                                                <div className="avatar-user">
                                                    <img src={`/resources/${user.avatar_url}`} alt="avatar" />
                                                </div>
                                            </button>
                                            <h6>{user.username}</h6>
                                            <div className="botton-user">
                                                <button className="infor-user" onClick={() => handleInforuser(user.user_id)}>
                                                    <i className="bx bxs-info-circle" />
                                                </button>

                                                {/* Hiển thị nút add-user nếu chưa có lời mời kết bạn hoặc không bị block */}
                                                {!isFriendRequestSent && (
                                                    <button className="add-user" onClick={() => handleAddFriend(user.user_id)}>
                                                        <i className="bx bxs-user-plus" />
                                                    </button>
                                                )}

                                                {/* Hiển thị nút chat-user nếu đã gửi hoặc nhận lời mời kết bạn và không bị block */}
                                                {isFriendRequestSent && (
                                                    <button className="chat-user" onClick={() => handleChat(user.user_id)}>
                                                        <i className='bx bxs-chat'></i>
                                                    </button>
                                                )}
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
                                <div className="tab" data-target="data-pending">Pending</div>
                                <div className="tab" data-target="data-block">Block</div>
                            </div>
                            <div className="data-accepted active">
                                {requestFriends
                                    .filter(requestFriend => requestFriend.status === "Accepted" && requestFriend.user_id !== userId)
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
                                                <button className="chat-user" onClick={() => handleChat(requestFriend.user_id)}><i className='bx bxs-chat'></i></button>
                                                <button className="destroy-user" onClick={() => handleDestroy(requestFriend.request_id)}><i className='bx bxs-user-x'></i></button>
                                                <button className="block-user" onClick={() => handleBlock(requestFriend.request_id)}><i className='bx bx-block'></i></button>
                                            </div>
                                        </div>
                                    ))}
                            </div>
                            <div className="data-pending">
                                {requestFriends
                                    // Lọc tất cả lời mời có trạng thái "Pending" liên quan đến tài khoản hiện tại (bạn nhận hoặc bạn gửi)
                                    .filter(requestFriend =>
                                        requestFriend.user_id !== userId && requestFriend.status === "Pending" &&
                                        (requestFriend.receiver_id === userId || requestFriend.sender_id === userId)
                                    )
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

                                                {/* Hiển thị nút "Accept" nếu bạn là người nhận lời mời */}
                                                {requestFriend.receiver_id === userId && (
                                                    <button className="accept-user" onClick={() => handleAccept(requestFriend.request_id)}>
                                                        <i className='bx bxs-user-check'></i>
                                                    </button>
                                                )}

                                                {/* Nút "Decline" vẫn hiển thị cho cả người gửi và người nhận */}
                                                <button className="declined-user" onClick={() => handleDeclined(requestFriend.request_id)}>
                                                    <i className='bx bxs-x-circle'></i>
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                            </div>
                            <div className="data-block">
                                {requestFriends
                                    .filter(requestFriend => requestFriend.status === "Block" && requestFriend.user_id !== userId)
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
                                                <button className="cancel-user" onClick={() => handleDestroy(requestFriend.request_id)}><i className='bx bxs-x-circle'></i></button>
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
