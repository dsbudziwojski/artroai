import React from 'react'

function Popup(props){
    return (props.trigger) ? (
        <div className="fixed top-0 left-0 w-full h-screen bg-black bg-opacity-20 flex justify-center items-center z-50">
            <div className="relative p-8 w-full max-w-xl bg-zinc-700 rounded-lg shadow-lg">
                <button className="absolute top-3 right-3 px-2 py-0.5 text-zinc-100 hover:bg-zinc-300 hover:text-zinc-700 font-bold rounded transition" onClick={() => props.setTrigger(false)}>X</button>
                {props.children}
            </div>
        </div>
    ) : "";
}

export default Popup