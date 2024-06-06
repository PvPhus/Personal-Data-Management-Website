import './App.css';
import './styles/sb-admin-2.min.css';

import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Login } from './pages/Account/Login';
import { Admin } from './pages/Admin/Admin';
import { PrivateRoute } from './components/PrivateRoute';


function App() {
  return (
    <div className="App" id="wrapper">
      <Router>
        <Routes>
          <PrivateRoute>
            <Route path="/login" element={<Login />} />
          </PrivateRoute>
          <Route path="/admin" element={<Admin />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
