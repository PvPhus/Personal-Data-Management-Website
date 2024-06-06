import React, { useEffect, useState } from "react";
import axios from "axios";
import { useUser } from '../constant/userContext';
import { useNavigate } from "react-router-dom";
import Topbar from "../components/topbar";

const Image: React.FC = () => {
    const [Images, setImages] = useState<any[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string>('');
    const { userId } = useUser();

    const navigate = useNavigate();

    const createFile = () => {
        navigate("/create/file");
    };
    const seeImage = () => {
        navigate("/see/Image/{file_id}");
    };
    const shareImage = () => {
        navigate("/share/Image/{file_id}");
    };
    const deleteImage = async (file_id: number) => {
        const confirmDelete = window.confirm("Are you sure you want to delete this video?");
        if (!confirmDelete) {
            return;
        }

        try {
            await axios.delete(`https://localhost:7227/api/File/delete-file/${file_id}`);
            // Reload the list of videos after deletion
            const response = await axios.get(`https://localhost:7227/api/File/get_images_by_user?user_id=${userId}`);
            setImages(response.data);
        } catch (err) {
            console.error('Failed to delete video', err);
            setError('Failed to delete video');
        }
    };
    const downloadImage = async (file_id: number, filename: string) => {
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
    const updateImage = () => {
        navigate("/update/Image/{file_id}");
    };

    useEffect(() => {
        const fetchImages = async () => {
            if (!userId) {
                setError('User ID not found');
                setLoading(false);
                return;
            }

            try {
                const response = await axios.get(`https://localhost:7227/api/File/get_images_by_user?user_id=${userId}`);
                setImages(response.data);
            } catch (err) {
                setError('Failed to fetch Images');
            } finally {
                setLoading(false);
            }
        };

        if (userId) {
            fetchImages();
        }
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
                        <i className='bx bxs-image'>Images</i>
                    </div>
                    {Images.map(Image => (
                        <div className="data" key={Image.file_id}>
                            <div className="name-data">
                                <span>{Image.filename_new}</span>
                            </div>
                            <div className="face-data" id="face-data">
                                <div id="mediaContainer" className="media-container">
                                    <img src={`/resources/images/${Image.filename_old}`} />
                                </div>
                            </div>
                            <div className="function-data">
                                <div className="function-data">
                                    <a onClick={seeImage}><i className="bx bxs-show icon" /></a>
                                    <a onClick={updateImage}><i className="bx bxs-edit icon" /></a>
                                    <a onClick={() => deleteImage(Image.file_id)}><i className="bx bxs-trash icon" /></a>
                                    <a onClick={() => downloadImage(Image.file_id, `${Image.filename_new}.${Image.file_type}`)}><i className='bx bxs-download icon'></i></a>
                                    <a onClick={shareImage}><i className="bx bxs-share icon" /></a>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
                <div className="button-plus">
                    <a onClick={createFile}><i className='bx bxs-image-add'></i></a>
                </div>
            </main>
        </>
    );
};

export default Image;
