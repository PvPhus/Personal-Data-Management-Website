import React from 'react';
import './App.css';
import './assets/css/style.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { UserProvider } from './constant/userContext';
import Footer from "./components/footer";
import Sidebar from "./components/sidebar";
import Register from './components/register';
import Login from './components/login';
import Alldata from './pages/alldata';
import File from './pages/file';
import Video from './pages/video';
import Image from './pages/image';
import Create from './components/functions/create';
import Update from './components/functions/update';
import Joingroup from './pages/joingroup';
import MyGroup from './pages/mygroup';
import CreateGroup from './pages/Group/creategroup';
import ListDataGroup from './pages/listdatagroup';
import GroupRequest from './pages/grouprequest';
import GroupMembers from './pages/groupmembers';
import Share from './components/functions/share';
import FunctionUser from './components/function';
import Search from './components/functions/search';


const App: React.FC = () => {
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
            <Route path="/file" element={<File />} />
            <Route path="/video" element={<Video />} />
            <Route path="/image" element={<Image />} />
            <Route path="/create/file" element={<Create />} />
            <Route path="/update/file/:file_id" element={<Update />} />
            <Route path="/joingroup/:userId" element={<Joingroup />} />
            <Route path="/mygroup/:userId" element={<MyGroup />} />
            <Route path="/listdatagroup/:group_id" element={<ListDataGroup />} />
            <Route path="/openRequests/:group_id" element={<GroupRequest />} />
            <Route path="/openMembers/:group_id" element={<GroupMembers />} />
            <Route path="/creategroup" element={<CreateGroup />} />
            <Route path="/share/file/:file_id" element={<Share />} />
          </Routes>
          <Footer />
        </div>
      </Router>
    </UserProvider>
  );
};
export default App;
