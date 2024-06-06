import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import TopbarGroup from "../components/topbargroup";

const GroupMembers: React.FC = () => {
    const [members, setMembers] = useState<any[]>([]);
    const navigate = useNavigate();
    const { group_id } = useParams<{ group_id: string }>();

    const deleteMember = async (group_id: number, user_id: number) => {
        navigate(`/openMembers/${group_id}`);
    };

    const updatePermission = async (isChecked: boolean, member: any, permissionField: string) => {
        try {
            const updatedPermission = {
                permission_id: member.permission_id,
                user_id: member.user_id,
                can_read: permissionField === "can_read" ? isChecked : member.can_read,
                can_download: permissionField === "can_download" ? isChecked : member.can_download,
                can_share: permissionField === "can_share" ? isChecked : member.can_share,
                can_delete: permissionField === "can_delete" ? isChecked : member.can_delete,
            };
            await axios.put(`https://localhost:7227/api/Permission/update-permission`, updatedPermission);

            setMembers(prevMembers =>
                prevMembers.map(m =>
                    m.permission_id === member.permission_id ? { ...m, ...updatedPermission } : m
                )
            );

        } catch (error) {
            console.error('Error updating permission:', error);
        }
    };

    useEffect(() => {
        const fetchMembers = async () => {
            try {
                const response = await axios.get(`https://localhost:7227/api/GroupMember/groupMembers/${group_id}`);
                setMembers(response.data);
            } catch (error) {
                console.error('Error fetching members:', error);
            }
        };

        fetchMembers();
    }, [group_id]);

    return (
        <>
            <TopbarGroup />
            <main>
                <div className="content">
                    <div className="card shadow mb-4">
                        <div className="card-header py-3">
                            <h6 className="m-0 font-weight-bold text-primary">Members Of Group</h6>
                        </div>
                        <div className="card-body">
                            <div className="table-responsive">
                                <table className="table table-bordered" id="dataTable" width="100%" cellSpacing={0}>
                                    <thead>
                                        <tr>
                                            <th>STT</th>
                                            <th>Avatar</th>
                                            <th>Name</th>
                                            <th>Join date</th>
                                            <th>Can read</th>
                                            <th>Can download</th>
                                            <th>Can share</th>
                                            <th>Can delete</th>
                                            <th>Function</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {members.map((member, index) => (
                                            <tr key={index}>
                                                <td>{index + 1}</td>
                                                <td>
                                                    <img src={`/resources/images/${member.avatar_url}`} alt="Avatar" style={{ width: 50, height: 50 }} />
                                                </td>
                                                <td>{member.username}</td>
                                                <td>{new Date(member.join_date).toLocaleDateString()}</td>
                                                <td>
                                                    <input
                                                        type="checkbox"
                                                        checked={member.can_read}
                                                        onChange={(e) => updatePermission(e.target.checked, member, "can_read")}
                                                    />
                                                </td>
                                                <td>
                                                    <input
                                                        type="checkbox"
                                                        checked={member.can_download}
                                                        onChange={(e) => updatePermission(e.target.checked, member, "can_download")}
                                                    />
                                                </td>
                                                <td>
                                                    <input
                                                        type="checkbox"
                                                        checked={member.can_share}
                                                        onChange={(e) => updatePermission(e.target.checked, member, "can_share")}
                                                    />
                                                </td>
                                                <td>
                                                    <input
                                                        type="checkbox"
                                                        checked={member.can_delete}
                                                        onChange={(e) => updatePermission(e.target.checked, member, "can_delete")}
                                                    />
                                                </td>
                                                <td>
                                                    <div>
                                                        <button
                                                            onClick={() => deleteMember(member.group_id, member.user_id)}
                                                            className="btn btn-success"
                                                            style={{ height: 40, width: 120 }}
                                                        >
                                                            <i className='bx bxs-user-check'></i>Delete
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
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

export default GroupMembers;
