import React, { useEffect, useState } from "react";
import axios from "axios";
import { useUser } from '../constant/userContext';
import { useNavigate } from "react-router-dom";
import Topbar from "../components/topbar";

const Alldata: React.FC = () => {
    const [images, setImages] = useState<any[]>([]);
    const [files, setFiles] = useState<any[]>([]);
    const [videos, setVideos] = useState<any[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string>('');
    const { userId } = useUser();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchImages = async () => {
            try {
                const response = await axios.get(`https://localhost:7227/api/File/get_images_by_user?user_id=${userId}`);
                setImages(response.data);
            } catch (err) {
                setError('Failed to fetch Images');
            }
        };

        const fetchVideos = async () => {
            try {
                const response = await axios.get(`https://localhost:7227/api/File/get_videos_by_user?user_id=${userId}`);
                setVideos(response.data);
            } catch (err) {
                setError('Failed to fetch Videos');
            }
        };

        const fetchFiles = async () => {
            try {
                const response = await axios.get(`https://localhost:7227/api/File/get_files_by_user?user_id=${userId}`);
                setFiles(response.data);
            } catch (err) {
                setError('Failed to fetch files');
            } finally {
                setLoading(false);
            }
        };
        if (userId) {
            fetchImages();
            fetchVideos();
            fetchFiles();
        }
    }, [userId]);

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
                {/* Content */}

                <div className="content">
                    {/* Images */}
                    <div className="base">
                        <i className='bx bx-image-alt'>Images</i>
                    </div>
                    {images.map(image => (
                        <div className="data" key={image.file_id}>
                            <div className="name-data">
                                <span>{image.filename_new}</span>
                            </div>
                            <div className="face-data" id="face-data">
                                <div id="mediaContainer" className="media-container">
                                    <img src={`/resources/images/${image.filename_old}`} />
                                </div>
                            </div>
                            <div className="function-data">
                                <a onClick={() => navigateToFile(image.file_id)}><i className="bx bxs-show icon" /></a>
                                <a onClick={() => navigateToEdit(image.file_id)}><i className="bx bxs-edit icon" /></a>
                                <a onClick={() => navigateToDelete(image.file_id)}><i className="bx bxs-trash icon" /></a>
                                <a onClick={() => navigateToDownload(image.file_id)}><i className='bx bxs-download icon'></i></a>
                                <a onClick={() => navigateToShare(image.file_id)}><i className="bx bxs-share icon" /></a>
                            </div>
                        </div>
                    ))}
                    {/* Files */}
                    <div className="base">
                        <i className='bx bxs-file'>Files</i>
                    </div>
                    {files.map(file => (
                        <div className="data" key={file.file_id}>
                            <div className="name-data">
                                <span>{file.filename_new}</span>
                            </div>
                            <div className="face-data" id="face-data">
                                <div id="mediaContainer" className="media-container">
                                    <iframe src={getIframeSrc(file.filename_old, file.file_type)} style={{ width: '100%', height: 'auto' }} />
                                </div>
                            </div>
                            <div className="function-data">
                                <a onClick={() => navigateToFile(file.file_id)}><i className="bx bxs-show icon" /></a>
                                <a onClick={() => navigateToEdit(file.file_id)}><i className="bx bxs-edit icon" /></a>
                                <a onClick={() => navigateToDelete(file.file_id)}><i className="bx bxs-trash icon" /></a>
                                <a onClick={() => navigateToDownload(file.file_id)}><i className='bx bxs-download icon'></i></a>
                                <a onClick={() => navigateToShare(file.file_id)}><i className="bx bxs-share icon" /></a>
                            </div>
                        </div>
                    ))}

                    {/* Videos */}
                    <div className="base">
                        <i className='bx bxs-videos'>Videos</i>
                    </div>
                    {videos.map(video => (
                        <div className="data" key={video.file_id}>
                            <div className="name-data">
                                <span>{video.filename_new}</span>
                            </div>
                            <div className="face-data" id="face-data">
                                <div id="mediaContainer" className="media-container">
                                    <video src={`/resources/images/${video.filename_old}`} />
                                </div>
                            </div>
                            <div className="function-data">
                                <a onClick={() => navigateToFile(video.file_id)}><i className="bx bxs-show icon" /></a>
                                <a onClick={() => navigateToEdit(video.file_id)}><i className="bx bxs-edit icon" /></a>
                                <a onClick={() => navigateToDelete(video.file_id)}><i className="bx bxs-trash icon" /></a>
                                <a onClick={() => navigateToDownload(video.file_id)}><i className='bx bxs-download icon'></i></a>
                                <a onClick={() => navigateToShare(video.file_id)}><i className="bx bxs-share icon" /></a>
                            </div>
                        </div>
                    ))}
                </div>
            </main>
        </>
    );
};
export default Alldata;