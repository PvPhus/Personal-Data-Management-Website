import React, { useEffect, useState } from "react";
import axios from "axios";
import { useUser } from '../../constant/userContext';
import { useNavigate } from "react-router-dom";
import Topbar from "../../components/user/topbar";

const File: React.FC = () => {
    const [files, setFiles] = useState<any[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [errorMessage, setErrorMessage] = useState<string>('');
    const [successMessage, setSuccessMessage] = useState<string>('');

    const { userId } = useUser();
    const navigate = useNavigate();

    const createFile = () => {
        navigate(`/create/file`);
    };
    const infoFile = async (file_id: number) => {
        navigate(`/information/file/${file_id}`);
    };
    const shareFile = async (file_id: number) => {
        navigate(`/share/file/${file_id}`);
    };

    const deleteFile = async (file_id: number) => {
        const confirmDelete = window.confirm("Are you sure you want to delete this file?");
        if (!confirmDelete) {
            return;
        }
        try {
            await axios.delete(`https://localhost:7227/api/File/delete-file/${file_id}`);
            setSuccessMessage("Deleted the successful!");
            setTimeout(() => {
                fetchFiles();
                setSuccessMessage('');
            }, 1300);
        } catch (err) {
            console.error('Failed to delete file', err);
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
            link.setAttribute('download', filename);
            document.body.appendChild(link);
            link.click();
            link.remove();
            window.URL.revokeObjectURL(url);
        } catch (err) {
            console.error('Failed to download file', err);
        }
    };
    const updateFile = async (file_id: number) => {
        navigate(`/update/file/${file_id}`);
    };

    useEffect(() => {
        fetchFiles();
    }, [userId]);

    const fetchFiles = async () => {
        if (!userId) {
            setErrorMessage('User ID not found');
            setLoading(false);
            return;
        }
        try {
            const response = await axios.get(`https://localhost:7227/api/File/get_files_by_user?user_id=${userId}`);
            setFiles(response.data);
        } catch (err) {
            setErrorMessage('Failed to fetch files');
        } finally {
            setLoading(false);
        }
    };

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
                        Files
                    </div>
                    <div className="base">
                        <i className='bx bxs-videos'>Files</i>
                    </div>
                    {files.map(file => (
                        <div className="data" key={file.file_id}>
                            <div className="name-data">
                                <span>{file.filename_new}</span>
                            </div>
                            <div className="face-data" id="face-data">
                                <div id="mediaContainer" className="media-container">
                                    <iframe
                                        src={getIframeSrc(file.filename_old, file.file_type)}
                                        style={{ width: '100%', height: 'auto' }}
                                    />
                                </div>
                            </div>
                            <div className="function-data">
                                <a onClick={() => infoFile(file.file_id)}><i className="bx bxs-info-circle icon" /></a>
                                <a onClick={() => updateFile(file.file_id)}><i className="bx bxs-edit icon" /></a>
                                <a onClick={() => deleteFile(file.file_id)}><i className="bx bxs-trash icon" /></a>
                                <a onClick={() => downloadFile(file.file_id, `${file.filename_new}.${file.file_type}`)}><i className='bx bxs-download icon'></i></a>
                                <a onClick={() => shareFile(file.file_id)}><i className="bx bxs-share icon" /></a>
                            </div>
                        </div>
                    ))}
                </div>
                <div className="button-plus">
                    <a onClick={createFile}><i className='bx bxs-file-plus'></i></a>
                </div>
            </main>
        </>
    );
};

export default File;
