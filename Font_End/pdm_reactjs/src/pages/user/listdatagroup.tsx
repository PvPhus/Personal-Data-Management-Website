import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { clickTopbar } from "../../assets/js/topbar";
import { useUser } from '../../constant/userContext';
import TopbarGroup from "../../components/user/topbargroup";

const ListDataGroup: React.FC = () => {
    const { group_id } = useParams<{ group_id: string }>();
    const navigate = useNavigate();
    const { userId } = useUser();
    const [Count, setCount] = useState<any>(null);
    const [isPermisson, setIsPermission] = useState<any>(false);
    const [isAdmin, setIsAdmin] = useState(false);
    const [Datas, setDatas] = useState<any[]>([]);
    const [message, setMessage] = useState<string>('');
    const imageFileTypes = ['JPEG', 'JPG', 'GIF', 'TIFF', 'PSD', 'EPS', 'WEBP', 'PNG'];
    const fileFileTypes = ['TXT', 'DOCX', 'PDF', 'PPT', 'JAR', 'DOT', 'HTML', 'DOCM', 'DOC'];
    const videoFileTypes = ['AVI', 'MP4', 'FLV', 'WMV', 'MOV'];

    useEffect(() => {
        fetchGroupData();
        fetchIsAdminStatus();
        fetchPermisson();
    }, [userId, group_id]);

    const fetchGroupData = async () => {
        try {
            const response = await axios.get(`https://localhost:7227/api/Group/get_data_group?user_id=${userId}&group_id=${group_id}`);
            setDatas(response.data);
        } catch (error) {
            console.error('Error fetching group data:', error);
        }
    };
    useEffect(() => {
        const fetchCount = async () => {
            try {
                const response = await axios.get(`https://localhost:7227/api/Group/get_count/${group_id}`);
                setCount(response.data);
            } catch (error) {
                console.error('Error fetching count:', error);
            }
        };
        fetchCount();
    }, [group_id])


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

    const openListRequests = () => {
        navigate(`/openRequests/${group_id}`);
    };

    const openListMembers = () => {
        navigate(`/openMembers/${group_id}`);
    };

    const infoData = (file_id: number) => {
        navigate(`/information/file/${file_id}`);
    };

    const updateData = (file_id: number) => {
        navigate(`/update/file/${file_id}`);
    };

    const shareData = async (file_id: number) => {
        navigate(`/share/file/${file_id}`);
    };

    const deleteData = async (file_id: number) => {
        const confirmDelete = window.confirm("Are you sure you want to delete this file?");
        if (!confirmDelete) {
            return;
        }

        try {
            await axios.delete(`https://localhost:7227/api/File/delete-file/${file_id}`);
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



    const getIframeSrc = (filename_old: string, file_type: string) => {
        switch (file_type) {
            case 'pdf':
            case 'txt':
                return `/resources/images/${filename_old}`;
            case 'docx':
            case 'docm':
            case 'pptx':
            case 'xlsx':
                return `/resources/images/docx.webp`;
            default:
                return `/resources/images/${filename_old}`;
        }
    };

    return (
        <>
            <TopbarGroup />
            <main>
                <div className="content">
                    <div className="alert alert-primary text-center" style={{ zIndex: 30, width: "75.5%", position: "fixed", fontSize: "larger", fontWeight: "bold" }}>
                        List Data For Groups
                    </div>
                    <div className="base">
                        <i className='bx bxs-image'>Images</i>
                        {isAdmin ? (
                            <React.Fragment>
                                <button style={{ float: 'right' }} onClick={openListRequests} className="btn btn-success">
                                    {Count && <span>{Count.total_requests}</span>} List Requests
                                </button>
                                <button style={{ float: 'right' }} onClick={openListMembers} className="btn btn-warning">
                                    {Count && <span>{Count.total_members}</span>} List Members
                                </button>
                            </React.Fragment>
                        ) : null}
                    </div>
                    {Datas.filter(data => imageFileTypes.includes(data.file_type.toUpperCase())).map(data => (
                        <div className="data" key={data.file_id}>
                            <div className="name-data">
                                <span>{data.filename_new}</span>
                            </div>
                            <div className="face-data" id="face-data">
                                <div id="mediaContainer" className="media-container">
                                    <img src={`/resources/images/${data.filename_old}`} />
                                </div>
                            </div>
                            <div className="function-data">
                                {isPermisson.can_read && <a onClick={() => infoData(data.file_id)}><i className="bx bxs-show icon" /></a>}
                                {isPermisson.can_download && <a onClick={() => downloadData(data.file_id, `${data.filename_new}.${data.file_type}`)}><i className='bx bxs-download icon'></i></a>}
                                {isPermisson.can_share && <a onClick={() => shareData(data.file_id)}><i className="bx bxs-share icon" /></a>}
                                {isPermisson.can_delete && <a onClick={() => deleteData(data.file_id)}><i className="bx bxs-trash icon" /></a>}
                            </div>

                        </div>
                    ))}
                    <div className="base">
                        <i className='bx bxs-file'>Files</i>
                    </div>
                    {Datas.filter(data => fileFileTypes.includes(data.file_type.toUpperCase())).map(data => (
                        <div className="data" key={data.file_id}>
                            <div className="name-data">
                                <span>{data.filename_new}</span>
                            </div>
                            <div className="face-data" id="face-data">
                                <div id="mediaContainer" className="media-container">
                                    <iframe src={getIframeSrc(data.filename_old, data.file_type)} style={{ width: '100%', height: 'auto' }} />
                                </div>
                            </div>
                            <div className="function-data">
                                {isPermisson.can_read && <a onClick={() => infoData(data.file_id)}><i className="bx bxs-show icon" /></a>}
                                {isPermisson.can_download && <a onClick={() => downloadData(data.file_id, `${data.filename_new}.${data.file_type}`)}><i className='bx bxs-download icon'></i></a>}
                                {isPermisson.can_share && <a onClick={() => shareData(data.file_id)}><i className="bx bxs-share icon" /></a>}
                                {isPermisson.can_delete && <a onClick={() => deleteData(data.file_id)}><i className="bx bxs-trash icon" /></a>}
                            </div>
                        </div>
                    ))}
                    <div className="base">
                        <i className='bx bxs-videos'>Videos</i>
                    </div>
                    {Datas.filter(data => videoFileTypes.includes(data.file_type.toUpperCase())).map(data => (
                        <div className="data" key={data.file_id}>
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
                                {isPermisson.can_delete && <a onClick={() => deleteData(data.file_id)}><i className="bx bxs-trash icon" /></a>}
                            </div>
                        </div>
                    ))}
                </div>
                <div className="button-plus">
                    <a><i className='bx bxs-plus-circle'></i></a>
                </div>
            </main>
        </>
    );
};

export default ListDataGroup;
