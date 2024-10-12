import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useUser } from '../../../constant/userContext';
import Sidebar from "../../../components/user/sidebar";
import FunctionUser from "../../../components/user/function";

const MyGroup: React.FC = () => {
    const navigate = useNavigate();
    const { userId } = useUser();
    const [Groups, setGroups] = useState<any[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string>('');

    const openListDataGroup = (group_id: number) => {
        navigate(`/listdatagroup/${group_id}`); // Điều hướng đến listdatagroup với group_id
    };

    useEffect(() => {
        const fetchData = async () => {
            if (!userId) {
                setError('User ID not found');
                setLoading(false);  
                return;
            }
            try {
                const response = await axios.get(`https://localhost:7227/api/Group/get_Groups/${userId}`);
                setGroups(response.data);
                setLoading(false);
            } catch (error) {
                setError('Error fetching data');
                setLoading(false);
            }
        };

        fetchData();
    }, [userId]);

    const createGroup = () => {
        navigate(`/creategroup`);
    };

    return (
        <>

            <Sidebar />
            <FunctionUser />
            <header>
                <div className="searchbar">
                    <li>
                        <button style={{ background: 'none', border: 'none', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '36px', height: '36px', textDecoration: 'none' }}>
                            <i className="bx bx-search-alt" style={{ fontSize: '24px' }}></i>
                        </button>
                    </li>
                    <input type="text" className="textsearch" placeholder="Search" />
                </div>
            </header>
            <main>
                <div className="content">
                    <div className="alert alert-primary text-center" style={{ zIndex: 30, width: "75.5%", position: "fixed", fontSize: "larger", fontWeight: "bold" }}>
                        My Groups
                    </div>
                    <div className="base">
                        <i className='bx bxs-group icon'>My Group</i>
                    </div>
                    {loading ? (
                        <div>Loading...</div>
                    ) : error ? (
                        <div>{error}</div>
                    ) : (
                        Groups.map(Group => (
                            <div className="data" key={Group.group_id}>
                                <div className="name-data">
                                    <span>{Group.group_name}</span>
                                </div>
                                <div className="face-data" id="face-data">
                                    <div id="mediaContainer" className="media-container">
                                        <img src={`/resources/images/${Group.group_image}`} alt={`${Group.group_name} image`} />
                                    </div>
                                </div>
                                <div className="function-data">
                                    <a role="button" onClick={() => openListDataGroup(Group.group_id)}><i className='bx bxs-chat'></i></a>
                                </div>
                            </div>
                        ))
                    )}
                </div>
                <div className="button-plus">
                    <a onClick={createGroup}><i className='bx bx-plus-medical'></i></a>
                </div>
            </main>

        </>
    );
};

export default MyGroup;
