import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Topbar: React.FC = () => {
    const navigate = useNavigate();
    const [filename_new, setfilename_new] = useState<string>('');

    const handleSearch = () => {
        if (filename_new.trim()) {
            navigate(`/search/${filename_new}`);
        } else {
            alert("Please enter a search term.");
        }
    };

    return (
        <header>
            <div className="searchbar">
                <li>
                    <button onClick={handleSearch} style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer' }}>
                        <svg xmlns="http://www.w3.org/2000/svg" width={36} height={36} viewBox="0 0 24 24">
                            <path d="M13.707 2.293A.996.996 0 0 0 13 2H6c-1.103 0-2 .897-2 2v16c0 1.103.897 2 2 2h12c1.103 0 2-.897 2-2V9a.996.996 0 0 0-.293-.707l-6-6zM6 4h6.586L18 9.414l.002 9.174-2.568-2.568c.35-.595.566-1.281.566-2.02 0-2.206-1.794-4-4-4s-4 1.794-4 4 1.794 4 4 4c.739 0 1.425-.216 2.02-.566L16.586 20H6V4zm6 12c-1.103 0-2-.897-2-2s.897-2 2-2 2 .897 2 2-.897 2-2 2z"></path>
                        </svg>
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

export default Topbar;
