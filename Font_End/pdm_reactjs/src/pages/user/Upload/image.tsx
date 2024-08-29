import React, { useEffect, useState } from "react";
import axios from "axios";
import { useUser } from '../../../constant/userContext';
import { useNavigate } from "react-router-dom";
import Topbar from "../../../components/user/topbar";
import Sidebar from "../../../components/user/sidebar";
import FunctionUser from "../../../components/user/function";


const Image: React.FC = () => {
    const [Images, setImages] = useState<any[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [errorMessage, serErrorMessage] = useState<string>('');
    const [successMessage, setSuccessMessage] = useState<string>('');
    const { userId } = useUser();
    const navigate = useNavigate();
    const imageFileTypes = ['JPEG', 'JPG', 'GIF', 'TIFF', 'PSD', 'EPS', 'WEBP', 'PNG'];

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
            const response = await axios.get(`https://localhost:7227/api/File/get_all_file_by_user?user_id=${userId}`);
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
    const pushDataInTrash = (
        file_id: number,
        user_id: number, 
        filename_old: string, 
        filename_new: string,
        file_size: number,
        file_type: string, 
        upload_date: Date, 
        last_modified: Date, 
        file_path: string
    ) => {
        const delete_date = new Date();
    
        // Tạo đối tượng dữ liệu mới
        const fromData = {
            file_id,
            user_id,
            filename_old,
            filename_new,
            file_size,
            file_type,
            upload_date,
            last_modified,
            file_path,
            delete_date
        };
    
        const existingData = localStorage.getItem('dataInTrash');
    let dataInTrash = existingData ? JSON.parse(existingData) : [];

    // Ensure dataInTrash is an array
    if (!Array.isArray(dataInTrash)) {
        dataInTrash = [];
    }

    dataInTrash.push(fromData);
    localStorage.setItem('dataInTrash', JSON.stringify(dataInTrash));
    }

    const deleteImage = async (file: any) => {
        const confirmDelete = window.confirm("Are you sure you want to delete this image?");
        if (!confirmDelete) {
            return;
        }

        // Lưu trữ thông tin file vào localStorage trước khi xóa
        pushDataInTrash(
            file.file_id,
            file.user_id,
            file.filename_old,
            file.filename_new,
            file.file_size,
            file.file_type,
            file.upload_date,
            file.last_modified,
            file.file_path
        );
        try {
            await axios.delete(`https://localhost:7227/api/File/delete-file/${file.file_id}`);
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

            <Sidebar />
            <FunctionUser />
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
                    <div className="alert alert-primary text-center" style={{ zIndex: 30, width: "75.5%", position: "fixed", fontSize: "larger", fontWeight: "bold" }}>
                        Images
                    </div>
                    <div className="base">
                        <i className='bx bxs-image'>Images</i>
                    </div>
                    {Images.filter(data => imageFileTypes.includes(data.file_type.toUpperCase())).map(data => (
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
                                <a onClick={() => infoFile(data.file_id)}><i className="bx bxs-show icon" /></a>
                                <a onClick={() => updateImage(data.file_id)}><i className="bx bxs-edit icon" /></a>
                                <a onClick={() => deleteImage(data)}><i className="bx bxs-trash icon" /></a>
                                <a onClick={() => downloadImage(data.file_id, `${data.filename_new}.${data.file_type}`)}><i className='bx bxs-download icon'></i></a>
                                <a onClick={() => shareFile(data.file_id)}><i className="bx bxs-share icon" /></a>
                            </div>
                        </div>
                    ))}
                </div>
                <div className="button-plus">
                    <a role="button" onClick={createFile}><i className='bx bxs-image-add'></i></a>
                </div>
            </main>

        </>
    );
};

export default Image;
