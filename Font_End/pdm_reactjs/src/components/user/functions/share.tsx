import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { useUser } from "../../../constant/userContext";
import Topbar from "../topbar";
import Sidebar from "../sidebar";
import FunctionUser from "../function";

const Share: React.FC = () => {
    const { userId } = useUser();
    const { file_id } = useParams<{ file_id: string }>();
    const [groups, setGroups] = useState<any[]>([]);
    const [selectedGroups, setSelectedGroups] = useState<number[]>([]);
    const [selectedFriends, setSelectedFriends] = useState<number[]>([]);
    const [requestFriends, setRequestFriends] = useState<any[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [success, setSuccess] = useState<string>('');
    const [error, setError] = useState<string>('');
    const navigate = useNavigate();

    useEffect(() => {
        fecthRequestFriend();
        fetchData();
    }, [userId]);

    const fecthRequestFriend = async () => {
        try {
            const response = await axios.get(`https://localhost:7227/api/FriendRequest/get_all_request_friend?user_id=${userId}`);
            setRequestFriends(response.data);
            setLoading(false);
        } catch (error) {
            setError('Error fetching data');
            setLoading(false);
        }
    };

    const fetchData = async () => {
        if (!userId) {
            setSuccess('User ID not found');
            setLoading(false);
            return;
        }
        try {
            const response = await axios.get(`https://localhost:7227/api/Group/get_Groups/${userId}`);
            setGroups(response.data);
            setLoading(false);
        } catch (error) {
            setError('Error fetching data!');
            setLoading(false);
        }
    };

    const handleFriendCheckboxChange = (receiver_id: number) => {
        setSelectedFriends(prevSelected =>
            prevSelected.includes(receiver_id)
                ? prevSelected.filter(id => id !== receiver_id)
                : [...prevSelected, receiver_id]
        );
    };

    const handleGroupCheckboxChange = (groupId: number) => {
        setSelectedGroups(prevSelected =>
            prevSelected.includes(groupId)
                ? prevSelected.filter(id => id !== groupId)
                : [...prevSelected, groupId]
        );
    };

    const handleShare = async () => {
        if (!userId || !file_id) {
            setError('User ID or file ID is missing.');
            return;
        }

        // Trường hợp 1: Chỉ chia sẻ cho bạn bè
        if (selectedFriends.length > 0 && selectedGroups.length === 0) {
            await shareWithFriends();
        }
        // Trường hợp 2: Chỉ chia sẻ cho nhóm
        else if (selectedFriends.length === 0 && selectedGroups.length > 0) {
            await shareWithGroups();
        }
        // Trường hợp 3: Chia sẻ cho cả bạn bè và nhóm
        else if (selectedFriends.length > 0 && selectedGroups.length > 0) {
            await shareWithFriends();
            await shareWithGroups();
        } else {
            setError('Please select at least one friend or one group to share the file.');
            setTimeout(() => {
                fecthRequestFriend();
                fetchData();
                setError('');
            }, 2700)
        }
    };


    const shareWithFriends = async () => {
        // Kiểm tra đầu vào hợp lệ
        if (!file_id || !userId || selectedFriends.length === 0) {
            setError('Invalid input for sharing file with friends.');
            return;
        }

        // Đảm bảo file_id và user_id là số và receiver_id là một mảng số nguyên
        const data = {
            user_id: Number(userId),
            file_id: Number(file_id),
            receiver_id: selectedFriends.map(Number), // Chuyển thành mảng số nguyên
            content: "Shared data",
        };

        try {
            const response = await axios.post('https://localhost:7227/api/File/share_file_friend', data);
            setSuccess('File shared successfully with friends!');
            setTimeout(() => {
                navigate(-1);
            }, 1500);
        } catch (error) {
            console.error('Error sharing the file with friends:', error);
            setError('Error sharing the file with friends!');
        }
    };


    const shareWithGroups = async () => {
        const data = {
            user_id: userId,
            file_id: Number(file_id),
            group_id: selectedGroups,
        };

        try {
            await axios.post('https://localhost:7227/api/File/share_file_group', data);
            setSuccess('File shared successfully with groups!');
            setTimeout(() => {
                navigate(-1);
            }, 1500);
        } catch (error) {
            setError('Error sharing the file with groups!');
        }
    };

    return (
        <div className="background-image">
            <Sidebar />
            <FunctionUser />
            <Topbar />
            <header>
                <div className="searchbar">
                    <li>
                        <a href="#" style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '36px', height: '36px', textDecoration: 'none' }}>
                            <i className="bx bx-search-alt" style={{ fontSize: '24px' }}></i>
                        </a>
                    </li>
                    <input type="text" className="textsearch" placeholder="Search" />
                </div>
            </header>
            <main>
                <div className="content">
                    <div className="card shadow mb-4">

                        {/* FRIENDS */}
                        <div className="alert alert-primary text-center" style={{ zIndex: 30, width: "75.5%", position: "fixed", fontSize: "larger", fontWeight: "bold", }}>
                            Choose The Friends Or Groups You Want To Share
                            <button className="btn btn-success" onClick={handleShare} style={{ marginLeft: '20px' }}>SHARE</button>
                        </div>

                        {/* Thông báo */}
                        {loading ? (
                            <div>Loading...</div>
                        ) : error ? (
                            <div className="alert alert-danger sticky-top text-center" style={{ zIndex: 3000 }}>
                                {error}
                            </div>
                        ) : success ? (
                            <div className="alert alert-success sticky-top text-center" style={{ zIndex: 3000 }}>
                                {success}
                            </div>
                        ) : null}

                        <div className="card-header py-3" style={{ display: 'flex', marginTop: "31.5px" }}>
                            <div className="card-body">
                                <div className="table-responsive">
                                    <table className="table table-bordered" id="dataTable" width="50%" cellSpacing={0}>
                                        <thead>
                                            <tr>
                                                <th>STT</th>
                                                <th>Avatar</th>
                                                <th>Name</th>
                                                <th>Date</th>
                                                <th>Choose</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {requestFriends
                                                .filter(requestFriend => requestFriend.status === "Accepted" && requestFriend.user_id !== userId)
                                                .map((requestFriend, index) => (
                                                    <tr key={requestFriend.request_id}>
                                                        <td>{index + 1}</td>
                                                        <td>
                                                            <img src={`/resources/${requestFriend.avatar_url}`} alt="Avatar" style={{ width: 80, height: 80 }} />
                                                        </td>
                                                        <td>{requestFriend.username}</td>
                                                        <td>{requestFriend.request_date}</td>
                                                        <td>
                                                            <input
                                                                type="checkbox"
                                                                value={requestFriend.user_id}
                                                                onChange={() => handleFriendCheckboxChange(requestFriend.user_id)}
                                                            />
                                                        </td>
                                                    </tr>
                                                ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                            {/* Nhóm */}
                            <div className="card-body">
                                <div className="table-responsive">
                                    <table className="table table-bordered" id="dataTable" width="50%" cellSpacing={0}>
                                        <thead>
                                            <tr>
                                                <th>STT</th>
                                                <th>Image</th>
                                                <th>Group name</th>
                                                <th>Members</th>
                                                <th>Choose</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {groups.map((group, index) => (
                                                <tr key={group.group_id}>
                                                    <td>{index + 1}</td>
                                                    <td>
                                                        <img src={`/resources/images/${group.group_image}`} alt="Avatar" style={{ width: 80, height: 80 }} />
                                                    </td>
                                                    <td>{group.group_name}</td>
                                                    <td>{group.total_members}</td>
                                                    <td>
                                                        <input
                                                            type="checkbox"
                                                            value={group.group_id}
                                                            onChange={() => handleGroupCheckboxChange(group.group_id)}
                                                        />
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Share;
