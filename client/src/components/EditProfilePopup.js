import React from 'react'

function Popup(props){
    return (props.trigger) ? (
        <div className="fixed top-0 left-0 w-full h-screen bg-black bg-opacity-20 flex justify-center items-center z-50">
            <div className="relative p-8 w-full max-w-xl bg-white rounded-lg shadow-lg">
                <button className="absolute top-4 right-4 px-3 py-1 bg-gray-200 hover:bg-gray-300 rounded" onClick={() => props.setTrigger(false)}>Cancel</button>
                {props.children}
            </div>
        </div>
    ) : "";
}

export default Popup