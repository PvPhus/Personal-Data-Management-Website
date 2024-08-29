import React, { useEffect, useState } from "react";
import axios from "axios";
import { useUser } from '../../../constant/userContext';
import { useNavigate } from "react-router-dom";

import Sidebar from "../../../components/user/sidebar";
import FunctionUser from "../../../components/user/function";

const DeletedData: React.FC = () => {
    const { userId } = useUser();

    const [files, setFiles] = useState<any[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [errorMessage, setErrorMessage] = useState<string>('');
    const [successMessage, setSuccessMessage] = useState<string>('');

    const imageFileTypes = ['JPEG', 'JPG', 'GIF', 'TIFF', 'PSD', 'EPS', 'WEBP', 'PNG'];
    const fileFileTypes = ['TXT', 'DOCX', 'PDF', 'PPT', 'JAR', 'DOT', 'HTML', 'DOCM', 'DOC'];
    const videoFileTypes = ['AVI', 'MP4', 'FLV', 'WMV', 'MOV'];

    useEffect(() => {
        const dataInTrash = localStorage.getItem('dataInTrash');
        if (dataInTrash) {
            let parsedData = JSON.parse(dataInTrash);

            // Ensure parsedData is an array
            if (!Array.isArray(parsedData)) {
                parsedData = [];
            }

            // Filter data according to user_id
            const filteredData = parsedData.filter((item: any) => item.user_id === userId);
            setFiles(filteredData);
        }
        setLoading(false);
    }, [userId]);

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
            case 'html':
                return `/resources/images/anhfileppt.jpg`;
            case 'css':
                return `/resources/images/anhfileppt.jpg`;
            default:
                return ``;
        }
    };

    const handleRestore = async (file: any) => {
        try {
            const response = await axios.post('https://localhost:7227/api/File/create-file', file);

            if (response.status === 200 || response.status === 201) {
                setSuccessMessage('File restored successfully!');

                // Lấy dữ liệu từ localStorage
                const dataInTrash = localStorage.getItem('dataInTrash');
                if (dataInTrash) {
                    const parsedData = JSON.parse(dataInTrash);

                    // Lọc bỏ file vừa được khôi phục
                    const updatedData = parsedData.filter((item: any) => item.file_id !== file.file_id);

                    // Cập nhật lại localStorage
                    localStorage.setItem('dataInTrash', JSON.stringify(updatedData));

                    // Cập nhật state để render lại danh sách
                    setFiles(updatedData);
                }
            } else {
                setErrorMessage('Failed to restore file');
            }
        } catch (err) {
            console.error('Failed to restore file', err);
            setErrorMessage('Failed to restore file');
        }
    };

    const handleDelete = async (file_id: number) => {
        const confirmDelete = window.confirm("Are you sure you want to delete this file?");
        if (!confirmDelete) {
            return;
        }
        // Xóa file khỏi localStorage
        localStorage.removeItem('dataInTrash');
        setFiles([]);
        setSuccessMessage('File permanently deleted');
    }

    const formatDate = (timestamp: string): string => {
        const date = new Date(timestamp);

        // Extract day, month, and year
        const day = date.getDate();
        const month = date.getMonth() + 1; // Months are zero-based
        const year = date.getFullYear();

        // Format day and month to ensure two digits (e.g., '05' instead of '5')
        const formattedDay = day < 10 ? `0${day}` : day.toString();
        const formattedMonth = month < 10 ? `0${month}` : month.toString();

        // Format the date in 'DD-MM-YYYY'
        return `${formattedDay}-${formattedMonth}-${year}`;
    };

    // Extract unique dates from files
    const uniqueDates = Array.from(new Set(files.map(file => formatDate(file.delete_date))));

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
            <main>
                {successMessage && (
                    <div className="alert alert-success fixed-top text-center" style={{ zIndex: 1000 }}>
                        {successMessage}
                    </div>
                )}
                <div className="content">
                    <div className="alert alert-primary text-center" style={{ zIndex: 30, width: "75.5%", position: "fixed", fontSize: "larger", fontWeight: "bold" }}>
                        Trash
                    </div>
                    <div className="base">
                        {/* Display the first unique date */}
                        {uniqueDates.length > 0 && (
                            <div className="uniqueDate">
                                {uniqueDates[0]}
                            </div>
                        )}
                    </div>
                    {files
                        .filter(data => data.file_type && fileFileTypes.includes(data.file_type.toUpperCase())) 
                        .map(data => (
                        <div className="data" key={data.file_id}>
                            <div className="name-data">
                                <span>{data.filename_new}</span>
                            </div>
                            <div className="face-data" id="face-data">
                                <div id="mediaContainer" className="media-container">
                                    <img src={getImgSrc(data.file_type)} />
                                </div>
                            </div>
                            <div className="function-data">
                                <a onClick={() => handleRestore(data)}><i className='bx bx-revision'></i></a>
                                <a onClick={() => handleDelete(data.file_id)}><i className='bx bxs-trash'></i></a>
                            </div>
                        </div>
                    ))}
                    {files
                        .filter(data => data.file_type && imageFileTypes.includes(data.file_type.toUpperCase()))
                        .map(data => (
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
                                <a onClick={() => handleRestore(data)}><i className='bx bx-revision'></i></a>
                                <a onClick={() => handleDelete(data.file_id)}><i className='bx bxs-trash'></i></a>
                            </div>
                        </div>
                    ))}
                    {files
                        .filter(data => data.file_type && videoFileTypes.includes(data.file_type.toUpperCase()))
                        .map(data => (
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
                                <a onClick={() => handleRestore(data)}><i className='bx bx-revision'></i></a>
                                <a onClick={() => handleDelete(data.file_id)}><i className='bx bxs-trash'></i></a>
                            </div>
                        </div>
                    ))}
                </div>
            </main>
        </>
    );
};

export default DeletedData;
