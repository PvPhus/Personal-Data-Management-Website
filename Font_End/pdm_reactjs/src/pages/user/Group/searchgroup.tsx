import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { useUser } from '../../../constant/userContext';
import TopbarGroup from "../../../components/user/topbargroup";
import FunctionUser from "../../../components/user/function";
import Sidebar from "../../../components/user/sidebar";

const SearchGroup: React.FC = () => {
    const { userId } = useUser();
    const [Groups, setGroups] = useState<any[]>([]);
    const { group_name } = useParams<{ group_name: string }>();
    const [successMessage, setSuccessMessage] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string>('');

    useEffect(() => {

    }, []);

    useEffect(() => {
        const fetchDatas = async () => {
            setLoading(true);
            setError('');
            try {
                const response = await axios.get(`https://localhost:7227/api/Group/search_group_by_name?group_name=${group_name}&user_id=${userId}`);
                setGroups(response.data);
            } catch (err) {
                setError('Failed to fetch groups');
            } finally {
                setLoading(false);
            }
        };

        if (group_name && userId) {
            fetchDatas();
        }
    }, [group_name, userId]);

    const joinGroup = async (group_id: number) => {
        setSuccessMessage('');
        setError('');
        try {
            await axios.post('https://localhost:7227/api/GroupRequest/create_request', {
                user_id: userId,
                group_id: group_id,
                username: "",
                avatar_url: "",
                request_date: new Date()
            });
            setSuccessMessage('Gửi yêu cầu thành công. Hãy chờ xét duyệt!');
        } catch (error) {
            setError('Error creating join request');
            console.error('Error creating join request:', error);
        }
    };

    return (
        <>
            <FunctionUser />
            <Sidebar />
            <TopbarGroup />
            <main>
                <div className="content">
                    <div className="base">
                        <i className='bx bxs-group icon'>Group</i>
                        {successMessage && <div className="alert alert-success fixed-top text-center" style={{ zIndex: 1000 }}>{successMessage}</div>}
                        {error && <div className="alert alert-danger">{error}</div>}
                    </div>

                    {loading ? (
                        <div>Loading...</div>
                    ) : (
                        Groups.map(Group => (
                            <div className="data" key={Group.group_id}>
                                <div className="name-data">
                                    <span>{Group.group_name}</span>
                                </div>
                                <div className="face-data" id="face-data">
                                    <div id="mediaContainer" className="media-container">
                                        <img src={`/resources/images/${Group.group_image}`} alt={Group.group_name} />
                                    </div>
                                </div>
                                <div className="function-data">
                                    <a onClick={() => joinGroup(Group.group_id)}><i className='bx bxs-add icon'>JOIN</i></a>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </main>
        </>
    );
};

export default SearchGroup;
