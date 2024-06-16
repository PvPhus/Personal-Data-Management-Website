import React from 'react';
import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Topbar from './components/admin/content/topbar';
import Sidebar from './components/admin/sidebar';
import Footer from './components/admin/content/footer';
import Logout from './components/admin/logout';
import ShowFile from './pages/ListData/ListFile';
import ShowImage from './pages/ListData/ListImage';
import ShowVideo from './pages/ListData/ListVideo';
import ShowGroup from './pages/ListGroup/showgroup';
import ShowListData from './pages/ListGroup/showlistdatas';
import ShowListMembers from './pages/ListGroup/showlistmembers';
import ShowActivity from './pages/ListActivity/showactivity';


const App: React.FC = () => {
  return (
    <Router>
      <body id="page-top">
        <div id="wrapper">
          <Sidebar />
          <div id="content-wrapper" className="d-flex flex-column">
            <div id="content">
              <Topbar />
              <Routes>
                <Route path='/show-files' element={< ShowFile/>} />
                <Route path='/show-images' element={< ShowImage/>} />
                <Route path='/show-videos' element={< ShowVideo/>} />
                <Route path='/show-groups' element={< ShowGroup/>} />
                <Route path='/show-activitys' element={< ShowActivity/>} />
                <Route path='/show/group/listdata/:group_id' element={< ShowListData/>} />
                <Route path='/show/group/listmember/:group_id' element={< ShowListMembers/>} />
              </Routes>
              <Footer />
            </div>
          </div>
          <Logout />
        </div>
      </body>
    </Router>
  );
};
export default App;
