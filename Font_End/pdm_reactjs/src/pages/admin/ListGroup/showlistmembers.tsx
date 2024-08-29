import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import ReactPaginate from 'react-paginate';
import Sidebar from "../../../components/admin/sidebar";
import Topbar from "../../../components/admin/content/topbar";
import Logout from "../../../components/admin/logout";

const ShowListMembers = () => {
    const [groupList, setGroupList] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { group_id } = useParams<{ group_id: string }>(); // Use useParams to get group_id from the URL
    const navigate = useNavigate();
    const [successMessage, setSuccessMessage] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [currentPage, setCurrentPage] = useState(0);
    const [itemsPerPage] = useState(5);

    useEffect(() => {
        axios.get(`https://localhost:7227/api/GroupMember/groupMembers/${group_id}`)
            .then(response => {
                setGroupList(response.data);
                setLoading(false);
            })
            .catch(error => {
                setErrorMessage("Error fetching data");
                setLoading(false);
                console.error("Error fetching data: ", error);
            });
    }, [group_id]); // Add group_id as a dependency

    const handleDelete = async (file_id: number) => {
        const response = await axios.delete(`https://localhost:7227/api/File/delete-file/${file_id}`);
        if (response.data === true) {
            setSuccessMessage("Xóa thành công!");
            navigate('/show-groups');
        } else {
            setErrorMessage("Xóa không thành công!");
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
    const currentPageData = groupList.slice(offset, offset + itemsPerPage);
    const pageCount = Math.ceil(groupList.length / itemsPerPage);

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
                                <h1 className="h3 mb-0 text-gray-800">List Members</h1>

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
                                                <th>Group Image</th>
                                                <th>Group Name</th>
                                                <th>Leader Name</th>
                                                <th>Created Date</th>
                                                <th>Total Members</th>
                                                <th>Chức năng</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {currentPageData.map((group, index) => (
                                                <tr key={group.group_id}>
                                                    <td>{index + 1}</td>
                                                    <td>
                                                        <img src={`/images/${group.group_image}`} alt="Group Image" style={{ width: 50, height: 50 }} />
                                                    </td>
                                                    <td>{group.group_name}</td>
                                                    <td>{group.username}</td>
                                                    <td>{new Date(group.created_date).toLocaleDateString()}</td>
                                                    <td>{group.total_members}</td>
                                                    <td>
                                                        <button onClick={() => handleDelete(group.file_id)}>
                                                            Delete Group
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

export default ShowListMembers;
