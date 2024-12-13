import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { useUser } from '../../../constant/userContext';
import Sidebar from "../../../components/user/sidebar";
import FunctionUser from "../../../components/user/function";
import { clickTabData } from "../../../assets/js/tabdata";
import RightMouseFriend from "../../../components/user/rightMouseFriend";
import { clickRightMouseFriend } from "../../../assets/js/rightmouseDataFriend";

const ChatFriend: React.FC = () => {
    const navigate = useNavigate();
    const { user_id } = useParams<{ user_id: string }>();
    const { userId } = useUser();
    const [Datas, setDatas] = useState<any[]>([]);
    const [user, setUser] = useState<any>('');
    const [messageContent, setMessageContent] = useState<string>('');
    const [isAtBottom, setIsAtBottom] = useState(true);
    const chatEndRef = useRef<HTMLDivElement | null>(null);
    const messagesContainerRef = useRef<HTMLDivElement | null>(null);

    const imageFileTypes = ['JPEG', 'JPG', 'GIF', 'TIFF', 'PSD', 'EPS', 'WEBP', 'PNG'];
    const fileFileTypes = ['TXT', 'DOCX', 'PDF', 'PPT', 'JAR', 'DOT', 'HTML', 'DOCM', 'DOC'];
    const videoFileTypes = ['AVI', 'MP4', 'FLV', 'WMV', 'MOV'];
    const [isMenuVisible, setMenuVisible] = useState(false);

    const toggleContextMenu = (event: React.MouseEvent) => {
        event.stopPropagation(); // Prevent event from bubbling up to document
        setMenuVisible((prevVisible) => !prevVisible);
    };

    const closeContextMenu = (event: MouseEvent) => {
        const functionButton = document.getElementById('functionfriend');
        const contextMenu = document.getElementById('context-menu');
        if (
            functionButton &&
            contextMenu &&
            !functionButton.contains(event.target as Node) &&
            !contextMenu.contains(event.target as Node)
        ) {
            setMenuVisible(false);
        }
    };

    useEffect(() => {
        document.addEventListener('click', closeContextMenu);
        return () => {
            document.removeEventListener('click', closeContextMenu);
        };
    }, []);

    // Scroll to bottom function
    const scrollToBottom = () => {
        if (chatEndRef.current) {
            chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    };

    // Check scroll position to update state
    const checkScrollPosition = () => {
        const container = messagesContainerRef.current;
        if (container) {
            const isBottom = container.scrollHeight - container.scrollTop === container.clientHeight;
            setIsAtBottom(isBottom);
        }
    };

    useEffect(() => {
        clickRightMouseFriend();
        clickTabData();
        fetchDataFriendChat();
        fetchUser();
    }, [userId, user_id]);

    useEffect(() => {
        if (isAtBottom) {
            scrollToBottom();
        }
    }, [Datas])

    // Get data friend chat(messages and files)
    const fetchDataFriendChat = async () => {
        try {
            const response = await axios.get(`https://localhost:7227/api/Friend/get_data_friend_chat?sender_id=${userId}&receiver_id=${user_id}`);
            setDatas(response.data);
        } catch (error) {
            console.error('Error fetching messages group:', error)
        }
    }

    // Get data user
    const fetchUser = async () => {
        try {
            const response = await axios.get(`https://localhost:7227/api/User/get_user_by_userid/${user_id}`);
            setUser(response.data);
        } catch (error) {
            console.error('Error fetching messages group:', error)
        }
    }

    // Handle scroll event to determine if the user has scrolled up
    useEffect(() => {
        const container = messagesContainerRef.current;
        if (container) {
            container.addEventListener('scroll', checkScrollPosition);
            return () => container.removeEventListener('scroll', checkScrollPosition);
        }
    }, []);

    const formatTime = (timestamp: string) => {
        const date = new Date(timestamp);
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    const infoData = (file_id: number) => {
        navigate(`/friend-chat/information/file/${file_id}`);
    };

    const shareData = async (file_id: number) => {
        navigate(`/friend-chat/share/${file_id}`);
    };

    const VideoCall = async (user_id: number) => {
        navigate(`/friend-chat/video-call/${user_id}`);
    };

    const ShareListData = async (receiver_id: number) => {
        navigate(`/friend-chat/share-list-data/${receiver_id}`);
    };

    const deleteData = async (message_id: number) => {
        const confirmDelete = window.confirm("Are you sure you want to delete this file?");
        if (!confirmDelete) {
            return;
        }

        try {
            await axios.delete(`https://localhost:7227/api/Friend/delete-data-friend/${message_id}`);
            setMessageContent('Deleted the data successful');
            setTimeout(() => {
                fetchDataFriendChat();
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

    const getImgSrc = (file_type: string) => {
        switch (file_type) {
            case 'pdf':
                return `/resources/images/anhfilepdf.jpg`;
            case 'txt':
                return `/resources/images/anhfiletext.png`;
            case 'docx':
            case 'docm':
                return `/resources/images/docx.webp`;
            case 'pptx':
                return `/resources/images/anhfileppt.jpg`;
            case 'xlsx':
                return `/resources/images/anhfileexcel.jpg`;
            default:
                return ``;
        }
    };
    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setMessageContent(event.target.value);
    };

    const handleSendMessage = async () => {
        if (!messageContent.trim()) return;

        const newMessage = {
            sender_id: userId,
            receiver_id: user_id,
            content: messageContent
        };

        try {
            await axios.post('https://localhost:7227/api/Friend/create_messages_friend', newMessage);
            setDatas([...Datas, newMessage]);
            setMessageContent('');
            scrollToBottom();
        } catch (error) {
            console.error('Error sending message:', error);
        }
    };

    const handleEnter = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            handleSendMessage();
        }
    };

    const handleDeleteConversation = async () => {
        const confirmDelete = window.confirm("You definitely delete this chat on both sides?");
        if (!confirmDelete) {
            return;
        }
        try {
            await axios.delete(`https://localhost:7227/api/Friend/delete-conversation?sender_id=${userId}&receiver_id=${user_id}`);
            setMessageContent('Cancel this friend successful!');
            setTimeout(() => {
                navigate(-1);
            }, 1300);

        } catch (err) {
            console.error('Failed to cancel this friend', err);
            setMessageContent('Failed to cancel this friend');
            setTimeout(() => {
                setMessageContent('');
            }, 1300);
        }
    };

    const handleBlockFriend = async () => {
        const confirmDelete = window.confirm("Are you sure you will block this friend?");
        if (!confirmDelete) {
            return;
        }

        try {
            await axios.put(`https://localhost:7227/api/Friend/friend_block_message?sender_id=${userId}&receiver_id=${user_id}`);
            setMessageContent('Block this friend successful!');
            setTimeout(() => {
                navigate(-1);
            }, 1300);

        } catch (err) {
            console.error('Failed to block this friend', err);
            setMessageContent('Failed to block this friend');
            setTimeout(() => {
                setMessageContent('');
            }, 1300);
        }
    };

    return (
        <>
            <RightMouseFriend />
            <Sidebar />
            <FunctionUser />
            <main>
                <div className="content">
                    {user && (
                        <div className="alert alert-primary" key={`${user.user_id}`} style={{ zIndex: 30, width: '75.5%', position: 'fixed', fontSize: 'larger', fontWeight: 'bold', textAlign: 'center' }}>
                            <img className="avatarGroup" src={`/resources/${user.avatar_url}`} alt="avatar" />
                            {user.username}
                            <button className="btn btn-success" id="functionfriend" onClick={toggleContextMenu} data-toggle="dropdown" style={{ float: 'right' }}>
                                <i className="bx bx-dots-vertical-rounded"></i>
                            </button>
                            <div
                                id="context-menu"
                                className="context-menu"
                                style={{
                                    display: isMenuVisible ? 'block' : 'none',
                                    position: 'absolute',
                                    top: '55px', // Adjust based on button position
                                    right: '-90px',
                                }}
                                aria-labelledby="functionfriend"
                            >
                                <ul>
                                    <li>
                                        <a onClick={() => handleDeleteConversation()}>
                                            Delete <i className="bx bxs-trash icon"></i>
                                        </a>
                                    </li>
                                    <li>
                                        <a onClick={() => handleBlockFriend()}>
                                            Block <i className='bx bx-block'></i>
                                        </a>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    )}

                    <div className="contentGroup">
                        <div className="dataChat">
                            <h5>CONVERSATION</h5>
                            {/*  Đổ ra tin nhắn giữa 2 người dùng */}
                            <div className="list-messages"
                                ref={messagesContainerRef}>
                                {Datas.length === 0 || Datas.every(data => data.message_id === null) ? (
                                    <h6>Please text the opponent!</h6>
                                ) : (
                                    Datas.map(data => data.message_id !== null ? (
                                        data.sender_id === userId ? (
                                            // Tin nhắn của người gửi
                                            <div className="right-message" id="right-message" key={`${data.message_id}_${data.file_id}`}>
                                                {/* Kiểm tra nếu content là "Shared data" */}
                                                {data.content === "Shared data" ? (
                                                    <>
                                                        {data.filename_old && imageFileTypes.some(type => data.filename_old.toLowerCase().endsWith(type.toLowerCase())) ? (
                                                            <img id="messageSender" className="img-message" src={`/resources/images/${data.filename_old}`} alt={data.filename_old} />
                                                        ) : data.filename_old && videoFileTypes.some(type => data.filename_old.toLowerCase().endsWith(type.toLowerCase())) ? (
                                                            <video id="messageSender" controls style={{ height: 'auto', width: '40%' }}>
                                                                <source src={`/resources/images/${data.filename_old}`} />
                                                            </video>
                                                        ) : data.filename_old ? (
                                                            <iframe id="messageSender" src={`/resources/images/${data.filename_old}`} style={{ width: '40%', height: '200px' }} />
                                                        ) : (
                                                            // Nếu không có filename_old
                                                            <p>No file available</p>
                                                        )}
                                                        <div className="messageTime">{formatTime(data.timestamp)}</div>
                                                    </>
                                                ) : data.content === "Shared List Data" ? (
                                                    <>
                                                        {data.filename_old && imageFileTypes.some(type => data.filename_old.toLowerCase().endsWith(type.toLowerCase())) ? (
                                                            <img className="img-message" src={`/resources/images/${data.filename_old}`} alt={data.filename_old} />
                                                        ) : data.filename_old && videoFileTypes.some(type => data.filename_old.toLowerCase().endsWith(type.toLowerCase())) ? (
                                                            <video id="messageSender" controls style={{ height: 'auto', width: '40%' }}>
                                                                <source src={`/resources/images/${data.filename_old}`} />
                                                            </video>
                                                        ) : data.filename_old ? (
                                                            <iframe id="messageSender" src={`/resources/images/${data.filename_old}`} style={{ width: '40%', height: '200px' }} />
                                                        ) : (
                                                            // Nếu không có filename_old
                                                            <p>No file available</p>
                                                        )}
                                                        <div className="messageTime">{formatTime(data.timestamp)}</div>
                                                    </>
                                                ) : (
                                                    <div role="button" className="messageUser" id="messageSender">{data.content}</div>
                                                )}
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
                                            </div>

                                        ) : (
                                            // Tin nhắn của người nhận
                                            (() => {
                                                const receiverData = Datas.find(data => data.receiver_id === data.receiver_id && data.receiver_id !== userId);

                                                return (
                                                    <div role="button" className="left-message" key={`${data.message_id}_${data.file_id}`}>
                                                        {receiverData && (
                                                            <img className="avatarUser" src={`/resources/${receiverData.avatar_url}`} alt="User Avatar" />
                                                        )}
                                                        <div className="messageUser">
                                                            {receiverData && <h6>{receiverData.username}</h6>}
                                                            {/* Kiểm tra nếu content là "Shared data" */}
                                                            {data.content === "Shared data" ? (
                                                                <>
                                                                    <img className="img-message" src={`/resources/images/${data.filename_old}`} alt={data.filename_old} />
                                                                    <div className="messageTime">{formatTime(data.timestamp)}</div>
                                                                </>
                                                            ) : data.content === "Shared List Data" ? (
                                                                <>
                                                                    <div className="list-img-message">
                                                                        <img className="img-message" src={`/resources/images/${data.filename_old}`} alt={data.filename_old} />
                                                                    </div>
                                                                </>
                                                            ) : (
                                                                <div role="button" id="messageUser">{data.content}</div>
                                                            )}
                                                        </div>
                                                        <div className="messageTime">{formatTime(data.timestamp)}</div>
                                                    </div>
                                                );
                                            })()
                                        )
                                    ) : null)
                                )}

                                <div ref={chatEndRef} />
                                <div className="message-base">
                                    {/* Chức năng */}
                                    {Datas && Datas.length > 0 && (
                                        (() => {
                                            const dataFound = Datas.find(data => data.receiver_id !== userId && data.status === "Accepted");
                                            return dataFound ? (
                                                <>
                                                    {/* Video call */}
                                                    <button className="message-send" onClick={() => VideoCall(dataFound.user_id)}>
                                                        <i className='bx bxs-video'></i>
                                                    </button>
                                                    {/* Chia sẻ 1 lúc nhiều dữ liệu */}
                                                    <button className="message-send" onClick={() => ShareListData(dataFound.receiver_id)}>
                                                        <i className='bx bx-link-alt'></i>
                                                    </button>
                                                </>
                                            ) : null;
                                        })()
                                    )}
                                    {/* Ô nhập tin nhắn */}
                                    <input
                                        className="message-content"
                                        type="text"
                                        value={messageContent}
                                        onChange={handleInputChange}
                                        placeholder="Enter your message"
                                        onKeyDown={handleEnter}
                                    />
                                    {/* Nút nhấn gửi tin nhắn */}
                                    <button className="message-send" onClick={handleSendMessage}>
                                        <i className="bx bxs-send"></i>
                                    </button>
                                </div>
                            </div>
                        </div>
                        <div className="dataGroup">
                            <div className="search-data">
                                <i className="bx bx-file-find" />
                                <input className="search-word" type="text" placeholder="Search file" />
                            </div>
                            <div className="tabs">
                                <div className="tab" data-target="data-images">Images</div>
                                <div className="tab" data-target="data-files">Files</div>
                                <div className="tab" data-target="data-videos">Videos</div>
                                <div className="tab" data-target="data-link">Links</div>
                                <div className="tab" data-target="my-data">Shared</div>
                            </div>
                            <div className="data-images active">
                                {Datas.filter(data =>
                                    data.file_type &&
                                    imageFileTypes.includes(data.file_type.toUpperCase())
                                ).map(data => (
                                    <div className="data" key={`${data.message_id}_${data.file_id}`}>
                                        <div className="face-data" id="face-data">
                                            <div id="mediaContainer" className="media-container">
                                                <img src={`/resources/images/${data.filename_old}`} alt={data.filename_old} />
                                            </div>
                                        </div>
                                        <div className="function-data">
                                            <a onClick={() => infoData(data.file_id)}>
                                                <i className="bx bxs-show icon" />
                                            </a>
                                            <a onClick={() => downloadData(data.file_id, `${data.filename_new}.${data.file_type}`)}>
                                                <i className='bx bxs-download icon'></i>
                                            </a>
                                            <a onClick={() => shareData(data.file_id)}>
                                                <i className="bx bxs-share icon" />
                                            </a>
                                            <a onClick={() => deleteData(data.message_id)}>
                                                <i className="bx bxs-trash icon" />
                                            </a>
                                        </div>
                                    </div>
                                ))}
                                {/* Hiển thị thông báo nếu không có dữ liệu nào */}
                                {Datas.every(data => data.file_type === null) && (
                                    <h6>No Data</h6>
                                )}
                            </div>
                            <div className="data-files">
                                {Datas.filter(data =>
                                    data.file_type &&
                                    fileFileTypes.includes(data.file_type.toUpperCase()) // Kiểm tra file_type và chuyển sang chữ hoa
                                ).map(data => (
                                    <div className="data" key={`${data.message_id}_${data.file_id}`}>
                                        <div className="face-data" id="face-data">
                                            <div id="mediaContainer" className="media-container">
                                                <img src={getImgSrc(data.file_type)} />
                                            </div>
                                        </div>
                                        <div className="function-data">
                                            <a onClick={() => infoData(data.file_id)}>
                                                <i className="bx bxs-show icon" />
                                            </a>
                                            <a onClick={() => downloadData(data.file_id, `${data.filename_new}.${data.file_type}`)}>
                                                <i className='bx bxs-download icon'></i>
                                            </a>
                                            <a onClick={() => shareData(data.file_id)}>
                                                <i className="bx bxs-share icon" />
                                            </a>
                                            <a onClick={() => deleteData(data.message_id)}>
                                                <i className="bx bxs-trash icon" />
                                            </a>
                                        </div>
                                    </div>
                                ))}
                                {Datas.every(data => data.file_type === null) && (
                                    <h6>No Data</h6>
                                )}
                            </div>
                            <div className="data-videos">
                                {Datas.filter(data =>
                                    data.file_type &&
                                    videoFileTypes.includes(data.file_type.toUpperCase()) // Kiểm tra file_type và chuyển sang chữ hoa
                                ).map(data => (
                                    <div className="data" key={`${data.message_id}_${data.file_id}`}>
                                        <div className="face-data" id="face-data">
                                            <div id="mediaContainer" className="media-container">
                                                <video src={`/resources/images/${data.filename_old}`} />
                                            </div>
                                        </div>
                                        <div className="function-data">
                                            <a onClick={() => infoData(data.file_id)}>
                                                <i className="bx bxs-show icon" />
                                            </a>
                                            <a onClick={() => downloadData(data.file_id, `${data.filename_new}.${data.file_type}`)}>
                                                <i className='bx bxs-download icon'></i>
                                            </a>
                                            <a onClick={() => shareData(data.file_id)}>
                                                <i className="bx bxs-share icon" />
                                            </a>
                                            <a onClick={() => deleteData(data.message_id)}>
                                                <i className="bx bxs-trash icon" />
                                            </a>
                                        </div>
                                    </div>
                                ))}
                                {Datas.every(data => data.file_type === null) && (
                                    <h6>No Data</h6>
                                )}
                            </div>
                            <div className="data-link">
                                <div><a href="https://www.youtube.com/">http://example.com</a></div>
                                <div><a href="http://example.com">http://example.com</a></div>
                                <div><a href="http://example.com">http://example.com</a></div>
                                <div><a href="http://example.com">http://example.com</a></div>
                            </div>
                            <div className="my-data">
                                <div className="base-1">
                                    <i className='bx bx-image-alt'>Images</i>
                                </div>
                                {Datas.filter(data => data.sender_id === userId && imageFileTypes.includes(data.file_type)).map(data => (
                                    <div className="data" key={`${data.message_id}_${data.file_id}`} >
                                        <div className="face-data" id="face-data">
                                            <div id="mediaContainer" className="media-container">
                                                <img src={`/resources/images/${data.filename_old}`} />
                                            </div>
                                        </div>
                                        <div className="function-data">
                                            <a onClick={() => infoData(data.file_id)}><i className="bx bxs-show icon" /></a>
                                            <a onClick={() => downloadData(data.file_id, `${data.filename_new}.${data.file_type}`)}><i className='bx bxs-download icon'></i></a>
                                            <a onClick={() => shareData(data.file_id)}><i className="bx bxs-share icon" /></a>
                                            <a onClick={() => deleteData(data.message_id)}><i className="bx bxs-trash icon" /></a>
                                        </div>
                                    </div>
                                ))}
                                <div className="base-1">
                                    <i className='bx bxs-file'>Files</i>
                                </div>
                                {Datas.filter(data => data.sender_id === userId && fileFileTypes.includes(data.file_type)).map(data => (
                                    <div className="data" key={`${data.message_id}_${data.file_id}`} >
                                        <div className="name-data">
                                            <span>{data.filename_new}</span>
                                        </div>
                                        <div className="face-data" id="face-data">
                                            <div id="mediaContainer" className="media-container">
                                                <img src={getImgSrc(data.file_type)} />
                                            </div>
                                        </div>
                                        <div className="function-data">
                                            <a onClick={() => infoData(data.file_id)}><i className="bx bxs-show icon" /></a>
                                            <a onClick={() => downloadData(data.file_id, `${data.filename_new}.${data.file_type}`)}><i className='bx bxs-download icon'></i></a>
                                            <a onClick={() => shareData(data.file_id)}><i className="bx bxs-share icon" /></a>
                                            <a onClick={() => deleteData(data.message_id)}><i className="bx bxs-trash icon" /></a>
                                        </div>
                                    </div>
                                ))}
                                <div className="base-1">
                                    <i className='bx bxs-videos'>Videos</i>
                                </div>
                                {Datas.filter(data => data.sender_id === userId && videoFileTypes.includes(data.file_type)).map(data => (
                                    <div className="data" key={`${data.message_id}_${data.file_id}`}>
                                        <div className="name-data">
                                            <span>{data.filename_new}</span>
                                        </div>
                                        <div className="face-data" id="face-data">
                                            <div id="mediaContainer" className="media-container">
                                                <video src={`/resources/images/${data.filename_old}`} />
                                            </div>
                                        </div>
                                        <div className="function-data">
                                            <a onClick={() => infoData(data.file_id)}><i className="bx bxs-show icon" /></a>
                                            <a onClick={() => downloadData(data.file_id, `${data.filename_new}.${data.file_type}`)}><i className='bx bxs-download icon'></i></a>
                                            <a onClick={() => shareData(data.file_id)}><i className="bx bxs-share icon" /></a>
                                            <a onClick={() => deleteData(data.message_id)}><i className="bx bxs-trash icon" /></a>
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

export default ChatFriend;
