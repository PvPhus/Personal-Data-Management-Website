import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useUser } from '../../constant/userContext';
import Topbar from "./topbar";
import Footer from "./footer";
import FunctionUser from "./function";
import TopbarGroup from "./topbargroup";

const Sidebar = () => {
    const { userId } = useUser();
    const navigate = useNavigate();
    const [groups, setGroups] = useState<any[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string>('');

    const handleVideo = () => navigate("/video");
    const handleImage = () => navigate("/image");
    const handleFile = () => navigate("/file");
    const handleAlldata = () => navigate("/alldata");
    const handleJoingroup = () => navigate(`/joingroup/${userId}`);
    const handleMygroup = () => navigate(`/mygroup/${userId}`);
    const openListDataGroup = (group_id: number) => navigate(`/listdatagroup/${group_id}`);

    useEffect(() => {
        const fetchData = async () => {
            if (userId === null) return; // Only proceed if userId is not null
            try {
                const response = await axios.get(`https://localhost:7227/api/Group/get_3_group/${userId}`);
                setGroups(response.data);
                setLoading(false);
            } catch (error) {
                setError('Error fetching data');
                setLoading(false);
            }
        };

        fetchData();
    }, [userId]);
    
    return (
        
        <>
        <section id="sidebar">
            <a onClick={handleAlldata} className="brand">P<i className="bx bxs-data icon" />M</a>
            <a onClick={handleAlldata} className="note">(Personal Data Management)</a>
            <ul className="side-menu">
                <li><a onClick={handleAlldata} className="active"><i className="bx bx-border-all icon" />All Data</a></li>
                <li className="divider" data-text="main">Main</li>
                <li>
                    <a  ><i className="bx bxs-cloud-upload icon" /> Upload <i className="bx bx-chevron-right icon-right" /></a>
                    <ul className="side-dropdown">
                        <li><a onClick={handleImage}>Images</a></li>
                        <li><a onClick={handleFile}>Files</a></li>
                        <li><a onClick={handleVideo}>Videos</a></li>
                    </ul>
                </li>
                <li><a onClick={handleJoingroup}><i className='bx bxs-group icon'></i> Join Groups </a></li>
                <li><a onClick={handleMygroup}><i className="bx bxs-widget icon" /> My Groups <i className="bx bx-chevron-right icon-right" /></a>
                    <ul className="side-dropdown">
                        {loading ? (
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
                        )}
                    </ul>
                </li>
                <li className="divider" data-text="table and forms">Data Processing</li>
                <li><a href="/USER/trash.html"><i className="bx bxs-trash icon" />Trash</a></li>
                <li><a  ><i className="bx bxs-cloud icon" />Memory</a></li>
            </ul>
            <div className="ads">
                <div className="wrapper">
                    <a   className="btn-upgrade">Buy Data</a>
                </div>
            </div>
        </section>
        </>
    );
};

export default Sidebar;
