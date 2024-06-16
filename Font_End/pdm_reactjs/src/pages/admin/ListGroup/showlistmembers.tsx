import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

const ShowListMembers = () => {
    const [groupList, setGroupList] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { group_id } = useParams<{ group_id: string }>(); // Use useParams to get group_id from the URL
    const navigate = useNavigate();
    const [successMessage, setSuccessMessage] = useState("");
    const [errorMessage, setErrorMessage] = useState("");

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

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    return (
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
                            {groupList.map((group, index) => (
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
            </div>
        </div>
    );
}

export default ShowListMembers;