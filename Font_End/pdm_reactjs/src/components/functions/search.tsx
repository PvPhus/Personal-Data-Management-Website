import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { useUser } from "../../constant/userContext";
import Topbar from "../topbar";

const Search: React.FC = () => {
    const { userId } = useUser();
    const { filename_new } = useParams<{ filename_new: string }>();
    const [Datas, setDatas] = useState<any[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string>('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchDatas = async () => {
            try {
                const response = await axios.get(`https://localhost:7227/api/File/search_file_by_name?user_id=${userId}&filename_new=${filename_new}`);
                setDatas(response.data);
                setLoading(false);
            } catch (err) {
                setError('Failed to fetch files');
                setLoading(false);
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
        navigate(`/see/Image/${file_id}`);
    };

    const navigateToEdit = (file_id: string) => {
        navigate(`/update/Image/${file_id}`);
    };

    const navigateToDelete = (file_id: string) => {
        navigate(`/create/Image/${file_id}`);
    };

    const navigateToDownload = (file_id: string) => {
        navigate(`/down/Image/${file_id}`);
    };

    const navigateToShare = (file_id: string) => {
        navigate(`/share/Image/${file_id}`);
    };

    return (
        <>
           <Topbar />
            <main>
                <div className="content">
                    <div className="base">
                        <i className='bx bx-image-alt'>Images</i>
                    </div>
                    {Datas.filter(data => data.file_type === 'image').map(data => (
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
                    {Datas.filter(data => data.file_type !== 'image' && data.file_type !== 'mp4').map(data => (
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
                    {Datas.filter(data => data.file_type === 'mp4').map(data => (
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
