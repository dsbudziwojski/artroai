import { useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';

function GeneralButton({label, route}){
    const navigate = useNavigate();
    return(
        <button
            className="px-3 py-2"
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
            className="px-3 py-2 rounded-md hover:bg-red-500 transition"
            onClick={() => navigate("/")}
        >
            Sign Out
        </button>
    )
}

export default function Navbar() {
    return(
        <div className="fixed top-0 left-0 right-0 z-50">
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
                        <GeneralButton label="My Account" route={`/profile/${useAuth()}`}/>
                        <GeneralButton label="Home" route="/home"/>
                        <GeneralButton label="Search" route="/search"/>
                    </div>
                    <div className="mx-3">
                        <SignOutButton/>
                    </div>
                </div>
            </nav>
        </div>
    )
}


