import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { useUser } from '../../../constant/userContext';
import Sidebar from "../../../components/user/sidebar";
import FunctionUser from "../../../components/user/function";

const ListRequestFriend: React.FC = () => {

    return (
        <>      
            <Sidebar />
            <FunctionUser />
            <main>
                <div className="content">
                   
                </div>
            </main>

        </>
    );
};

export default ListRequestFriend;
