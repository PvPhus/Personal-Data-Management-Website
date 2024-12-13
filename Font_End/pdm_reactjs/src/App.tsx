import React from 'react';
import './App.css';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import LoginRegister from './services/loginregister';
import { UserProvider, useUser } from './constant/userContext';

import Alldata from './pages/user/alldata';
import Search from './components/user/functions/search';
import SearchGroup from './pages/user/Group/searchgroup';
import SearchDataGroup from './pages/user/Group/searchdatagroup';
import File from './pages/user/Upload/file';
import Video from './pages/user/Upload/video';
import Image from './pages/user/Upload/image';
import Create from './components/user/functions/create';
import CreateGroup from './pages/user/Group/creategroup';
import Information from './components/user/functions/information';
import Update from './components/user/functions/update';
import Share from './components/user/functions/share';
import Joingroup from './pages/user/Group/joingroup';
import InforUser from './pages/user/FunctionUser/inforuser';
import MyGroup from './pages/user/Group/mygroup';
import ListDataGroup from './pages/user/Group/listdatagroup';
import GroupRequest from './pages/user/Group/grouprequest';
import GroupMembers from './pages/user/Group/groupmembers';

import ShowGroup from './pages/admin/ListGroup/showgroup';
import ShowActivity from './pages/admin/ListActivity/showactivity';
import ShowListData from './pages/admin/ListGroup/showlistdatas';
import ShowListMembers from './pages/admin/ListGroup/showlistmembers';
import ShowFiles from './pages/admin/ListData/ListFile';
import ShowImages from './pages/admin/ListData/ListImage';
import ShowVideos from './pages/admin/ListData/ListVideo';
import DeletedData from './pages/user/Trash/deleteddata';
import ListRequestFriend from './pages/user/Friend/requestfriends';
import ChatFriend from './pages/user/Friend/chatfriends';
import InformationUser from './pages/user/Friend/informationuser';
import ShareListData from './pages/user/Friend/sharelistdata';
import VideoCallApp from './components/user/videocall';

const App: React.FC = () => {
    return (
        <UserProvider>
            <Router>
                <AppRoutes />
            </Router>
        </UserProvider>
    );
};

const AppRoutes: React.FC = () => {
    const { role } = useUser(); // Access role within AppRoutes component

    return (

        <Routes>
            <Route path="/login-register" element={<LoginRegister />} />
            {/* Routes based on user role */}
            {role === 'NguoiDung' && (
                <>
                    <Route path="/alldata/:userId" element={<Alldata />} />
                    <Route path="/search/:filename_new" element={<Search />} />
                    <Route path="/searchgroup/:group_name" element={<SearchGroup />} />
                    <Route path="/searchdatagroup/:filename_new" element={<SearchDataGroup />} />
                    <Route path="/files/:userId" element={<File />} />
                    <Route path="/videos/:userId" element={<Video />} />
                    <Route path="/images/:userId" element={<Image />} />
                    <Route path="/trash/:userId" element={<DeletedData />}/>
                    <Route path="/create/file" element={<Create />} />
                    <Route path="/information/:file_id" element={<Information />} />
                    <Route path="/update/file/:file_id" element={<Update />} />
                    <Route path="/share/:file_id" element={<Share />} />
                    <Route path="/joingroup/:userId" element={<Joingroup />} />
                    <Route path="/infouser/:userId" element={<InforUser />} />
                    <Route path="/informationuser/:user_id" element={<InformationUser />} />
                    <Route path="/mygroup/:userId" element={<MyGroup />} />
                    <Route path="/group/information/file/:file_id" element={<Information />} />
                    <Route path="/listdatagroup/:group_id" element={<ListDataGroup />} />
                    <Route path="/openRequests/:group_id" element={<GroupRequest />} />
                    <Route path="/openMembers/:group_id" element={<GroupMembers />} />
                    <Route path="/creategroup" element={<CreateGroup />} />
                    <Route path="/requestfriend/:userId" element={<ListRequestFriend />} />
                    <Route path="/chatfriend/:user_id" element={<ChatFriend />} />
                    <Route path="/friend-chat/share/:file_id" element={<Share />} />
                    <Route path="/friend-chat/information/file/:file_id" element={<Information />} />
                    <Route path="/friend-chat/share-list-data/:receiver_id" element={<ShareListData />} />
                    <Route path="/friend-chat/video-call/:user_id" element={<VideoCallApp />} />
                </>
            )}
            {role === 'Admin' && (
                <>
                    <Route path='/show-files' element={< ShowFiles />} />
                    <Route path='/show-images' element={< ShowImages />} />
                    <Route path='/show-videos' element={< ShowVideos />} />
                    <Route path='/show-groups' element={< ShowGroup />} />
                    <Route path='/show-activitys' element={< ShowActivity />} />
                    <Route path='/show/group/listdata/:group_id' element={< ShowListData />} />
                    <Route path='/show/group/listmember/:group_id' element={< ShowListMembers />} />
                </>
            )}
            {/* Default route */}
            <Route path="/" element={<Navigate to="/login-register" />} />
        </Routes>

    );
};

export default App;
