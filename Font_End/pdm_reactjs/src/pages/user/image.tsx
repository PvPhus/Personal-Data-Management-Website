import React, { useEffect, useState } from "react";
import axios from "axios";
import { useUser } from '../../constant/userContext';
import { useNavigate } from "react-router-dom";
import Topbar from "../../components/user/topbar";

const Image: React.FC = () => {
    const [Images, setImages] = useState<any[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [errorMessage, serErrorMessage] = useState<string>('');
    const [successMessage, setSuccessMessage] = useState<string>('');
    const { userId } = useUser();
    const navigate = useNavigate();

    useEffect(() => {
        fetchImages();
    }, [userId]);

    const fetchImages = async () => {
        if (!userId) {
            serErrorMessage('User ID not found');
            setLoading(false);
            return;
        }

        try {
            const response = await axios.get(`https://localhost:7227/api/File/get_images_by_user?user_id=${userId}`);
            setImages(response.data);
        } catch (err) {
            serErrorMessage('Failed to fetch Images');
        } finally {
            setLoading(false);
        }
    };

    const createFile = () => {
        navigate("/create/file");
    };

    const infoFile = async (file_id: number) => {
        navigate(`/information/file/${file_id}`);
    };

    const shareFile = async (file_id: number) => {
        navigate(`/share/file/${file_id}`);
    };

    const deleteImage = async (file_id: number) => {
        const confirmDelete = window.confirm("Are you sure you want to delete this image?");
        if (!confirmDelete) {
            return;
        }

        try {
            await axios.delete(`https://localhost:7227/api/File/delete-file/${file_id}`);
            setSuccessMessage("Deleted the video successful!");
            setTimeout(() => {
                fetchImages();
                setSuccessMessage('');
            }, 1300);
        } catch (err) {
            console.error('Failed to delete image', err);
            serErrorMessage('Failed to delete image');
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
            console.error('Failed to download image', err);
        }
    };

    const updateImage = (file_id: number) => {
        navigate(`/update/Image/${file_id}`);
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
                {errorMessage && (
                    <div className="alert alert-warning fixed-top text-center">
                        {errorMessage}
                    </div>
                )}
                <div className="content">
                <div className="alert alert-primary text-center" style={{ zIndex: 30, width: "75.5%", position:"fixed", fontSize: "larger", fontWeight: "bold" }}>
                        Images
                    </div>
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
                                    <a onClick={() => infoFile(Image.file_id)}><i className="bx bxs-info-circle icon" /></a>
                                    <a onClick={() => updateImage(Image.file_id)}><i className="bx bxs-edit icon" /></a>
                                    <a onClick={() => deleteImage(Image.file_id)}><i className="bx bxs-trash icon" /></a>
                                    <a onClick={() => downloadImage(Image.file_id, `${Image.filename_new}.${Image.file_type}`)}><i className='bx bxs-download icon'></i></a>
                                    <a onClick={() => shareFile(Image.file_id)}><i className="bx bxs-share icon" /></a>
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
