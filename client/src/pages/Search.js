import Navbar from "../components/Navbar";

export default function Search(){
    return(
        <div className="bg-zinc-900 h-screen">
            <Navbar/>
            <div className="bg-zinc-800 m-5 p-10 h-full rounded-md">
                <div className="flex justify-center text-gray-100">
                    <input className="bg-zinc-500 rounded-md w-auto " placeholder=""/>
                    <button className="rounded">
                        Search
                    </button>
                </div>
            </div>
        </div>
    )
}