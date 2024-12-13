import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useUser } from "../../constant/userContext";
import axios from "axios";

const RightMouseFriend = () => {
    const navigate = useNavigate();
    const { userId } = useUser();
    const { user_id } = useParams<{ user_id: string }>();
    const [messageContent, setMessageContent] = useState<string>('');
    const [Datas, setDatas] = useState<any[]>([]);

    useEffect(() => {
        fetchDataFriendChat();
    }, [userId, user_id]);

    // useEffect(() => {
    //     fetchDataFriendChat();
    // });

    const fetchDataFriendChat = async () => {
        try {
            const response = await axios.get(`https://localhost:7227/api/Friend/get_data_friend_chat?sender_id=${userId}&receiver_id=${user_id}`);
            setDatas(response.data);
        } catch (error) {
            console.error('Error fetching messages group:', error)
        }
    }

    const infoData = (file_id: number) => {
        navigate(`/friend-chat/information/file/${file_id}`);
    };

    const shareData = async (file_id: number) => {
        navigate(`/friend-chat/share/${file_id}`);
    };

    const deleteData = async (message_id: number) => {
        const confirmDelete = window.confirm("Are you sure you want to delete this file?");
        if (!confirmDelete) {
            return;
        }

        try {
            await axios.delete(`https://localhost:7227/api/Friend/delete-data-friend/${message_id}`);
            setMessageContent('Deleted the data successful');
            fetchDataFriendChat();
            setTimeout(() => {
                setMessageContent('');
            }, 1300);

        } catch (err) {
            console.error('Failed to delete data', err);
            setMessageContent('Failed to delete data');
            setTimeout(() => {
                fetchDataFriendChat();
                setMessageContent('');
            }, 1300);
        }
    };

    const downloadData = async (file_id: number, filename: string) => {
        try {
            const response = await axios.get(`https://localhost:7227/api/File/download/${file_id}`, {
                responseType: 'blob',
            });

            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', filename); // Đặt tên file theo ý muốn
            document.body.appendChild(link);
            link.click();
            link.remove(); // Xóa link sau khi nhấn để tải về
            window.URL.revokeObjectURL(url); // Giải phóng bộ nhớ
        } catch (err) {
            console.error('Failed to download file', err);
        }
    };

    return (
        <>
            {Datas.map((data) => (
                <div id="contextMenuData" className="context-menu" key={`${data.file_id},${data.message_id},${data.timestamp}`}>
                    <ul>
                        <li>
                            <a onClick={() => infoData(data.file_id)}>
                                Information <i className="bx bxs-show icon" />
                            </a>
                        </li>
                        <li>
                            <a onClick={() => downloadData(data.file_id, `${data.filename_new}.${data.file_type}`)}>
                                Download <i className="bx bxs-download icon"></i>
                            </a>
                        </li>
                        <li>
                            <a onClick={() => shareData(data.file_id)}>
                                Share <i className="bx bxs-share icon" />
                            </a>
                        </li>
                        <li>
                            <a onClick={() => deleteData(data.message_id)}>
                                Delete <i className="bx bxs-trash icon" />
                            </a>
                        </li>
                    </ul>
                </div>
            ))}

            {Datas.map((data) => (
                <div id="contextMenuMessage" className="context-menu" key={`${data.file_id}_${data.message_id}`}>
                    <ul>
                        <li>
                            <a onClick={() => deleteData(data.message_id)}>
                                Message Recovery <i className="bx bxs-message-alt-x"></i>
                            </a>
                        </li>
                        <li>
                            <a>
                                Message Update <i className="bx bxs-message-alt-edit"></i>
                            </a>
                        </li>
                    </ul>
                </div>
            ))}
        </>
    );
}
export default RightMouseFriend;