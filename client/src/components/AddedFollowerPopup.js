import React from 'react'

function Popup(props){
    return (props.trigger) ? (
        <div className="fixed top-0 left-0 w-full h-screen bg-black bg-opacity-20 flex justify-center items-start pt-20 z-50">
            <div className="relative p-1 w-full max-w-xl bg-violet-500 bg-opacity-80 rounded-lg shadow-lg ">
                <button className="absolute top-1 right-2 px-2 py-0 text-opacity-80 text-zinc-100 hover:bg-zinc-100 hover:text-violet-800 rounded transition" onClick={() => props.setTrigger(false)}>Done</button>
                {props.children}
            </div>
        </div>
    ) : "";
}

export default Popup