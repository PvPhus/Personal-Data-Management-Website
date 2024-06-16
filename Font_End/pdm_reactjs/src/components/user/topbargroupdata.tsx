import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const TopbarGroupData = () => {
    const navigate = useNavigate();
    const [filename_new, setfilename_new] = useState<string>('');

    const handleSearch = () => {
        if (filename_new.trim()) {
            navigate(`/searchdatagroup/${filename_new}`);
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
                    value={filename_new}
                    onChange={(e) => setfilename_new(e.target.value)}
                />            
            </div>
        </header>
    );
};

export default TopbarGroupData;
