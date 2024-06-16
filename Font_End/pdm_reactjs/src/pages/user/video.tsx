import React, { useEffect, useState } from "react";
import axios from "axios";
import { useUser } from '../../constant/userContext';
import { useNavigate } from "react-router-dom";
import Topbar from "../../components/user/topbar";

const Video: React.FC = () => {
    const [videos, setVideos] = useState<any[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [errorMessage, setErrorMessage] = useState<string>('');
    const [successMessage, setSuccessMessage] = useState<string>('');

    const { userId } = useUser();

    const navigate = useNavigate();

    const createFile = () => {
        navigate("/create/file");
    };

    const infoFile = async (file_id: number) => {
        navigate(`/information/file/${file_id}`);
    };

    const shareFile = async (file_id: number) => {
        navigate(`/share/file/${file_id}`);
    };

    const updateVideo = (file_id: number) => {
        navigate(`/update/Video/${file_id}`);
    };

    useEffect(() => {
        fetchVideos();
    }, [userId]);

    const fetchVideos = async () => {
        if (!userId) {
            setErrorMessage('User ID not found');
            setLoading(false);
            return;
        }
        try {
            const response = await axios.get(`https://localhost:7227/api/File/get_videos_by_user?user_id=${userId}`);
            setVideos(response.data);
        } catch (err) {
            setErrorMessage('Failed to fetch videos');
        } finally {
            setLoading(false);
        }
    };

    const downloadVideo = async (file_id: number, filename: string) => {
        try {
            const response = await axios.get(`https://localhost:7227/api/File/download/${file_id}`, {
                responseType: 'blob',
            });
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', filename);
            document.body.appendChild(link);
            link.click();
            link.remove();
            window.URL.revokeObjectURL(url);
        } catch (err) {
            console.error('Failed to download video', err);
        }
    };

    const deleteVideo = async (file_id: number) => {
        const confirmDelete = window.confirm("Are you sure you want to delete this video?");
        if (!confirmDelete) {
            return;
        }

        try {
            await axios.delete(`https://localhost:7227/api/File/delete-file/${file_id}`);
            setSuccessMessage("Deleted the video successful!");
            setTimeout(() => {
                fetchVideos();
                setSuccessMessage('');
            }, 1300);
        } catch (err) {
            console.error('Failed to delete video', err);
            setErrorMessage('Failed to delete video');
        }
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    if (errorMessage) {
        return <div>{errorMessage}</div>;
    }

    return (
        <>
            <Topbar />
            <main>
                {successMessage && (
                    <div className="alert alert-success fixed-top text-center" style={{ zIndex: 1000 }}>
                        {successMessage}
                    </div>
                )}
                <div className="content">
                <div className="alert alert-primary text-center" style={{ zIndex: 30, width: "75.5%", position:"fixed", fontSize: "larger", fontWeight: "bold" }}>
                        Videos
                    </div>
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
                                    <video src={`/resources/images/${video.filename_old}`} controls />
                                </div>
                            </div>
                            <div className="function-data">
                                <a onClick={() => infoFile(video.file_id)}><i className="bx bxs-info-circle icon" /></a>
                                <a onClick={() => updateVideo(video.file_id)}><i className="bx bxs-edit icon" /></a>
                                <a onClick={() => deleteVideo(video.file_id)}><i className="bx bxs-trash icon" /></a>
                                <a onClick={() => downloadVideo(video.file_id, `${video.filename_new}.${video.file_type}`)}><i className='bx bxs-download icon'></i></a>
                                <a onClick={() => shareFile(video.file_id)}><i className="bx bxs-share icon" /></a>
                            </div>
                        </div>
                    ))}
                </div>
                <div className="button-plus">
                    <a onClick={createFile}><i className='bx bxs-video-plus'></i></a>
                </div>
            </main>
        </>
    );
};

export default Video;
