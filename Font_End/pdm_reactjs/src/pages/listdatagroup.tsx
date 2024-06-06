import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { clickTopbar } from "../assets/js/topbar";
import { useUser } from '../constant/userContext';
import TopbarGroup from "../components/topbargroup";

const ListDataGroup: React.FC = () => {
    const { group_id } = useParams<{ group_id: string }>();
    const navigate = useNavigate();
    const { userId } = useUser();
    const [Count, setCount] = useState<any>(null);
    const [Datas, setDatas] = useState<any[]>([]);
    
    useEffect(() => {
        clickTopbar();
    }, []);

    useEffect(() => {
        const fetchGroupData = async () => {
            try {
                const response = await axios.get(`https://localhost:7227/api/Group/get_data_group?user_id=${userId}&group_id=${group_id}`);
                setDatas(response.data);
            } catch (error) {
                console.error('Error fetching group data:', error);
            }
        };

        if (userId && group_id) {
            fetchGroupData();
        }

    }, [userId, group_id]);

    useEffect(() => {
        const fetchCount = async () => {
            try {
                const response = await axios.get(`https://localhost:7227/api/Group/get_count/${group_id}`);
                setCount(response.data);
            } catch (error) {
                console.error('Error fetching count:', error);
            }
        };

        fetchCount();
    }, [group_id]);

    useEffect(() => {
        const fetchCount = async () => {
            try {
                const response = await axios.get(`https://localhost:7227/api/Group/get_count/${group_id}`);
                setCount(response.data);
            } catch (error) {
                console.error('Error fetching count:', error);
            }
        };

        fetchCount();
    }, [group_id]);

    const openListRequests = () => {
        navigate(`/openRequests/${group_id}`);
    };

    const openListMembers = () => {
        navigate(`/openMembers/${group_id}`);
    };

    const seeData = (file_id: number) => {
        // Implement view data logic here
    };

    const updateData = (file_id: number) => {
        // Implement update data logic here
    };

    const deleteData = (file_id: number) => {
        // Implement delete data logic here
    };

    const downloadData = (file_id: number, filename: string) => {
        // Implement download data logic here
    };

    const shareData = (file_id: number) => {
        navigate(`/share/${file_id}`);
    };

    const getIframeSrc = (dataName: string, dataType: string) => {
        // Implement logic to get iframe src here
        return `/path/to/data/${dataName}`;
    };

    return (
        <>
            <TopbarGroup />
            <main>
                <div className="content">
                    <div className="base">
                        <i className='bx bxs-group icon'>All Data In Group: </i>
                        <button style={{float:"right"}} onClick={openListRequests} className="btn btn-success">
                            {Count && (<span>{Count.total_request}</span> )}List Request
                        </button>
                        <button style={{float:"right"}} onClick={openListMembers} className="btn btn-warning">
                            {Count &&(<span>{Count.total_members}</span> )} List Members
                        </button>
                    </div>
                    {Datas.map(Data => (
                        <div className="data" key={Data.file_id}>
                            <div className="name-data">
                                <span>{Data.filename_new}</span>
                            </div>
                            <div className="face-data" id="face-data">
                                <div id="mediaContainer" className="media-container">
                                    <iframe
                                        src={getIframeSrc(Data.filename_old, Data.file_type)}
                                        style={{ width: '100%', height: 'auto' }}
                                    />
                                </div>
                            </div>
                            <div className="function-data">
                                <a onClick={() => seeData(Data.file_id)}><i className="bx bxs-show icon" /></a>
                                <a onClick={() => updateData(Data.file_id)}><i className="bx bxs-edit icon" /></a>
                                <a onClick={() => deleteData(Data.file_id)}><i className="bx bxs-trash icon" /></a>
                                <a onClick={() => downloadData(Data.file_id, `${Data.filename_new}.${Data.file_type}`)}><i className='bx bxs-download icon'></i></a>
                                <a onClick={() => shareData(Data.file_id)}><i className="bx bxs-share icon" /></a>
                            </div>
                        </div>
                    ))}
                </div>
                <div className="button-plus">
                    <a><i className='bx bxs-plus-circle'></i></a>
                </div>
            </main>
        </>
    );
};

export default ListDataGroup;
