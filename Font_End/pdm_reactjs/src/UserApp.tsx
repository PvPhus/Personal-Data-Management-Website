import React from 'react';
import './App.css';
import './assets/css/style.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { UserProvider } from './constant/userContext';
import Footer from "./components/user/footer";
import Sidebar from "./components/user/sidebar";
import Register from './services/register';
import Login from './services/login';
import Alldata from './pages/user/alldata';
import File from './pages/user/file';
import Video from './pages/user/video';
import Image from './pages/user/image';
import Create from './components/user/functions/create';
import Update from './components/user/functions/update';
import Joingroup from './pages/user/joingroup';
import MyGroup from './pages/user/mygroup';
import CreateGroup from './pages/user/Group/creategroup';
import ListDataGroup from './pages/user/listdatagroup';
import GroupRequest from './pages/user/grouprequest';
import GroupMembers from './pages/user/groupmembers';
import Share from './components/user/functions/share';
import FunctionUser from './components/user/function';
import Search from './components/user/functions/search';
import SearchGroup from './pages/user/Group/searchgroup';
import Information from './components/user/functions/information';
import InforUser from './pages/user/inforuser';
import SearchDataGroup from './pages/user/Group/searchdatagroup';



const UserApp: React.FC = () => {
  return (
    <UserProvider>
      <Router>
        <div className="background-image">
          <Sidebar />
          <FunctionUser />
          <Alldata />
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/alldata" element={<Alldata />} />
            <Route path="/register" element={<Register />} />
            <Route path="/search/:filename_new" element={<Search />} />
            <Route path="/searchgroup/:group_name" element={<SearchGroup />} />
            <Route path="/searchdatagroup/:filename_new" element={<SearchDataGroup />} />
            <Route path="/file" element={<File />} />
            <Route path="/video" element={<Video />} />
            <Route path="/image" element={<Image />} />
            <Route path="/create/file" element={<Create />} />
            <Route path="/information/file/:file_id" element={<Information />} />
            <Route path="/update/file/:file_id" element={<Update />} />
            <Route path="/share/file/:file_id" element={<Share />} />
            <Route path="/joingroup/:userId" element={<Joingroup />} />
            <Route path="/infouser/:userId" element={<InforUser />} />
            <Route path="/mygroup/:userId" element={<MyGroup />} />
            <Route path="/listdatagroup/:group_id" element={<ListDataGroup />} />
            <Route path="/openRequests/:group_id" element={<GroupRequest />} />
            <Route path="/openMembers/:group_id" element={<GroupMembers />} />
            <Route path="/creategroup" element={<CreateGroup />} />
          </Routes>
          <Footer />
        </div>
      </Router>
    </UserProvider>
  );
};
export default UserApp;
