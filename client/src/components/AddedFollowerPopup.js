import React from 'react'

function Popup(props){
    return (props.trigger) ? (
        <div className="fixed top-0 left-0 w-full h-screen bg-black bg-opacity-20 flex justify-center items-start pt-16 z-40">
            <div className="relative p-1 w-full max-w-xl bg-violet-500 rounded-lg brightness-[1.05] shadow-lg pt-4 z-25">
                <button className="absolute top-4 right-2 px-2 py-0 text-opacity-80 text-zinc-100 hover:bg-zinc-100 hover:text-violet-800 rounded transition" onClick={() => props.setTrigger(false)}>X</button>
                {props.children}
            </div>
        </div>
    ) : "";
}

export default Popup