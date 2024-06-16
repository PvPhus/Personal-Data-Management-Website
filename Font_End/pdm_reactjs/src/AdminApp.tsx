// AdminApp.tsx
import React from 'react';
import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Sidebar from './components/admin/sidebar';
import Topbar from './components/admin/content/topbar';
import ShowFile from './pages/admin/ListData/ListFile';
import ShowImage from './pages/admin/ListData/ListImage';
import ShowVideo from './pages/admin/ListData/ListVideo';
import ShowGroup from './pages/admin/ListGroup/showgroup';
import ShowActivity from './pages/admin/ListActivity/showactivity';
import ShowListData from './pages/admin/ListGroup/showlistdatas';
import ShowListMembers from './pages/admin/ListGroup/showlistmembers';
import Footer from './components/admin/content/footer';
import Logout from './components/admin/logout';
import { UserProvider } from './constant/userContext';


const AdminApp: React.FC = () => {
    return (
        <UserProvider>
            <Router>
                <body id="page-top">
                    <div id="wrapper">
                        <Sidebar />
                        <div id="content-wrapper" className="d-flex flex-column">
                            <div id="content">
                                <Topbar />
                                <Routes>
                                    <Route path='/show-files' element={< ShowFile />} />
                                    <Route path='/show-images' element={< ShowImage />} />
                                    <Route path='/show-videos' element={< ShowVideo />} />
                                    <Route path='/show-groups' element={< ShowGroup />} />
                                    <Route path='/show-activitys' element={< ShowActivity />} />
                                    <Route path='/show/group/listdata/:group_id' element={< ShowListData />} />
                                    <Route path='/show/group/listmember/:group_id' element={< ShowListMembers />} />
                                </Routes>
                                <Footer />
                            </div>
                        </div>
                        <Logout />
                    </div>
                </body>
            </Router>
        </UserProvider>
    );
};

export default AdminApp;
