import React from 'react'

function Popup(props){
    return (props.trigger) ? (
        <div className="fixed top-0 left-0 w-full h-screen bg-black bg-opacity-20 flex justify-center items-center z-50">
            <div className="relative p-8 w-full max-w-xl bg-zinc-700 rounded-lg shadow-lg">
                <button className="absolute bottom-8 right-52 px-2 py-1 text-zinc-100 bg-red-500 hover:bg-red-600 font-bold rounded transition" onClick={() => props.setTrigger(false)}>Cancel</button>
                {props.children}
            </div>
        </div>
    ) : "";
}

export default Popup