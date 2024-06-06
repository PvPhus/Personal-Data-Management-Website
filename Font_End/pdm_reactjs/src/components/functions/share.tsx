import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { useUser } from "../../constant/userContext";
import Topbar from "../topbar";

const Share: React.FC = () => {
    const { userId } = useUser();
    const { file_id } = useParams<{ file_id: string }>(); // Assuming file_id is passed as a parameter
    const [groups, setGroups] = useState<any[]>([]);
    const [selectedGroups, setSelectedGroups] = useState<number[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string>('');
    const navigate = useNavigate();

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

    const handleCheckboxChange = (groupId: number) => {
        setSelectedGroups(prevSelected =>
            prevSelected.includes(groupId)
                ? prevSelected.filter(id => id !== groupId)
                : [...prevSelected, groupId]
        );
    };

    const handleShare = async () => {
        if (!userId || !file_id || selectedGroups.length === 0) {
            setError('Please select at least one group to share the file.');
            return;
        }
        const data = {
            user_id: userId,
            file_id: Number(file_id),
            group_id: selectedGroups
        };
        console.log(data);
        try {
            await axios.post('https://localhost:7227/api/File/share_file', data);
            setError('File shared successfully');
            navigate(-1);
        } catch (error) {
            setError('Error sharing the file');
        }
    };

    return (
        <>
            <Topbar />
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
                    <div className="card shadow mb-4">
                        <div className="card-header py-3" style={{ display: 'flex' }}>
                            <h6 className="m-0 font-weight-bold text-primary">Choose Group You Want Share</h6>
                            <button className="btn btn-success" onClick={handleShare} style={{ marginLeft: 'auto' }}>SHARE</button>
                        </div>
                        <div className="card-body">
                            <div className="table-responsive">
                                <table className="table table-bordered" id="dataTable" width="100%" cellSpacing={0}>
                                    <thead>
                                        <tr>
                                            <th>STT</th>
                                            <th>Group name</th>
                                            <th>Group image</th>
                                            <th>Total member</th>
                                            <th>Choose</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {loading ? (
                                            <div>Loading...</div>
                                        ) : error ? (
                                            <div>{error}</div>
                                        ) : (
                                            groups.map((group, index) => (
                                                <tr key={group.group_id}>
                                                    <td>{index + 1}</td>
                                                    <td>{group.group_name}</td>
                                                    <td>
                                                        <img src={`/resources/images/${group.group_image}`} alt="Avatar" style={{ width: 50, height: 50 }} />
                                                    </td>
                                                    <td>{group.total_members}</td>
                                                    <td>
                                                        <input
                                                            type="checkbox"
                                                            value={group.group_id}
                                                            onChange={() => handleCheckboxChange(group.group_id)}
                                                        />
                                                    </td>
                                                </tr>
                                            ))
                                        )}
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

export default Share;
