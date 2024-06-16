import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import AdminApp from './AdminApp';
import UserApp from './UserApp';
import reportWebVitals from './reportWebVitals';


// const rootAdminElement = document.getElementById('root-admin');
// if (rootAdminElement) {
//   const rootAdmin = ReactDOM.createRoot(rootAdminElement);
//   rootAdmin.render(
//     <React.StrictMode>
//       <AdminApp />
//     </React.StrictMode>
//   );
// } else {
//   console.error("Failed to find the root-admin element");
// }


const rootUserElement = document.getElementById('root-user');
if (rootUserElement) {
  const rootUser = ReactDOM.createRoot(rootUserElement);
  rootUser.render(
    <React.StrictMode>
      <UserApp />
    </React.StrictMode>
  );
} else {
  console.error("Failed to find the root-user element");
}

reportWebVitals();
