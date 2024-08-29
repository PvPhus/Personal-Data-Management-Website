import React, { useState, useEffect, ChangeEvent, FormEvent } from "react";
import axios from 'axios';
import { useUser } from "../../../constant/userContext";
import { useNavigate, useParams } from 'react-router-dom';
import Topbar from "../topbar";
import Sidebar from "../sidebar";
import FunctionUser from "../function";

const Information = () => {
    const { userId } = useUser();
    const navigate = useNavigate();
    const { file_id } = useParams<{ file_id: string }>();
    const [message, setMessage] = useState("");
    const [fileName, setFileName] = useState("");
    const imageFileTypes = ['JPEG', 'JPG', 'GIF', 'TIFF', 'PSD', 'EPS', 'WEBP', 'PNG'];
    const fileFileTypes = ['TXT', 'DOCX', 'PDF', 'PPT', 'JAR', 'DOT', 'HTML', 'DOCM', 'DOC'];
    const videoFileTypes = ['AVI', 'MP4', 'FLV', 'WMV', 'MOV'];

    const [fileDetails, setFileDetails] = useState({
        user_id: userId,
        filename_new: "",
        file_type: "",
        file_size: 0,
        upload_date: "",
        last_modified: "",
        file_path: "",
        filename_old: ""
    });

    // Fetch file details from API
    useEffect(() => {
        const fetchFileDetails = async () => {
            try {
                const response = await axios.get(`https://localhost:7227/api/File/get_file_by_fileId?file_id=${file_id}`);
                const fileData = response.data;

                setFileName(fileData.filename_new);
                setFileDetails({
                    user_id: fileData.user_id,
                    filename_new: fileData.filename_new,
                    file_type: fileData.file_type,
                    file_size: fileData.file_size,
                    upload_date: fileData.upload_date,
                    last_modified: fileData.last_modified,
                    file_path: fileData.file_path,
                    filename_old: fileData.filename_old
                });
            } catch (error) {
                console.error('Error fetching file details:', error);
            }
        };

        fetchFileDetails();
    }, [file_id]);

    const handleFileNameChange = (event: ChangeEvent<HTMLInputElement>) => {
        setFileName(event.target.value);
        setFileDetails(prevDetails => ({
            ...prevDetails,
            filename_new: event.target.value
        }));
    };

    const handleUpdate = async (event: FormEvent) => {
        event.preventDefault();
        try {
            const encodedFileName = encodeURIComponent(fileName);

            await axios.put(`https://localhost:7227/api/File/update_name_file?file_id=${file_id}&filename_new=${encodedFileName}`);
            setMessage("File updated successfully!");
            setTimeout(() => {
                navigate(-1)
            }, 2000);
        } catch (error) {
            console.error('Error updating file:', error);
            setMessage("Error updating file.");
        }
    };

    // Function to render the file based on its type
    const renderFile = () => {
        const { file_type, filename_old } = fileDetails;
        if (imageFileTypes.includes(file_type.toUpperCase())) {
            return <img style={{ height: 'auto', width: '50%' }} src={`/resources/images/${filename_old}`} alt="File" className="img-fluid" />;
        } else if (videoFileTypes.includes(file_type.toUpperCase())) {
            return (
                <video style={{ height: 'auto', width: '100%' }} controls className="img-fluid">
                    <source src={`/resources/images/${filename_old}`} type={`video/${file_type.toLowerCase()}`} />
                </video>
            );
        } else if (fileFileTypes.includes(file_type.toUpperCase())) {
            return <iframe src={`/resources/images/${filename_old}`} className="img-fluid" style={{ width: '100%', height: '450px' }} />;
        } else {
            return <p>File type not supported for preview.</p>;
        }
    };

    return (
        <>
            <div className="background-image">
                <Topbar />
                <Sidebar />
                <FunctionUser />
                <main>
                    <div className="content">
                        <div className="alert alert-primary text-center" style={{ zIndex: 30, width: "75.5%", position: "fixed", fontSize: "larger", fontWeight: "bold" }}>
                            Properties
                        </div>
                        <div style={{ marginTop: "65px" }} className="container-fluid">
                            {/* Page Heading */}

                            {/* DataTales Example */}
                            <div className="card shadow mb-4">
                                <div className="card-body">
                                    {message && (
                                        <div className="alert alert-success fixed-top text-center" style={{ zIndex: 1000 }}>
                                            {message}
                                        </div>
                                    )}
                                    <form method="POST" onSubmit={handleUpdate}>
                                        <div className="row">
                                            <div className="col-md-6">
                                                <div className="form-group">
                                                    <label>Name:</label>
                                                    <input
                                                        type="text"
                                                        name="filename_new"
                                                        id="filename_new"
                                                        className="form-control"
                                                        value={fileName}
                                                        onChange={handleFileNameChange}
                                                    />
                                                </div>
                                            </div>

                                            <div className="col-md-6">
                                                <div className="form-group">
                                                    <label>Type of file:</label>
                                                    <input
                                                        type="text"
                                                        name="file_type"
                                                        id="file_type"
                                                        className="form-control"
                                                        value={fileDetails.file_type}
                                                        readOnly
                                                    />
                                                </div>
                                            </div>
                                            <div className="col-md-6">
                                                <div className="form-group">
                                                    <label>Size (bytes):</label>
                                                    <input
                                                        type="text"
                                                        name="file_size"
                                                        id="file_size"
                                                        className="form-control"
                                                        value={fileDetails.file_size.toString()}
                                                        readOnly
                                                    />
                                                </div>
                                            </div>
                                            <div className="col-md-6">
                                                <div className="form-group">
                                                    <label>Upload Date:</label>
                                                    <input
                                                        type="datetime-local"
                                                        name="upload_date"
                                                        id="upload_date"
                                                        className="form-control"
                                                        value={fileDetails.upload_date.split('.')[0]}
                                                        readOnly
                                                    />
                                                </div>
                                            </div>
                                            <div className="col-md-6">
                                                <div className="form-group">
                                                    <label>Modified:</label>
                                                    <input
                                                        type="datetime-local"
                                                        name="last_modified"
                                                        id="last_modified"
                                                        className="form-control"
                                                        value={fileDetails.last_modified.split('.')[0]}
                                                        readOnly
                                                    />
                                                </div>
                                            </div>
                                            <div className="col-md-6">
                                                <div className="form-group">
                                                    <label>Location:</label>
                                                    <input
                                                        type="text"
                                                        name="file_path"
                                                        id="file_path"
                                                        className="form-control"
                                                        value={fileDetails.file_path}
                                                        readOnly
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-md-6" style={{ justifyContent: 'center', width: '100%', alignItems: 'center' }}>
                                            <div className="form-group">
                                                <label>Preview:</label>
                                                {renderFile()}
                                            </div>
                                        </div>

                                        <button type="submit" className="btn btn-primary">Update</button>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </>
    );
}

export default Information;
