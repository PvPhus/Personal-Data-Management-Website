import React, { useState, FormEvent, ChangeEvent } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useUser } from "../../constant/userContext";

const CreateGroup: React.FC = () => {
    const navigate = useNavigate();
    const { userId } = useUser();
    const [message, setMessage] = useState("");
    const [selectedImage, setSelectedImage] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string>("");
    const [groupName, setGroupName] = useState("");

    const [groupDetails, setGroupDetails] = useState({
        group_image: "",
        group_name: "",
        user_id: userId, 
        created_date: new Date().toISOString(),
        total_members: 1
    });

    const handleImageChange = (event: ChangeEvent<HTMLInputElement>) => {
        const image = event.target.files?.[0];
        if (image) {
            setSelectedImage(image);
            setImagePreview(URL.createObjectURL(image));
            setGroupDetails({
                ...groupDetails,
                group_image: image.name
            });
        }
    };

    const handleGroupNameChange = (event: ChangeEvent<HTMLInputElement>) => {
        setGroupName(event.target.value);
        setGroupDetails({
            ...groupDetails,
            group_name: event.target.value
        });
    };

    const handleCreate = async (event: FormEvent) => {
        event.preventDefault();

        if (!selectedImage) {
            setMessage('Please choose an image before submitting.');
            return;
        }

        const formData = new FormData();
        formData.append('file', selectedImage);

        try {
            // Upload the image to the server
            await axios.post('https://localhost:7227/api/File/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            const groupDetailsWithoutPath = { ...groupDetails };

            // Save the group details to the database
            const saveDetailsResponse = await axios.post('https://localhost:7227/api/Group/create-group', groupDetailsWithoutPath, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            setMessage('Group successfully created!');
            setTimeout(() => {
                navigate(-1);
            }, 200);
            console.log('Group successfully created and details saved:', saveDetailsResponse.data);
        } catch (error) {
            console.error('There was an error creating the group!', error);
            setMessage('There was an error creating the group!');
        }
    };

    return (
        <>
            <header>
                <div className="searchbar">
                    <li>
                        <a href="#">
                            <svg xmlns="http://www.w3.org/2000/svg" width={36} height={36} viewBox="0 0 24 24">
                                <path d="M13.707 2.293A.996.996 0 0 0 13 2H6c-1.103 0-2 .897-2 2v16c0 1.103.897 2 2 2h12c1.103 0 2-.897 2-2V9a.996.996 0 0 0-.293-.707l-6-6zM6 4h6.586L18 9.414l.002 9.174-2.568-2.568c.35-.595.566-1.281.566-2.02 0-2.206-1.794-4-4-4s-4 1.794-4 4 1.794 4 4 4c.739 0 1.425-.216 2.02-.566L16.586 20H6V4zm6 12c-1.103 0-2-.897-2-2s.897-2 2-2 2 .897 2 2-.897 2-2 2z"></path>
                            </svg>
                        </a>
                    </li>
                    <input type="text" className="textsearch" placeholder="Search" />
                </div>
            </header>
            <main>
                <div className="content">
                    <div className="container-fluid">
                        {/* Page Heading */}
                        <h1 className="h3 mb-2 text-gray-800">Create Group</h1>
                        {/* DataTales Example */}
                        <div className="card shadow mb-4">
                            <div className="card-body">
                                {message && (
                                    <div className="alert alert-info" role="alert">
                                        {message}
                                    </div>
                                )}
                                <form method="POST" onSubmit={handleCreate}>
                                    <div className="row">
                                        <div className="col-md-6">
                                            <div className="form-group">
                                                <label>Group Image:</label>
                                                <input
                                                    type="file"
                                                    className="form-control"
                                                    onChange={handleImageChange}
                                                />
                                            </div>
                                            {imagePreview && (
                                                <div className="form-group">
                                                    <label>Image Preview:</label>
                                                    <img src={imagePreview} alt="Image Preview" style={{ width: '150px', height: '150px' }} />
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="col-md-6">
                                            <div className="form-group">
                                                <label>Group Name:</label>
                                                <input
                                                    type="text"
                                                    name="group_name"
                                                    id="group_name"
                                                    className="form-control"
                                                    value={groupName}
                                                    onChange={handleGroupNameChange}
                                                    required
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    <button type="submit" className="btn btn-primary text-right">Create</button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </>
    );
};

export default CreateGroup;
