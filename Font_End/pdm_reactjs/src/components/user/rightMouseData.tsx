import React from "react";

const RightMouse = () => {
    return (
        <>
            <div id="contextMenu" className="context-menu">
                <ul>
                    <li><a href="#">Information <i className="bx bxs-show icon" /></a></li>
                    <li><a href="#">Share <i className="bx bxs-share icon" /></a></li>
                    <li><a href="#">Download <i className='bx bxs-download icon'></i></a></li>
                    <li><a href="#">Delete <i className="bx bxs-trash icon" /></a></li>
                </ul>
            </div>
        </>
    )

}
export default RightMouse;