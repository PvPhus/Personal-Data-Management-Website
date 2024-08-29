import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { useUser } from "../../../constant/userContext";
import Topbar from "../topbar";
import Sidebar from "../sidebar";
import FunctionUser from "../function";

const Search: React.FC = () => {
    const { userId } = useUser();
    const { filename_new } = useParams<{ filename_new: string }>();
    const [Datas, setDatas] = useState<any[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string>('');
    const [message, setMessage] = useState<string>('');
    const navigate = useNavigate();
    const imageFileTypes = ['JPEG', 'JPG', 'GIF', 'TIFF', 'PSD', 'EPS', 'WEBP', 'PNG'];
    const fileFileTypes = ['TXT', 'DOCX', 'PDF', 'PPT', 'JAR', 'DOT', 'HTML', 'DOCM', 'DOC'];
    const videoFileTypes = ['AVI', 'MP4', 'FLV', 'WMV', 'MOV'];

    useEffect(() => {
        const fetchDatas = async () => {
            try {
                setLoading(true); // Bắt đầu quá trình tải dữ liệu
                const response = await axios.get(`https://localhost:7227/api/File/search_file_by_name?user_id=${userId}&filename_new=${filename_new}`);

                if (response.data && response.data.length > 0) {
                    setDatas(response.data);
                    setMessage('File search successfully');
                } else {
                    setDatas([]);
                    setMessage('No data found');
                }

                setTimeout(() => {
                    setMessage('');
                }, 1000);

            } catch (err) {
                setError('Failed to fetch files');
            } finally {
                setLoading(false); // Dừng quá trình tải dữ liệu
            }
        };

        if (userId && filename_new) {
            fetchDatas();
        }
    }, [userId, filename_new]);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

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

    const navigateToFile = (file_id: string) => {
        navigate(`/information/file/${file_id}`);
    };

    const navigateToEdit = (file_id: string) => {
        navigate(`/update/file/${file_id}`);
    };

    const navigateToDelete = (file_id: string) => {
        navigate(`/create/file/${file_id}`);
    };

    const navigateToDownload = (file_id: string) => {
        navigate(`/down/file/${file_id}`);
    };

    const navigateToShare = (file_id: string) => {
        navigate(`/share/file/${file_id}`);
    };

    return (
        <>
            <FunctionUser />
            <Sidebar />
            <Topbar />
            <main>
                {message && (
                    <div className="alert alert-success fixed-top text-center" style={{ zIndex: 1000 }}>
                        {message}
                    </div>
                )}
                <div className="content">
                    <div className="base">
                        <i className='bx bx-image-alt'>Images</i>
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
                                <a onClick={() => navigateToFile(data.file_id)}><i className="bx bxs-show icon" /></a>
                                <a onClick={() => navigateToEdit(data.file_id)}><i className="bx bxs-edit icon" /></a>
                                <a onClick={() => navigateToDelete(data.file_id)}><i className="bx bxs-trash icon" /></a>
                                <a onClick={() => navigateToDownload(data.file_id)}><i className='bx bxs-download icon'></i></a>
                                <a onClick={() => navigateToShare(data.file_id)}><i className="bx bxs-share icon" /></a>
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
                                <a onClick={() => navigateToFile(data.file_id)}><i className="bx bxs-show icon" /></a>
                                <a onClick={() => navigateToEdit(data.file_id)}><i className="bx bxs-edit icon" /></a>
                                <a onClick={() => navigateToDelete(data.file_id)}><i className="bx bxs-trash icon" /></a>
                                <a onClick={() => navigateToDownload(data.file_id)}><i className='bx bxs-download icon'></i></a>
                                <a onClick={() => navigateToShare(data.file_id)}><i className="bx bxs-share icon" /></a>
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
                                <a onClick={() => navigateToFile(data.file_id)}><i className="bx bxs-show icon" /></a>
                                <a onClick={() => navigateToEdit(data.file_id)}><i className="bx bxs-edit icon" /></a>
                                <a onClick={() => navigateToDelete(data.file_id)}><i className="bx bxs-trash icon" /></a>
                                <a onClick={() => navigateToDownload(data.file_id)}><i className='bx bxs-download icon'></i></a>
                                <a onClick={() => navigateToShare(data.file_id)}><i className="bx bxs-share icon" /></a>
                            </div>
                        </div>
                    ))}
                </div>
            </main>
        </>
    );
};

export default Search;
