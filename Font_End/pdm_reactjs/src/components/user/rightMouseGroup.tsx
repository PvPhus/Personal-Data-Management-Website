import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useUser } from "../../constant/userContext";
import axios from "axios";

const RightMouseGroup = () => {
    const navigate = useNavigate();
    const { group_id } = useParams<{ group_id: string }>();
    const { userId } = useUser();
    const [isPermisson, setIsPermission] = useState<any>(false);
    const [message, setMessage] = useState<string>('');
    const [Datas, setDatas] = useState<any[]>([]);

    useEffect(() => {
        fetchPermisson();
        fetchGroupData();
    }, [userId, group_id]);

    // Get all info data in group
    const fetchGroupData = async () => {
        try {
            const response = await axios.get(`https://localhost:7227/api/Group/get_all_data_in_groups?group_id=${group_id}`);
            setDatas(response.data);
        } catch (error) {
            console.error('Error fetching group data:', error);
        }
    };

    const fetchPermisson = async () => {
        try {
            const response = await axios.get(`https://localhost:7227/api/Permission/get_permission_user?user_id=${userId}&group_id=${group_id}`);
            setIsPermission(response.data)
        } catch (error) {
            console.error('Error fetching isAdmin status:', error);
        }
    };
    const infoData = (file_id: number) => {
        navigate(`/information/file/${file_id}`);
    };

    const shareData = async (file_id: number) => {
        navigate(`/share/file/${file_id}`);
    };

    const deleteData = async (file_id: number, group_id: number) => {
        const confirmDelete = window.confirm("Are you sure you want to delete this file?");
        if (!confirmDelete) {
            return;
        }

        try {
            await axios.delete(`https://localhost:7227/api/File/delete-groupdata/${file_id}?group_id=${group_id}`);
            setMessage('Deleted the data successful');
            setTimeout(() => {
                fetchGroupData();
            }, 1300);

        } catch (err) {
            console.error('Failed to delete video', err);
            setMessage('Failed to delete file');
        }
    };

    const downloadData = async (file_id: number, filename: string) => {
        try {
            const response = await axios.get(`https://localhost:7227/api/File/download/${file_id}`, {
                responseType: 'blob',
            });

            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', filename); // Đặt tên file theo ý muốn
            document.body.appendChild(link);
            link.click();
            link.remove(); // Xóa link sau khi nhấn để tải về
            window.URL.revokeObjectURL(url); // Giải phóng bộ nhớ
        } catch (err) {
            console.error('Failed to download file', err);
        }
    };
    return (
        <>
            {Datas.map(data => (
                <div id="contextMenuData" className="context-menu">
                    <ul>              
                        {isPermisson.can_read && <li><a onClick={() => infoData(data.file_id)}>Information<i className="bx bxs-show icon" /></a></li>}
                        {isPermisson.can_download && <li><a onClick={() => downloadData(data.file_id, `${data.filename_new}.${data.file_type}`)}>Download<i className='bx bxs-download icon'></i></a></li>}
                        {isPermisson.can_share && <li><a onClick={() => shareData(data.file_id)}>Share<i className="bx bxs-share icon" /></a></li>}
                        {isPermisson.can_delete && <li><a onClick={() => deleteData(data.file_id, data.group_id)}>Delete<i className="bx bxs-trash icon" /></a></li>}
                    </ul>
                </div>
            ))}

            <div id="contextMenuMessage" className="context-menu">
                <ul>
                    <li><a>Message Recovery<i className='bx bxs-message-alt-x'></i></a></li>
                    <li><a>Message Update <i className='bx bxs-message-alt-edit'></i></a></li>
                </ul>
            </div>

        </>
    )

}
export default RightMouseGroup;