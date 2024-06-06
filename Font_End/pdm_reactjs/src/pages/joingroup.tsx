import React, { useEffect, useState } from "react";
import axios from "axios";
import {clickTopbar} from"../assets/js/topbar";
import { useUser } from '../constant/userContext';
import { useNavigate, useParams } from "react-router-dom";

const Joingroup: React.FC = () => {
    const navigate = useNavigate();
    const { userId } = useUser();
    const { user_id, group_id } = useParams<{ user_id: string, group_id: string }>();
    const [isLoggedIn, setIsLoggedIn] = useState(!!userId);
    const [Groups, setGroups] = useState<any[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string>('');
    const [successMessage, setSuccessMessage] = useState<string>('');

    useEffect(() => {
        clickTopbar();
    }, []);

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
            // Step 1: Create a request to join the group
            await axios.post('https://localhost:7227/api/GroupRequest/create_request', {
                user_id: userId,
                group_id: group_id,
                username: "", 
                avatar_url: "", 
                request_date: new Date()
            });

            // Step 2: Set success message
            setSuccessMessage('Gửi yêu cầu thành công. Hãy chờ xét duyêt!');

        } catch (error) {
            console.error('Error creating join request:', error);
        }
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
                        <i className='bx bxs-group icon'>Group</i>{successMessage && <div className="alert alert-success">{successMessage}</div>}
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
                                    <a onClick={() => joinGroup(Group.group_id)}><i className='bx bxs-add icon'>JOIN</i></a>
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
