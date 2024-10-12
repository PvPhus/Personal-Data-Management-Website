import React, { useEffect, useState } from "react";
import axios from "axios";
import { useUser } from '../../../constant/userContext';
import Topbar from "../../../components/user/topbar";
import Sidebar from "../../../components/user/sidebar";
import FunctionUser from "../../../components/user/function";
import RightMouse from "../../../components/user/rightMouseData";
import { useNavigate, useParams } from "react-router-dom";

const ShareListData: React.FC = () => {
    const [Datas, setDatas] = useState<any[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [errorMessage, setErrorMessage] = useState<string>('');
    const [successMessage, setSuccessMessage] = useState<string>('');
    const [selectedFiles, setSelectedFiles] = useState<number[]>([]);
    const { receiver_id } = useParams<{ receiver_id: string }>();
    const { userId } = useUser();
    const imageFileTypes = ['JPEG', 'JPG', 'GIF', 'TIFF', 'PSD', 'EPS', 'WEBP', 'PNG'];
    const fileFileTypes = ['TXT', 'DOCX', 'PDF', 'PPT', 'JAR', 'DOT', 'HTML', 'DOCM', 'DOC'];
    const videoFileTypes = ['AVI', 'MP4', 'FLV', 'WMV', 'MOV'];
    const navigate = useNavigate();

    useEffect(() => {
        if (userId) {
            fetchDatas();
        }
    }, [userId]);

    const fetchDatas = async () => {
        if (!userId) {
            setErrorMessage('User ID not found');
            setLoading(false);
            return;
        }
        try {
            const response = await axios.get(`https://localhost:7227/api/File/get_all_file_by_user?user_id=${userId}`);
            setLoading(false);
            setDatas(response.data);
        } catch (err) {
            setErrorMessage('Failed to fetch Datas');
            setLoading(false);
        }
    };

    const handleCheckboxChange = (file_id: number) => {
        setSelectedFiles(prevSelected =>
            prevSelected.includes(file_id)
                ? prevSelected.filter(id => id !== file_id)
                : [...prevSelected, file_id]
        );
    };

    const handleShare = async () => {
        // Kiểm tra điều kiện hợp lệ
        if (!receiver_id || !userId || selectedFiles.length === 0) {
            setErrorMessage('Invalid input for sharing file with friends.');
            return;
        }

        // Tạo dữ liệu chia sẻ file
        const data = {
            sender_id: Number(userId),
            receiver_id: Number(receiver_id),
            content: "Shared List Data",
            file_id: selectedFiles.map(Number)
        };
        
        try {
            const response = await axios.post('https://localhost:7227/api/Friend/share_friend_list_data', data);
            setSuccessMessage('File shared successfully with friends!');
            console.log(data)
            setTimeout(() => {
                navigate(-1);
            }, 1500);
        } catch (error) {
            console.error('Error sharing the file with friends:', error);
            console.log(data)
            setErrorMessage('Error sharing the file with friends!');
        }
    };

    const getImgSrc = (file_type: string) => {
        switch (file_type) {
            case 'pdf':
                return `/resources/images/anhfilepdf.jpg`;
            case 'txt':
                return `/resources/images/anhfiletext.png`;
            case 'docx':
            case 'docm':
                return `/resources/images/docx.webp`;
            case 'pptx':
                return `/resources/images/anhfileppt.jpg`;
            case 'xlsx':
                return `/resources/images/anhfileexcel.jpg`;
            default:
                return ``;
        }
    };

    return (
        <>
            <RightMouse />
            <Sidebar />
            <FunctionUser />
            <Topbar />
            <main>
                {successMessage && (
                    <div className="alert alert-success fixed-top text-center" style={{ zIndex: 1000 }}>
                        {successMessage}
                    </div>
                )}
                 {errorMessage && (
                    <div className="alert alert-success fixed-top text-center" style={{ zIndex: 1000 }}>
                        {errorMessage}
                    </div>
                )}
                <div className="content">
                    <div className="alert alert-primary text-center" style={{ zIndex: 30, width: "75.5%", position: "fixed", fontSize: "larger", fontWeight: "bold" }}>
                        LIST DATA
                        <button className="btn btn-success" onClick={handleShare} style={{ marginLeft: '7px' }}>SHARE</button>
                    </div>
                    <div className="base">
                        <i className='bx bx-image-alt'>Images</i>
                    </div>
                    {loading ? (
                        <div>Loading...</div>
                    ) : (
                        Datas.filter(data => imageFileTypes.includes(data.file_type.toUpperCase())).map(data => (
                            <div className="data" key={data.file_id}>
                                <input
                                    className="v-share"
                                    type="checkbox"
                                    value={data.file_id}
                                    onChange={() => handleCheckboxChange(data.file_id)}
                                />
                                <div className="name-data">
                                    <span>{data.filename_new}</span>
                                </div>
                                <div className="face-data" id="face-data">
                                    <div id="mediaContainer" className="media-container">
                                        <img src={`/resources/images/${data.filename_old}`} />
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                    <div className="base">
                        <i className='bx bxs-file'>Files</i>
                    </div>
                    {Datas.filter(data => fileFileTypes.includes(data.file_type.toUpperCase())).map(data => (
                        <div className="data" key={data.file_id}>
                            <input
                                className="v-share"
                                type="checkbox"
                                value={data.file_id}
                                onChange={() => handleCheckboxChange(data.file_id)}
                            />
                            <div className="name-data">
                                <span>{data.filename_new}</span>
                            </div>
                            <div className="face-data" id="face-data">
                                <div id="mediaContainer" className="media-container">
                                    <img src={getImgSrc(data.file_type)} />
                                </div>
                            </div>
                        </div>
                    ))}
                    <div className="base">
                        <i className='bx bxs-videos'>Videos</i>
                    </div>
                    {Datas.filter(data => videoFileTypes.includes(data.file_type.toUpperCase())).map(data => (
                        <div className="data" key={data.file_id}>
                            <input
                                className="v-share"
                                type="checkbox"
                                value={data.file_id}
                                onChange={() => handleCheckboxChange(data.file_id)}
                            />
                            <div className="name-data">
                                <span>{data.filename_new}</span>
                            </div>
                            <div className="face-data" id="face-data">
                                <div id="mediaContainer" className="media-container">
                                    <video src={`/resources/images/${data.filename_old}`} />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </main>
        </>
    );
};
export default ShareListData;
