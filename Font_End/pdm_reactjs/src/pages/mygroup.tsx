import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { clickTopbar } from "../assets/js/topbar";
import { useUser } from '../constant/userContext';

const MyGroup: React.FC = () => {
    const navigate = useNavigate();
    const { userId } = useUser();
    const [Groups, setGroups] = useState<any[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string>('');

    useEffect(() => {
        clickTopbar();
    }, []);

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
            <header>
                <div className="searchbar">
                    <li>
                        <a href="#" style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '36px', height: '36px', textDecoration: 'none' }}>
                            <i className="bx bx-search-alt" style={{ fontSize: '24px' }}></i>
                        </a>
                    </li>
                    <input type="text" className="textsearch" placeholder="Search" />
                </div>
            </header>
            <main>
                <div className="content">
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
                                    <a onClick={() => openListDataGroup(Group.group_id)}><i className='bx bxs-add icon'>Open</i></a>
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
