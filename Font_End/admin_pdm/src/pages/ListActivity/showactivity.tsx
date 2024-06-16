import React, { useState, useEffect } from "react";
import axios from "axios";

const ShowActivity = () => {
    const [activityList, setActivityList] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        axios.get("https://localhost:7227/api/User/get_all_activity")
            .then(response => {
                setActivityList(response.data);
                setLoading(false);
            })
            .catch(error => {
                setLoading(false);
                console.error("Error fetching data: ", error);
            });
    }, []);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    return (
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
                                <th>Description</th>
                                <th>Time Log</th>
                                <th>Time Out</th>
                            </tr>
                        </thead>
                        <tbody>
                            {activityList.map((activity, index) => (
                                <tr key={index}>
                                    <td>{index + 1}</td>
                                    <td>{activity.user_id}</td>
                                    <td>{activity.description}</td>
                                    <td>{activity.time_log ? new Date(activity.time_log).toLocaleString() : ''}</td>
                                    <td>{activity.time_out ? new Date(activity.time_out).toLocaleString() : ''}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

export default ShowActivity;
