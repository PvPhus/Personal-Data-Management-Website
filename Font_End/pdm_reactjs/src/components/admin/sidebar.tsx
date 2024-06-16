import React from "react";
import { useNavigate } from "react-router-dom";

const Sidebar = () => {
    const navigate = useNavigate();

    const files = () => {
        navigate("/show-files");
    }

    const images = () => {
        navigate("/show-images");
    }

    const videos = () => {
        navigate("/show-videos");
    }

    const users = () => {
        navigate("/show-users");
    }

    const activity = () => {
        navigate("/show-activitys");
    }

    const groups = () => {
        navigate("/show-groups");
    }

    return (
        <>
            {/* Sidebar */}
            <ul className="navbar-nav bg-gradient-primary sidebar sidebar-dark accordion" id="accordionSidebar">
                {/* Sidebar - Brand */}
                <a className="sidebar-brand d-flex align-items-center justify-content-center" href="index.html">
                    <div className="sidebar-brand-icon rotate-n-15">
                        <i className='bx bxs-data'></i> 
                    </div>
                    <div className="sidebar-brand-text mx-3">ADMIN P-D-M</div>
                </a>
                <hr className="sidebar-divider my-0" />
                {/* Heading */}
                <div className="sidebar-heading">
                    Interface
                </div>
                <li className="nav-item">
                    <a className="nav-link collapsed" onClick={videos} data-toggle="collapse" data-target="#collapseUtilities" aria-expanded="true" aria-controls="collapseUtilities">  
                        <span>Danh sách Videos</span>
                    </a>
                </li>
                
                <li className="nav-item">
                    <a className="nav-link collapsed" onClick={files} data-toggle="collapse" data-target="#collapseTwo" aria-expanded="true" aria-controls="collapseTwo">
                        <span>Danh sách Files</span>
                    </a>
                </li>
                <li className="nav-item">
                    <a className="nav-link collapsed" onClick={images} data-toggle="collapse" data-target="#collapseUtilities" aria-expanded="true" aria-controls="collapseUtilities">  
                        <span>Danh sách Images</span>
                    </a>
                </li>
                <li className="nav-item">
                    <a className="nav-link collapsed" onClick={activity} data-toggle="collapse" data-target="#collapseUtilities" aria-expanded="true" aria-controls="collapseUtilities">  
                        <span>Lịch sử hoạt động</span>
                    </a>
                </li>
                <li className="nav-item">
                    <a className="nav-link collapsed" onClick={groups} data-toggle="collapse" data-target="#collapseUtilities" aria-expanded="true" aria-controls="collapseUtilities">  
                        <span>Danh sách Groups</span>
                    </a>
                </li>
                <li className="nav-item">
                    <a className="nav-link collapsed" onClick={users} data-toggle="collapse" data-target="#collapseTwo" aria-expanded="true" aria-controls="collapseTwo">
                        <span>Danh sách người dùng</span>
                    </a>
                </li>
                {/* Divider */}
                <hr className="sidebar-divider" />
            </ul>
        </>
    );
}

export default Sidebar;
