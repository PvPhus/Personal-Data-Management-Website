import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const TopbarGroup = () => {
    const navigate = useNavigate();
    const [group_name, setgroup_name] = useState<string>('');

    const handleSearch = () => {
        if (group_name.trim()) {
            navigate(`/searchgroup/${group_name}`);
        } else {
            alert("Please enter a search term.");
        }
    };

    return (
        <header>
            <div className="searchbar">
                <li>
                    <button onClick={handleSearch} style={{background: 'none', border:'none', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '36px', height: '36px', textDecoration: 'none' }}>
                        <i className="bx bx-search-alt" style={{ fontSize: '24px' }}></i>
                    </button>
                </li>
                <input
                    type="text"
                    className="textsearch"
                    placeholder="Search"
                    value={group_name}
                    onChange={(e) => setgroup_name(e.target.value)}
                />            
            </div>
        </header>
    );
};

export default TopbarGroup;
