import React from 'react'
import "./DailyPopup.css"

function Popup(props){
    return (props.trigger) ? (
        <div className="popup">
            <div className="popup-inner">
                <button className="popup-close" onClick={() => props.setTrigger(false)}>Got it!</button>
                {props.children}
            </div>
        </div>
    ) : "";
}

export default Popup