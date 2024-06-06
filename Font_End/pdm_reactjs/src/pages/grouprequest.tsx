import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import TopbarGroup from "../components/topbargroup";

const GroupRequest: React.FC = () => {
    const [requests, setRequests] = useState<any[]>([]);
    const navigate = useNavigate();
    const { group_id } = useParams<{ group_id: string }>();

    const requestAccept = async (request_id: number) => {
        try {
            // Step 1: Fetch the data of the request
            const requestResponse = await axios.get(`https://localhost:7227/api/GroupRequest/get_1_request?request_id=${request_id}`);
            const requestData = requestResponse.data;

            // Step 2: Add the request data to the GroupMembers table
            await axios.post('https://localhost:7227/api/GroupMember/add_member', {
                user_id: requestData.user_id,
                group_id: requestData.group_id,
                // Leave permission_id and join_date empty
            });

            // Step 3: Delete the record from the GroupRequest table
            await axios.delete(`https://localhost:7227/api/GroupRequest/delete-request?request_id=${request_id}`);

            // After adding the member and deleting the request, you can navigate to a success page or do any other necessary actions
            navigate(`/openRequest/${group_id}`);
        } catch (error) {
            console.error('Error accepting request:', error);
        }
    };

    const requestRefuse = async (request_id: number) => {
        try {
            // Step 1: Delete the record from the GroupRequest table
            await axios.delete(`https://localhost:7227/api/GroupRequest/delete-request?request_id=${request_id}`);

            // Step 2: Update the state to remove the deleted request from the list
            setRequests(requests.filter(request => request.request_id !== request_id));
            navigate(`/openRequest/${group_id}`);
        } catch (error) {
            console.error('Error refusing request:', error);
        }
    };

    useEffect(() => {
        const fetchRequests = async () => {
            try {
                const response = await axios.get(`https://localhost:7227/api/GroupRequest/get_list_request?group_id=${group_id}`);
                setRequests(response.data);
            } catch (error) {
                console.error('Error fetching requests:', error);
            }
        };

        fetchRequests();
    }, [group_id]);

    return (
        <>
            <TopbarGroup />
            <main>
                <div className="content">
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
                                                    <img src={`/resources/images/${request.avatar_url}`} alt="Avatar" style={{ width: 50, height: 50 }} />
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
