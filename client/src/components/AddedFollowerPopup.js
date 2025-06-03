import React from 'react'
import "./AddedFollowerPopup.css"

function Popup(props){
    return (props.trigger) ? (
        <div className="popup">
            <div className="popup-inner">
                <button className="popup-close" onClick={() => props.setTrigger(false)}>Done</button>
                {props.children}
            </div>
        </div>
    ) : "";
}

export default Popup