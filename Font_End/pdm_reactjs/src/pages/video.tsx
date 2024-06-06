import React, { useEffect, useState } from "react";
import axios from "axios";
import { useUser } from '../constant/userContext';
import { useNavigate } from "react-router-dom";
import Topbar from "../components/topbar";

const Video: React.FC = () => {
    const [videos, setVideos] = useState<any[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string>('');
    const { userId } = useUser();

    const navigate = useNavigate();

    const createFile = () => {
        navigate("/create/file");
    };

    const seeVideo = (file_id: number) => {
        navigate(`/see/Video/${file_id}`);
    };

    const shareVideo = (file_id: number) => {
        navigate(`/share/Video/${file_id}`);
    };

    const updateVideo = (file_id: number) => {
        navigate(`/update/Video/${file_id}`);
    };

    const downloadVideo = async (file_id: number, filename: string) => {
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
            // Reload the list of videos after deletion
            const response = await axios.get(`https://localhost:7227/api/File/get_videos_by_user?user_id=${userId}`);
            setVideos(response.data);
        } catch (err) {
            console.error('Failed to delete video', err);
            setError('Failed to delete video');
        }
    };

    useEffect(() => {
        const fetchVideos = async () => {
            if (!userId) {
                setError('User ID not found');
                setLoading(false);
                return;
            }

            try {
                const response = await axios.get(`https://localhost:7227/api/File/get_videos_by_user?user_id=${userId}`);
                setVideos(response.data);
            } catch (err) {
                setError('Failed to fetch videos');
            } finally {
                setLoading(false);
            }
        };

        fetchVideos();
    }, [userId]);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    return (
        <>
            <Topbar />
            <main>
                <div className="content">
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
                                <a onClick={() => seeVideo(video.file_id)}><i className="bx bxs-show icon" /></a>
                                <a onClick={() => updateVideo(video.file_id)}><i className="bx bxs-edit icon" /></a>
                                <a onClick={() => deleteVideo(video.file_id)}><i className="bx bxs-trash icon" /></a>
                                <a onClick={() => downloadVideo(video.file_id, `${video.filename_new}.${video.file_type}`)}><i className='bx bxs-download icon'></i></a>
                                <a onClick={() => shareVideo(video.file_id)}><i className="bx bxs-share icon" /></a>
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
