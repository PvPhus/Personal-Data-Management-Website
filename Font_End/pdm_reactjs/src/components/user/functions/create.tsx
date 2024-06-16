import React, { useState, ChangeEvent, FormEvent } from "react";
import axios from 'axios';
import { useUser } from "../../../constant/userContext";
import { useNavigate } from 'react-router-dom';

const Create = () => {
    const { userId } = useUser();
    const navigate = useNavigate();
    const [message, setMessage] = useState("");
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [fileName, setFileName] = useState("");

    const [fileDetails, setFileDetails] = useState({
        user_id: userId,
        filename_old: "",
        filename_new: "",
        file_size: 0,
        file_type: "",
        upload_date: new Date().toISOString(),
        last_modified: new Date().toISOString(),
        file_path: ""
    });

    const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            setSelectedFile(file);
            setFileDetails({
                ...fileDetails,
                filename_old: file.name,
                file_size: file.size,
                file_type: file.name.split('.').pop() || "",
                last_modified: new Date().toISOString(),
                file_path: file.webkitRelativePath
            });
            setFileName(file.name);
        }
    };

    const handleFileNameChange = (event: ChangeEvent<HTMLInputElement>) => {
        setFileName(event.target.value);
    };

    const handleSubmit = async (event: FormEvent) => {
        event.preventDefault();

        if (!selectedFile) {
            setMessage('Please choose a file before submitting.');
            setTimeout(()=>{
                setMessage('');
            }, 2000);
            
            return;
        }

        const formData = new FormData();
        formData.append('file', selectedFile);

        try {
            // First, upload the file to the specified folder
            const uploadResponse = await axios.post('https://localhost:7227/api/File/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            const filePath = uploadResponse.data.filePath;
            const fileDetailsWithPath = { ...fileDetails, file_path: filePath, filename_new: fileName };

            // Then, save the file details to the database
            const saveDetailsResponse = await axios.post('https://localhost:7227/api/File/create-file', fileDetailsWithPath, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            setMessage('File successfully uploaded and details saved!');
            setTimeout(() => {
                navigate(-1);
            }, 2000);
            console.log('File successfully uploaded and details saved:', saveDetailsResponse.data);
        } catch (error) {
            console.error('There was an error uploading the file!', error);
            setMessage('There was an error uploading the file!');
        }
    };

    return (
        <>
            <main>
                <div className="content">
                <div className="alert alert-primary text-center" style={{ zIndex: 1000, width: "75.5%", position: "fixed", fontSize: "larger", fontWeight: "bold" }}>
                        Upload Data
                    </div>
                    <div style={{marginTop:"65px"}} className="container-fluid">
                        {/* Page Heading */}
                       
                        {/* DataTales Example */}
                        <div className="card shadow mb-4">
                            <div className="card-body">
                                {message && (
                                     <div className="alert alert-success fixed-top text-center" style={{zIndex:1000}}>
                                     {message}
                                 </div>
                                )}
                                <form method="POST" onSubmit={handleSubmit}>
                                    <div className="row">
                                        <div className="col-md-6">
                                            <div className="form-group">
                                                <input
                                                    type="file"
                                                    className="form-control"
                                                    onChange={handleFileChange}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="col-md-6">
                                            <div className="form-group">
                                                <label>Original Name:</label>
                                                <input
                                                    type="text"
                                                    name="filename_old"
                                                    id="filename_old"
                                                    className="form-control"
                                                    value={fileDetails.filename_old}
                                                    readOnly
                                                />
                                            </div>
                                        </div>
                                        <div className="col-md-6">
                                            <div className="form-group">
                                                <label>New Name:</label>
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
                                    </div>
                                    <div className="row">
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
                                    </div>
                                    <div className="row">
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
                                                <label>Created:</label>
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
                                    <button type="submit" className="btn btn-primary text-right">Thêm</button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </>
    );
}

export default Create;
