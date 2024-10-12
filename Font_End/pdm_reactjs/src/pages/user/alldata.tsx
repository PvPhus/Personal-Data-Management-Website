import React, { useEffect, useState } from "react";
import axios from "axios";
import { useUser } from '../../constant/userContext';
import { useNavigate } from "react-router-dom";
import Topbar from "../../components/user/topbar";
import Sidebar from "../../components/user/sidebar";
import FunctionUser from "../../components/user/function";
import { clickRightMouse } from "../../assets/js/rightmouse";
import RightMouse from "../../components/user/rightMouseData";


const Alldata: React.FC = () => {
    const [Datas, setDatas] = useState<any[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [errorMessage, setErrorMessage] = useState<string>('');
    const [successMessage, setSuccessMessage] = useState<string>('');
    const { userId } = useUser();
    const navigate = useNavigate();
    const imageFileTypes = ['JPEG', 'JPG', 'GIF', 'TIFF', 'PSD', 'EPS', 'WEBP', 'PNG'];
    const fileFileTypes = ['TXT', 'DOCX', 'PDF', 'PPT', 'JAR', 'DOT', 'HTML', 'DOCM', 'DOC'];
    const videoFileTypes = ['AVI', 'MP4', 'FLV', 'WMV', 'MOV'];

    useEffect(() => {
        clickRightMouse();
        if (userId) {
            fetchDatas();
        }
    }, [userId]);

    const fetchDatas = async () => {
        if (!userId) {
            setErrorMessage('User ID not found');
            setLoading(false);
            return;
        }
        try {
            const response = await axios.get(`https://localhost:7227/api/File/get_all_file_by_user?user_id=${userId}`);
            setLoading(false);
            setDatas(response.data);
        } catch (err) {
            setErrorMessage('Failed to fetch Datas');
            setLoading(false);
        }
    };


    const getImgSrc = (file_type: string) => {
        switch (file_type) {
            case 'pdf':
                return `/resources/images/anhfilepdf.jpg`;
            case 'txt':
                return `/resources/images/anhfiletext.png`;
            case 'docx':
            case 'docm':
                return `/resources/images/docx.webp`;
            case 'pptx':
                return `/resources/images/anhfileppt.jpg`;
            case 'xlsx':
                return `/resources/images/anhfileexcel.jpg`;
            default:
                return ``;
        }
    };


    const infoFile = (file_id: string) => {
        navigate(`/information/${file_id}`);
    };

    // const updateFile = (file_id: string) => {
    //     navigate(`/update/file/${file_id}`);
    // };
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
    const deleteFile = async (file: any) => {
        const confirmDelete = window.confirm("Are you sure you want to delete this file?");
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
            setSuccessMessage("Deleted  successful!");
            setTimeout(() => {
                fetchDatas();
                setSuccessMessage('');
            }, 1300);
        } catch (err) {
            console.error('Failed to delete video', err);
            setErrorMessage('Failed to delete file');
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
        navigate(`/share/${file_id}`);
    };

    return (
        <>
            <RightMouse />
            <Sidebar />
            <FunctionUser />
            <Topbar />
            <main>

                {/* Content */}
                {successMessage && (
                    <div className="alert alert-success fixed-top text-center" style={{ zIndex: 1000 }}>
                        {successMessage}
                    </div>
                )}
                <div className="content">
                    <div className="alert alert-primary text-center" style={{ zIndex: 30, width: "75.5%", position: "fixed", fontSize: "larger", fontWeight: "bold" }}>
                        All Data
                    </div>
                    {/* Images */}
                    <div className="base">
                        <i className='bx bx-image-alt'>Images</i>
                    </div>
                    {loading ? (
                        <div>Loading...</div>
                    ) : errorMessage ? (
                        <div>{errorMessage}</div>
                    ) : (
                        Datas.filter(data => imageFileTypes.includes(data.file_type.toUpperCase())).map(data => (
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
                                    {/* <a onClick={() => updateFile(data.file_id)}><i className="bx bxs-edit icon" /></a> */}
                                    <a onClick={() => deleteFile(data)}><i className="bx bxs-trash icon" /></a>
                                    <a onClick={() => downloadFile(data.file_id, `${data.filename_new}.${data.file_type}`)}><i className='bx bxs-download icon'></i></a>
                                    <a onClick={() => shareFile(data.file_id)}><i className="bx bxs-share icon" /></a>
                                </div>
                            </div>
                        ))
                    )}
                    {/* Files */}
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
                                    {/* <iframe src={getIframeSrc(data.filename_old, data.file_type)}/> */}
                                    <img src={getImgSrc(data.file_type)} />
                                </div>
                            </div>
                            <div className="function-data">
                                <a onClick={() => infoFile(data.file_id)}><i className="bx bxs-show icon" /></a>
                                {/* <a onClick={() => updateFile(data.file_id)}><i className="bx bxs-edit icon" /></a> */}
                                <a onClick={() => deleteFile(data)}><i className="bx bxs-trash icon" /></a>
                                <a onClick={() => downloadFile(data.file_id, `${data.filename_new}.${data.file_type}`)}><i className='bx bxs-download icon'></i></a>
                                <a onClick={() => shareFile(data.file_id)}><i className="bx bxs-share icon" /></a>
                            </div>
                        </div>
                    ))}

                    {/* Videos */}
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
                                <a onClick={() => infoFile(data.file_id)}><i className="bx bxs-show icon" /></a>
                                {/* <a onClick={() => updateFile(data.file_id)}><i className="bx bxs-edit icon" /></a> */}
                                <a onClick={() => deleteFile(data)}><i className="bx bxs-trash icon" /></a>
                                <a onClick={() => downloadFile(data.file_id, `${data.filename_new}.${data.file_type}`)}><i className='bx bxs-download icon'></i></a>
                                <a onClick={() => shareFile(data.file_id)}><i className="bx bxs-share icon" /></a>
                            </div>
                        </div>
                    ))}
                </div>
            </main>

        </>
    );
};
export default Alldata;