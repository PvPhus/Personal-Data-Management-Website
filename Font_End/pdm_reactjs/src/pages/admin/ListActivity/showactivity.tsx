import React, { useState, useEffect } from "react";
import axios from "axios";
import ReactPaginate from 'react-paginate';
import Logout from "../../../components/admin/logout";
import Sidebar from "../../../components/admin/sidebar";
import Topbar from "../../../components/admin/content/topbar";

const ShowActivity = () => {
    const [activityList, setActivityList] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(0);
    const [itemsPerPage] = useState(5);

    useEffect(() => {
        axios.get("https://localhost:7227/api/User/get_all_activity")
            .then(response => {
                setActivityList(response.data);
                setLoading(false);
            })
            .catch(error => {
                setLoading(false);
                setError(error.message);
                console.error("Error fetching data: ", error);
            });
    }, []);

    const handlePageClick = (data: { selected: number }) => {
        setCurrentPage(data.selected);
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    // Calculate the offset and current page data
    const offset = currentPage * itemsPerPage;
    const currentPageData = activityList.slice(offset, offset + itemsPerPage);
    const pageCount = Math.ceil(activityList.length / itemsPerPage);

    return (
        <body id="page-top">
            <div id="wrapper">
                <Sidebar />
                <div id="content-wrapper" className="d-flex flex-column">
                    <div id="content">
                        <Topbar />
                        <div className="container-fluid">
                            <div className="d-sm-flex align-items-center justify-content-between mb-4">
                                <h1 className="h3 mb-0 text-gray-800">Activity Log</h1>
                            </div>

                            <div className="card-body">
                                <div className="table-responsive">
                                    <table className="table table-bordered" id="dataTable" width="100%" cellSpacing={0}>
                                        <thead>
                                            <tr>
                                                <th>STT</th>
                                                <th>User ID</th>
                                                <th>User Name</th>
                                                <th>Avatar</th>
                                                <th>Description</th>
                                                <th>Time Log</th>
                                                <th>Time Out</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {currentPageData.map((activity, index) => (
                                                <tr key={index}>
                                                    <td>{offset + index + 1}</td>
                                                    <td>{activity.user_id}</td>
                                                    <td>{activity.username}</td>
                                                    <td><img src={`resources/${activity.avatar_url}`} alt="Avatar" style={{ width: 50, height: 50 }} /></td>
                                                    <td>{activity.description}</td>
                                                    <td>{activity.time_log ? new Date(activity.time_log).toLocaleString() : ''}</td>
                                                    <td>{activity.time_out ? new Date(activity.time_out).toLocaleString() : ''}</td>
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

export default ShowActivity;
