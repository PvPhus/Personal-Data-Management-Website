import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { useUser } from '../../../constant/userContext';
import Sidebar from "../../../components/user/sidebar";
import FunctionUser from "../../../components/user/function";
import { clickTabData } from "../../../assets/js/tabdata";
import RightMouseGroup from "../../../components/user/rightMouseGroup";
import { clickRightMouseGroup } from "../../../assets/js/rightmouseDataGroup";


const ListDataGroup: React.FC = () => {
    const navigate = useNavigate();
    const { group_id } = useParams<{ group_id: string }>();
    const { userId } = useUser();
    const [isPermisson, setIsPermission] = useState<any>(false);
    const [isAdmin, setIsAdmin] = useState(false);
    const [Datas, setDatas] = useState<any[]>([]);
    const [messagesGroup, setMessagesGroup] = useState<any[]>([]);
    const [message, setMessage] = useState<string>('');
    const [messageContent, setMessageContent] = useState<string>('');
    const [isAtBottom, setIsAtBottom] = useState(true);
    const chatEndRef = useRef<HTMLDivElement | null>(null);
    const messagesContainerRef = useRef<HTMLDivElement | null>(null);

    const imageFileTypes = ['JPEG', 'JPG', 'GIF', 'TIFF', 'PSD', 'EPS', 'WEBP', 'PNG'];
    const fileFileTypes = ['TXT', 'DOCX', 'PDF', 'PPT', 'JAR', 'DOT', 'HTML', 'DOCM', 'DOC'];
    const videoFileTypes = ['AVI', 'MP4', 'FLV', 'WMV', 'MOV'];

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
        clickRightMouseGroup();
        clickTabData();
        fetchGroupData();
        fetchIsAdminStatus();
        fetchMessagesGroup();
        fetchPermisson();
        if (isAtBottom) {
            scrollToBottom();
        }
    }, [userId, group_id, messagesGroup]);

    
    // Handle scroll event to determine if the user has scrolled up
    useEffect(() => {
        const container = messagesContainerRef.current;
        if (container) {
            container.addEventListener('scroll', checkScrollPosition);
            return () => container.removeEventListener('scroll', checkScrollPosition);
        }
    }, []);

    // Get all info data in group
    const fetchGroupData = async () => {
        try {
            const response = await axios.get(`https://localhost:7227/api/Group/get_all_data_in_groups?group_id=${group_id}`);
            setDatas(response.data);
        } catch (error) {
            console.error('Error fetching group data:', error);
        }
    };

    // Get messages in group
    const fetchMessagesGroup = async () => {
        try {
            const response = await axios.get(`https://localhost:7227/api/Group/get_messages_group?group_id=${group_id}`);
            setMessagesGroup(response.data);
        } catch (error) {
            console.error('Error fetching messages group:', error)
        }
    }

    // Check funcions Admin group
    const fetchIsAdminStatus = async () => {
        try {
            const response = await axios.get(`https://localhost:7227/api/Group/check_admin_group?group_id=${group_id}&user_id=${userId}`);
            setIsAdmin(response.data.isAdmin);

        } catch (error) {
            console.error('Error fetching isAdmin status:', error);
        }
    };


    const fetchPermisson = async () => {
        try {
            const response = await axios.get(`https://localhost:7227/api/Permission/get_permission_user?user_id=${userId}&group_id=${group_id}`);
            setIsPermission(response.data)
        } catch (error) {
            console.error('Error fetching isAdmin status:', error);
        }
    };

    const formatTime = (timestamp: string) => {
        const date = new Date(timestamp);
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    const openListRequests = () => {
        navigate(`/openRequests/${group_id}`);
    };

    const openListMembers = () => {
        navigate(`/openMembers/${group_id}`);
    };

    const infoData = (file_id: number) => {
        navigate(`/information/file/${file_id}`);
    };

    // const updateData = (file_id: number) => {
    //     navigate(`/update/file/${file_id}`);
    // };

    const shareData = async (file_id: number) => {
        navigate(`/share/file/${file_id}`);
    };

    const deleteData = async (file_id: number, group_id: number) => {
        const confirmDelete = window.confirm("Are you sure you want to delete this file?");
        if (!confirmDelete) {
            return;
        }

        try {
            await axios.delete(`https://localhost:7227/api/File/delete-groupdata/${file_id}?group_id=${group_id}`);
            setMessage('Deleted the data successful');
            setTimeout(() => {
                fetchGroupData();
            }, 1300);

        } catch (err) {
            console.error('Failed to delete video', err);
            setMessage('Failed to delete file');
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
            group_id: group_id,
            sender_id: userId,
            content: messageContent,
            timestamp: new Date().toISOString(),
        };

        try {
            await axios.post('https://localhost:7227/api/Group/create_messages', newMessage);
            setMessagesGroup([...messagesGroup, newMessage]);
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

    return (
        <>
            <RightMouseGroup/>
            <Sidebar />
            <FunctionUser />
            <main>
                <div className="content">
                    {Datas.map(data => (
                        <div className="alert alert-primary" style={{ zIndex: 30, width: '75.5%', position: 'fixed', fontSize: 'larger', fontWeight: 'bold', textAlign: 'center' }}>
                            <img className="avatarGroup" src={`/resources/images/${data.group_image}`} alt="avatar-group" />
                            {data.group_name}

                            {isAdmin ? (
                                <React.Fragment>
                                    <button style={{ float: 'right'}} onClick={openListRequests} className="btn btn-success">
                                        <span>{data.total_requests}</span> List Requests
                                    </button>
                                    <button style={{ float: 'right', marginRight: '4px' }} onClick={openListMembers} className="btn btn-warning">
                                         <span>{data.total_members}</span> List Members
                                    </button>
                                </React.Fragment>
                            ) : null}
                        </div>
                    ))}
                    <div className="contentGroup">
                        <div className="dataChat">
                            <h5>CONVERSATION</h5>
                            <div className="list-messages"
                                ref={messagesContainerRef}>
                                {messagesGroup.map(message => (
                                    message.sender_id === userId ? (
                                        <div className="right-message" id="right-message" key={message.message_id}>
                                            <div role="button" className="messageUser" id="messageUser">{message.content}</div>
                                            <div className="messageTime">{formatTime(message.timestamp)}</div>
                                        </div>
                                    ) : (
                                        <div role="button" className="left-message">
                                            <img className="avatarUser" src={`/resources/${message.avatar_url}`} />
                                            <div className="messageUser">
                                                <h6>{message.username}</h6>
                                                {message.content}
                                            </div>
                                            <div className="messageTime">{formatTime(message.timestamp)}</div>
                                        </div>
                                    )
                                ))}
                                <div ref={chatEndRef} />
                            </div>
                            <div className="message-base">
                                <input
                                    className="message-content"
                                    type="text"
                                    value={messageContent}
                                    onChange={handleInputChange}
                                    placeholder="Enter your message" 
                                    onKeyDown={handleEnter}/>
                                <button className="message-send" onClick={handleSendMessage}><i className="bx bxs-send" /></button>
                            </div>
                        </div>
                        <div className="dataGroup">
                            <div className="search-data">
                                <i className="bx bx-file-find" />
                                <input className="search-word" type="text" placeholder="Search file"/>
                            </div>
                            <div className="tabs">
                                <div className="tab" data-target="data-images">Images</div>
                                <div className="tab" data-target="data-files">Files</div>
                                <div className="tab" data-target="data-videos">Videos</div>
                                <div className="tab" data-target="data-link">Links</div>
                                <div className="tab" data-target="my-data">Shared</div>
                            </div>
                            <div className="data-images active">
                                {Datas.filter(data => imageFileTypes.includes(data.file_type.toUpperCase())).map(data => (
                                    <div className="data">

                                        <div className="face-data" id="face-data">
                                            <div id="mediaContainer" className="media-container">
                                                <img src={`/resources/images/${data.filename_old}`} />
                                            </div>
                                        </div>
                                        <div className="function-data">
                                            {isPermisson.can_read && <a onClick={() => infoData(data.file_id)}><i className="bx bxs-show icon" /></a>}
                                            {isPermisson.can_download && <a onClick={() => downloadData(data.file_id, `${data.filename_new}.${data.file_type}`)}><i className='bx bxs-download icon'></i></a>}
                                            {isPermisson.can_share && <a onClick={() => shareData(data.file_id)}><i className="bx bxs-share icon" /></a>}
                                            {isPermisson.can_delete && <a onClick={() => deleteData(data.file_id, data.group_id)}><i className="bx bxs-trash icon" /></a>}
                                        </div>

                                    </div>
                                ))}
                            </div>
                            <div className="data-files">
                                {Datas.filter(data => fileFileTypes.includes(data.file_type.toUpperCase())).map(data => (
                                    <div className="data">
                                        <div className="name-data">
                                            <span>{data.filename_new}</span>
                                        </div>
                                        <div className="face-data" id="face-data">
                                            <div id="mediaContainer" className="media-container">
                                                <img src={getImgSrc(data.file_type)} />
                                            </div>
                                        </div>
                                        <div className="function-data">
                                            {isPermisson.can_read && <a onClick={() => infoData(data.file_id)}><i className="bx bxs-show icon" /></a>}
                                            {isPermisson.can_download && <a onClick={() => downloadData(data.file_id, `${data.filename_new}.${data.file_type}`)}><i className='bx bxs-download icon'></i></a>}
                                            {isPermisson.can_share && <a onClick={() => shareData(data.file_id)}><i className="bx bxs-share icon" /></a>}
                                            {isPermisson.can_delete && <a onClick={() => deleteData(data.file_id, data.group_id)}><i className="bx bxs-trash icon" /></a>}
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div className="data-videos">
                                {Datas.filter(data => videoFileTypes.includes(data.file_type.toUpperCase())).map(data => (
                                    <div className="data">
                                        <div className="name-data">
                                            <span>{data.filename_new}</span>
                                        </div>
                                        <div className="face-data" id="face-data">
                                            <div id="mediaContainer" className="media-container">
                                                <video src={`/resources/images/${data.filename_old}`} />
                                            </div>
                                        </div>
                                        <div className="function-data">
                                            {isPermisson.can_read && <a onClick={() => infoData(data.file_id)}><i className="bx bxs-show icon" /></a>}
                                            {isPermisson.can_download && <a onClick={() => downloadData(data.file_id, `${data.filename_new}.${data.file_type}`)}><i className='bx bxs-download icon'></i></a>}
                                            {isPermisson.can_share && <a onClick={() => shareData(data.file_id)}><i className="bx bxs-share icon" /></a>}
                                            {isPermisson.can_delete && <a onClick={() => deleteData(data.file_id, data.group_id)}><i className="bx bxs-trash icon" /></a>}
                                        </div>
                                    </div>
                                ))}
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
                                {Datas.filter(data => data.user_id === userId && imageFileTypes.includes(data.file_type.toUpperCase())).map(data => (
                                    <div className="data" >
                                        <div className="face-data" id="face-data">
                                            <div id="mediaContainer" className="media-container">
                                                <img src={`/resources/images/${data.filename_old}`} />
                                            </div>
                                        </div>
                                        <div className="function-data">
                                            {isPermisson.can_read && <a onClick={() => infoData(data.file_id)}><i className="bx bxs-show icon" /></a>}
                                            {isPermisson.can_download && <a onClick={() => downloadData(data.file_id, `${data.filename_new}.${data.file_type}`)}><i className='bx bxs-download icon'></i></a>}
                                            {isPermisson.can_share && <a onClick={() => shareData(data.file_id)}><i className="bx bxs-share icon" /></a>}
                                            {isPermisson.can_delete && <a onClick={() => deleteData(data.file_id, data.group_id)}><i className="bx bxs-trash icon" /></a>}
                                        </div>
                                    </div>
                                ))}
                                <div className="base-1">
                                    <i className='bx bxs-file'>Files</i>
                                </div>
                                {Datas.filter(data => data.user_id === userId && fileFileTypes.includes(data.file_type.toUpperCase())).map(data => (
                                    <div className="data" >
                                        <div className="name-data">
                                            <span>{data.filename_new}</span>
                                        </div>
                                        <div className="face-data" id="face-data">
                                            <div id="mediaContainer" className="media-container">
                                                <img src={getImgSrc(data.file_type)} />
                                            </div>
                                        </div>
                                        <div className="function-data">
                                            {isPermisson.can_read && <a onClick={() => infoData(data.file_id)}><i className="bx bxs-show icon" /></a>}
                                            {isPermisson.can_download && <a onClick={() => downloadData(data.file_id, `${data.filename_new}.${data.file_type}`)}><i className='bx bxs-download icon'></i></a>}
                                            {isPermisson.can_share && <a onClick={() => shareData(data.file_id)}><i className="bx bxs-share icon" /></a>}
                                            {isPermisson.can_delete && <a onClick={() => deleteData(data.file_id, data.group_id)}><i className="bx bxs-trash icon" /></a>}
                                        </div>
                                    </div>
                                ))}
                                <div className="base-1">
                                    <i className='bx bxs-videos'>Videos</i>
                                </div>
                                {Datas.filter(data => data.user_id === userId && videoFileTypes.includes(data.file_type.toUpperCase())).map(data => (
                                    <div className="data">
                                        <div className="name-data">
                                            <span>{data.filename_new}</span>
                                        </div>
                                        <div className="face-data" id="face-data">
                                            <div id="mediaContainer" className="media-container">
                                                <video src={`/resources/images/${data.filename_old}`} />
                                            </div>
                                        </div>
                                        <div className="function-data">
                                            {isPermisson.can_read && <a onClick={() => infoData(data.file_id)}><i className="bx bxs-show icon" /></a>}
                                            {isPermisson.can_download && <a onClick={() => downloadData(data.file_id, `${data.filename_new}.${data.file_type}`)}><i className='bx bxs-download icon'></i></a>}
                                            {isPermisson.can_share && <a onClick={() => shareData(data.file_id)}><i className="bx bxs-share icon" /></a>}
                                            {isPermisson.can_delete && <a onClick={() => deleteData(data.file_id, data.group_id)}><i className="bx bxs-trash icon" /></a>}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                </div>
                {/* <div className="button-plus">
                    <a><i className='bx bxs-plus-circle'></i></a>
                </div> */}
            </main>

        </>
    );
};

export default ListDataGroup;
