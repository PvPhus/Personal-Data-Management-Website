import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import ReactPaginate from 'react-paginate';
import Logout from "../../../components/admin/logout";
import Sidebar from "../../../components/admin/sidebar";
import Topbar from "../../../components/admin/content/topbar";

const ShowVideos = () => {
    const [fileList, setFileList] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const [successMessage, setSuccessMessage] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [currentPage, setCurrentPage] = useState(0);
    const [itemsPerPage] = useState(5);
    const videoFileTypes = ['AVI', 'MP4', 'FLV', 'WMV', 'MOV'];

    useEffect(() => {
        axios.get("https://localhost:7227/api/File/get_all_files")
            .then(response => {
                console.log("API Response: ", response.data); // Log the response data
                setFileList(response.data);
                setLoading(false);
            })
            .catch(error => {
                console.error("Error fetching data: ", error);
                setErrorMessage("Error fetching data");
                setLoading(false);
            });
    }, []);

    const handleDeleteClick = async (file_id: string) => {
        try {
            const response = await axios.delete(`https://localhost:7227/api/File/delete-file/${file_id}`);
            if (response.data === true) {
                setSuccessMessage("Xóa thành công!");
                // Fetch the updated file list after deletion
                const updatedList = fileList.filter(file => file.file_id !== file_id);
                setFileList(updatedList);
                navigate('/show-file');
            } else {
                setErrorMessage("Xóa không thành công!");
                setTimeout(() => {
                    setErrorMessage("");
                }, 2000);
            }
        } catch (error) {
            console.error("Error deleting file: ", error);
            setErrorMessage("Error deleting file");
            setTimeout(() => {
                setErrorMessage("");
            }, 2000);
        }
    }

    const handlePageClick = (data: { selected: number }) => {
        setCurrentPage(data.selected);
    };

    // Calculate the offset and current page data
    const offset = currentPage * itemsPerPage;
    const currentPageData = fileList.slice(offset, offset + itemsPerPage);
    const pageCount = Math.ceil(fileList.length / itemsPerPage);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    return (
        <body id="page-top">
            <div id="wrapper">
                <Sidebar />
                <div id="content-wrapper" className="d-flex flex-column">
                    <div id="content">
                        <Topbar />
                        <div className="container-fluid">
                            <div className="d-sm-flex align-items-center justify-content-between mb-4">
                                <h1 className="h3 mb-0 text-gray-800">Videos</h1>
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
                                            {fileList.filter(file => videoFileTypes.includes(file.file_type.toUpperCase())).map((file, index) => (
                                                <tr key={file.file_id}>
                                                    <td>{offset + index + 1}</td>
                                                    <td>{file.filename_new}</td>
                                                    <td>{file.file_size}</td>
                                                    <td>{file.file_type.toUpperCase()}</td>
                                                    <td>{new Date(file.upload_date).toLocaleDateString()}</td>
                                                    <td>{new Date(file.last_modified).toLocaleDateString()}</td>
                                                    <td>
                                                        <button className="btn btn-warning" onClick={() => handleDeleteClick(file.file_id)}>
                                                            Xóa
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                                <ReactPaginate
                                    previousLabel={"Previous"}
                                    nextLabel={"Next"}
                                    breakLabel={"..."}
                                    breakClassName={"break-me"}
                                    pageCount={pageCount}
                                    marginPagesDisplayed={2}
                                    pageRangeDisplayed={5}
                                    onPageChange={handlePageClick}
                                    containerClassName={"pagination justify-content-center"}
                                    activeClassName={"active"}
                                    pageClassName={"page-item"}
                                    pageLinkClassName={"page-link"}
                                    previousClassName={"page-item"}
                                    previousLinkClassName={"page-link"}
                                    nextClassName={"page-item"}
                                    nextLinkClassName={"page-link"}
                                    breakLinkClassName={"page-link"}
                                />
                            </div>
                        </div>
                    </div>
                </div>
                <Logout />
            </div>
        </body>
    );
}

export default ShowVideos;
