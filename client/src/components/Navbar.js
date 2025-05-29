import { useNavigate } from 'react-router-dom';


function GeneralButton({label, route}){
    const navigate = useNavigate();
    return(
        <button
            className="px-3 py-2 rounded-md hover:bg-violet-600 focus:outline-none focus:ring-2 focus:ring-violet-300 transition"
            onClick={() => navigate(route)}
        >
            {label}
        </button>
    )
}

function SignOutButton() {
    // similar but RED!!
    const navigate = useNavigate();
    return(
        <button
            className="px-3 py-2 rounded-md hover:bg-red-500 focus:outline-none focus:ring-2 focus:ring-violet-300 transition"
            onClick={() => navigate("/")}
        >
            Sign Out
        </button>
    )
}

export default function Navbar({myUsername}) {

    return(
        <nav className="bg-violet-500 text-lg text-zinc-100 shadow-md">

            <div className="p-2 flex items-center">
                <div>
                    <img
                        src="/artroLogo.png"
                        alt="ArtroAI Logo"
                        className="h-16 w-auto"
                    />
                </div>
                <div className="flex-1 justify-center mx-3 space-x-4">
                    <GeneralButton label="My Account" route={`/profile/${myUsername}`}/>
                    <GeneralButton label="Home" route="/home"/>
                    <GeneralButton label="Search" route="/search"/>

                </div>
                <div className="mx-3">
                    <SignOutButton/>
                </div>

            </div>

        </nav>
    )
}


