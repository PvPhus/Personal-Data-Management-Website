import React, { useEffect, useState } from "react";
import axios from "axios";
import { useUser } from '../../../constant/userContext';
import TopbarGroup from "../../../components/user/topbargroup";
import Sidebar from "../../../components/user/sidebar";
import FunctionUser from "../../../components/user/function";

const Joingroup: React.FC = () => {
    const { userId } = useUser();
    const [Groups, setGroups] = useState<any[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string>('');
    const [successMessage, setSuccessMessage] = useState<string>('');


    useEffect(() => {

        const fetchData = async () => {
            try {
                const response = await axios.get(`https://localhost:7227/api/Group/get_all_group?user_id=${userId}`);
                setGroups(response.data);
                setLoading(false);
            } catch (error) {
                setError('Error fetching data');
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const joinGroup = async (group_id: number) => {
        try {
            await axios.post('https://localhost:7227/api/GroupRequest/create_request', {
                user_id: userId,
                group_id: group_id,
                username: "",
                avatar_url: "",
                request_date: new Date()
            });
            setSuccessMessage('Gửi yêu cầu thành công. Hãy chờ xét duyêt!');
            setTimeout(() => {
                setSuccessMessage('');
            }, 2500);

        } catch (error) {
            console.error('Error creating join request:', error);
        }
    };

    return (
        <>

            <Sidebar />
            <FunctionUser />
            <TopbarGroup />
            <main>
                {successMessage && <div className="alert alert-success fixed-top text-center" style={{ zIndex: 1000 }}>
                    {successMessage}
                </div>}
                <div className="content">
                    <div className="alert alert-primary text-center" style={{ zIndex: 30, width: "75.5%", position: "fixed", fontSize: "larger", fontWeight: "bold" }}>
                        List Groups
                    </div>
                    <div className="base">
                        <i className='bx bxs-group icon'>Group</i>
                    </div>
                    {Groups.map(Group => (
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
                                <div className="function-data">
                                    <a ><i className='bx bxs-info-circle'></i></a>
                                    <a onClick={() => joinGroup(Group.group_id)}><i className='bx bxs-user-plus'></i></a>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </main>

        </>
    );
};

export default Joingroup;
