import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useUser } from '../../constant/userContext';
import { clickSidebar } from "../../assets/js/sidebar";

const Sidebar = () => {
    const { userId } = useUser();
    const navigate = useNavigate();
    const [groups, setGroups] = useState<any[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string>('');
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const handleVideo = () => navigate(`/videos/${userId}`);
    const handleImage = () => navigate(`/images/${userId}`);
    const handleFile = () => navigate(`/files/${userId}`);
    const handleAlldata = () => navigate(`/alldata/${userId}`);
    const handleJoingroup = () => navigate(`/joingroup/${userId}`);
    const handleMygroup = () => navigate(`/mygroup/${userId}`);
    const handleTrash = () => navigate(`/trash/${userId}`)
    const handleRequetFriend = () => navigate(`/requestfriend/${userId}`)
    const handleChat = () => navigate(`/chat/${userId}`)
    // const openListDataGroup = (group_id: number) => navigate(`/listdatagroup/${group_id}`);

    const toggleSidebar = () => {
        setSidebarOpen(!sidebarOpen);
    };

    useEffect(() => {
        clickSidebar();
    }, []);

    // useEffect(() => {
    //     const fetchData = async () => {
    //         if (userId === null) return; // Only proceed if userId is not null
    //         try {
    //             const response = await axios.get(`https://localhost:7227/api/Group/get_3_group/${userId}`);
    //             setGroups(response.data);
    //             setLoading(false);
    //         } catch (error) {
    //             setError('Error fetching data');
    //             setLoading(false);
    //         }
    //     };

    //     fetchData();
    // }, [userId]);

    return (
        <>
            <div>
                <button className="menu-toggle" onClick={toggleSidebar}>
                    <i className="bx bx-menu"></i>
                </button>
                <section id="sidebar" className={sidebarOpen ? 'open' : ''}>
                    <a onClick={handleAlldata} role="button" className="brand">P<i className="bx bxs-data icon" />M</a>
                    <a onClick={handleAlldata} role="button" className="note">(Personal Data Management)</a>
                    <ul className="side-menu">
                        <li><a onClick={handleAlldata} role="button" className="active"><i className="bx bx-border-all icon" />All Data</a></li>
                        <li className="divider" data-text="main">Main</li>
                        <li>
                            <a id="clickDropdown" role="button" data-toggle="dropdown"><i className="bx bxs-cloud-upload icon" /> Upload <i className="bx bx-chevron-down icon-right" /></a>
                            <ul id="sideDropdown" aria-labelledby="clickDropdown" className="side-dropdown">
                                <li><a role="button" onClick={handleImage}><i className='bx bx-image-alt'> Images</i></a></li>
                                <li><a role="button" onClick={handleFile}><i className='bx bxs-file'> Files</i></a></li>
                                <li><a role="button" onClick={handleVideo}><i className='bx bxs-videos'> Videos</i></a></li>
                            </ul>
                        </li>
                        <li><a onClick={handleJoingroup} role="button"><i className='bx bxs-group icon'></i> Join Groups </a></li>
                        <li>
                            <a id="clickDropdown" role="button" data-toggle="dropdown" onClick={handleMygroup}><i className="bx bxs-widget icon" /> My Groups </a>
                            <ul id="sideDropdown" aria-labelledby="clickDropdown" className="side-dropdown">
                                {/* {loading ? (
                                <div>Loading...</div>
                            ) : error ? (
                                <div>{error}</div>
                            ) : (
                                groups.map(group => (
                                    <li key={group.group_id}>
                                        <a onClick={() => openListDataGroup(group.group_id)}>
                                            {group.group_name}
                                        </a>
                                    </li>
                                ))
                            )} */}  
                            </ul>
                        </li>
                        <li><a onClick={handleRequetFriend} role="button"><i className='bx bxs-group icon'></i>Request Friends</a></li>
                        <li><a onClick={handleChat} role="button"><i className='bx bxs-group icon'></i> Chats </a></li>
                        
                        <li className="divider" data-text="table and forms">Data Processing</li>
                        <li><a role="button" onClick={handleTrash}><i className="bx bxs-trash icon" />Trash</a></li>
                        <li><a role="button" ><i className="bx bxs-cloud icon" />Memory</a></li>
                    </ul>
                    <div className="ads">
                        <div className="wrapper">
                            <a role="button" className="btn-upgrade icon">Buy Data</a>
                        </div>
                    </div>
                </section>
            </div>
        </>
    );
};

export default Sidebar;
