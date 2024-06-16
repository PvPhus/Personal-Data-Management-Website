import React, { useEffect, useState } from "react";
import axios from "axios";
import { useUser } from '../../constant/userContext';
import { useNavigate } from "react-router-dom";
import Topbar from "../../components/user/topbar";

const Alldata: React.FC = () => {
    const [images, setImages] = useState<any[]>([]);
    const [files, setFiles] = useState<any[]>([]);
    const [videos, setVideos] = useState<any[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [errorMessage, serErrorMessage] = useState<string>('');
    const [successMessage, setSuccessMessage] = useState<string>('');
    const { userId } = useUser();
    const navigate = useNavigate();

    useEffect(() => {

        if (userId) {
            fetchImages();
            fetchVideos();
            fetchFiles();
        }
    }, [userId]);

    const fetchImages = async () => {
        try {
            const response = await axios.get(`https://localhost:7227/api/File/get_images_by_user?user_id=${userId}`);
            setImages(response.data);
        } catch (err) {
            serErrorMessage('Failed to fetch Images');
        }
    };

    const fetchVideos = async () => {
        try {
            const response = await axios.get(`https://localhost:7227/api/File/get_videos_by_user?user_id=${userId}`);
            setVideos(response.data);
        } catch (err) {
            serErrorMessage('Failed to fetch Videos');
        }
    };

    const fetchFiles = async () => {
        try {
            const response = await axios.get(`https://localhost:7227/api/File/get_files_by_user?user_id=${userId}`);
            setFiles(response.data);
        } catch (err) {
            serErrorMessage('Failed to fetch files');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    if (errorMessage) {
        return <div>{errorMessage}</div>;
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


    const infoFile = (file_id: string) => {
        navigate(`/information/file/${file_id}`);
    };

    const updateFile = (file_id: string) => {
        navigate(`/update/file/${file_id}`);
    };

    const deleteFile = async (file_id: number) => {
        const confirmDelete = window.confirm("Are you sure you want to delete this file?");
        if (!confirmDelete) {
            return;
        }

        try {
            await axios.delete(`https://localhost:7227/api/File/delete-file/${file_id}`);
            setSuccessMessage("Deleted  successful!");
            setTimeout(() => {
                fetchImages();
                fetchFiles();
                fetchVideos();
                setSuccessMessage('');
            }, 1300);
        } catch (err) {
            console.error('Failed to delete video', err);
            serErrorMessage('Failed to delete file');
        }
    };

    const downloadFile = async (file_id: number, filename: string) => {
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
    const shareFile = (file_id: string) => {
        navigate(`/share/file/${file_id}`);
    };

    return (
        <>
            <Topbar />
            <main>

                {/* Content */}
                {successMessage && (
                    <div className="alert alert-success fixed-top text-center" style={{ zIndex: 1000 }}>
                        {successMessage}
                    </div>
                )}
                <div className="content">
                    <div className="alert alert-primary text-center" style={{ zIndex: 30, width: "75.5%", position:"fixed", fontSize: "larger", fontWeight: "bold" }}>
                        All Data
                    </div>
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
                                <a onClick={() => infoFile(image.file_id)}><i className="bx bxs-show icon" /></a>
                                <a onClick={() => updateFile(image.file_id)}><i className="bx bxs-edit icon" /></a>
                                <a onClick={() => deleteFile(image.file_id)}><i className="bx bxs-trash icon" /></a>
                                <a onClick={() => downloadFile(image.file_id, `${image.filename_new}.${image.file_type}`)}><i className='bx bxs-download icon'></i></a>
                                <a onClick={() => shareFile(image.file_id)}><i className="bx bxs-share icon" /></a>
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
                                <a onClick={() => infoFile(file.file_id)}><i className="bx bxs-show icon" /></a>
                                <a onClick={() => updateFile(file.file_id)}><i className="bx bxs-edit icon" /></a>
                                <a onClick={() => deleteFile(file.file_id)}><i className="bx bxs-trash icon" /></a>
                                <a onClick={() => downloadFile(file.file_id, `${file.filename_new}.${file.file_type}`)}><i className='bx bxs-download icon'></i></a>
                                <a onClick={() => shareFile(file.file_id)}><i className="bx bxs-share icon" /></a>
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
                                <a onClick={() => infoFile(video.file_id)}><i className="bx bxs-show icon" /></a>
                                <a onClick={() => updateFile(video.file_id)}><i className="bx bxs-edit icon" /></a>
                                <a onClick={() => deleteFile(video.file_id)}><i className="bx bxs-trash icon" /></a>
                                <a onClick={() => downloadFile(video.file_id, `${video.filename_new}.${video.file_type}`)}><i className='bx bxs-download icon'></i></a>
                                <a onClick={() => shareFile(video.file_id)}><i className="bx bxs-share icon" /></a>
                            </div>
                        </div>
                    ))}
                </div>
            </main>
        </>
    );
};
export default Alldata;