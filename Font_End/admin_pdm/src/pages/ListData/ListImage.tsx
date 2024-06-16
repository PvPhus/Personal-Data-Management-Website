import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const ShowImage = () => {
    const [fileList, setFileList] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const [successMessage, setSuccessMessage] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const imageFileTypes = ['JPEG', 'JPG', 'GIF', 'TIFF', 'PSD', 'EPS', 'WEBP', 'PNG'];

    useEffect(() => {
        axios.get("https://localhost:7227/api/File/get_all_files")
            .then(response => {
                setFileList(response.data);
                setLoading(false);
            })
            .catch(error => {
                setErrorMessage("Error fetching data");
                setLoading(false);
                console.error("Error fetching data: ", error);
            });
    }, []);

    const handleDeleteClick = async (file_id: string) => {
        const response = await axios.delete(`https://localhost:7227/api/File/delete-file/${file_id}`);
        if (response.data === true) {
            setSuccessMessage("Xóa thành công!");
            navigate('/show-file');
        }
        else {
            setErrorMessage("Xóa không thành công!");
            setTimeout(() => {
                setErrorMessage("");
            }, 2000);
        }
    }

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    return (
        <div className="container-fluid">
            <div className="d-sm-flex align-items-center justify-content-between mb-4">
                <h1 className="h3 mb-0 text-gray-800">Files</h1>
                
                <a href="#" className="d-none d-sm-inline-block btn btn-sm btn-primary shadow-sm"><i className="fas fa-download fa-sm text-white-50" /> Generate Report</a>
            </div>

            <div className="card-body">
                {successMessage && <div className="alert alert-success">{successMessage}</div>}
                {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}
                <div className="table-responsive">
                    <table className="table table-bordered" id="dataTable" width="100%" cellSpacing={0}>
                        <thead>
                            <tr>
                                <th>STT</th>
                                <th>File Name</th>
                                <th>File Size (KB)</th>
                                <th>File Type</th>
                                <th>Upload Date</th>
                                <th>Last Modified</th>
                                <th>Chức năng</th>
                            </tr>
                        </thead>
                        <tbody>
                        {fileList.filter(file => imageFileTypes.includes(file.file_type.toUpperCase())).map((file, index) => (
                                <tr key={file.file_id}>
                                    <td>{index + 1}</td>
                                    <td>{file.filename_new}</td>
                                    <td>{file.file_size}</td>
                                    <td>{file.file_type.toUpperCase()}</td>
                                    <td>{new Date(file.upload_date).toLocaleDateString()}</td>
                                    <td>{new Date(file.last_modified).toLocaleDateString()}</td>
                                    <td>
                                        <button onClick={() => handleDeleteClick(file.file_id)}>
                                            Xóa
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

export default ShowImage;
