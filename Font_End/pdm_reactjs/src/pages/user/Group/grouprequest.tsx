import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import TopbarGroup from "../../../components/user/topbargroup";
import Sidebar from "../../../components/user/sidebar";
import FunctionUser from "../../../components/user/function";


const GroupRequest: React.FC = () => {
    const [requests, setRequests] = useState<any[]>([]);
    const { group_id } = useParams<{ group_id: string }>();
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    useEffect(() => {

        fetchRequests();
    }, [group_id]);

    const fetchRequests = async () => {
        try {
            const response = await axios.get(`https://localhost:7227/api/GroupRequest/get_list_request?group_id=${group_id}`);
            setRequests(response.data);
        } catch (error) {
            console.error('Error fetching requests:', error);
        }
    };

    const requestAccept = async (request_id: number) => {
        try {

            const requestResponse = await axios.get(`https://localhost:7227/api/GroupRequest/get_1_request?request_id=${request_id}`);
            const requestData = requestResponse.data;
            await axios.post('https://localhost:7227/api/GroupMember/add_member', {
                user_id: requestData.user_id,
                group_id: requestData.group_id,
            });

            await axios.delete(`https://localhost:7227/api/GroupRequest/delete-request?request_id=${request_id}`);
            setSuccessMessage('Accept Success!');
            setTimeout(() => {
                setSuccessMessage('');
            }, 1300);
            window.location.reload();
        } catch (error) {
            console.error('Error accepting request:', error);
        }
    };

    const requestRefuse = async (request_id: number) => {
        try {
            await axios.delete(`https://localhost:7227/api/GroupRequest/delete-request?request_id=${request_id}`);
            setRequests(requests.filter(request => request.request_id !== request_id));
            setErrorMessage('Refuse Success!');
            setTimeout(() => {
                setErrorMessage('');
            }, 1300);
            window.location.reload();
        } catch (error) {
            console.error('Error refusing request:', error);
        }
    };


    return (
        <>
            <Sidebar />
            <FunctionUser />
            <TopbarGroup />
            <main>
                {successMessage && (
                    <div className="alert alert-success fixed-top text-center" style={{ zIndex: 1000 }}>
                        {successMessage}
                    </div>
                )}
                {errorMessage && (
                    <div className="alert alert-warning fixed-top text-center" style={{ zIndex: 1000 }}>
                        {errorMessage}
                    </div>
                )}
                <div className="content">
                    <div className="alert alert-primary text-center" style={{ zIndex: 30, width: "75.5%", position: "fixed", fontSize: "larger", fontWeight: "bold" }}>
                        List Requests
                    </div>
                    <div className="card shadow mb-4">
                        <div className="card-header py-3">
                            <h6 className="m-0 font-weight-bold text-primary">Request Join Group</h6>
                        </div>
                        <div className="card-body">
                            <div className="table-responsive">
                                <table className="table table-bordered" id="dataTable" width="100%" cellSpacing={0}>
                                    <thead>
                                        <tr>
                                            <th>STT</th>
                                            <th>Tên người dùng</th>
                                            <th>Avatar</th>
                                            <th>Phê duyệt</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {requests.map((request, index) => (
                                            <tr key={request.request_id}>
                                                <td>{index + 1}</td>
                                                <td>{request.username}</td>
                                                <td>
                                                    <img src={`/resources/${request.avatar_url}`} alt="Avatar" style={{ width: 50, height: 50 }} />
                                                </td>
                                                <td>
                                                    <div>
                                                        <button
                                                            onClick={() => requestAccept(request.request_id)}
                                                            className="btn btn-success"
                                                            style={{ height: 40, width: 120 }}
                                                        >
                                                            <i className='bx bxs-user-check'></i>Accept
                                                        </button>
                                                        <button
                                                            onClick={() => requestRefuse(request.request_id)}
                                                            className="btn btn-warning"
                                                            style={{ height: 40, width: 120 }}
                                                        >
                                                            <i className='bx bxs-user-x'></i>Refuse
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

        </>
    );
};

export default GroupRequest;
