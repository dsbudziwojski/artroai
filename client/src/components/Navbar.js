import { useNavigate, NavLink } from 'react-router-dom';
import { useAuth } from '../AuthContext';
import { signOut } from 'firebase/auth';
import {auth} from '../firebase'

function GeneralButton({label, route}){
    return(
        <NavLink to={route} className="px-3 py-2 rounded-md hover:bg-zinc-100 hover:text-violet-800 transition">{label}</NavLink>
    )
}

function SignOutButton() {
    // similar but RED!!
    const navigate = useNavigate();
    const handleSignOut = async () => {
        try {
            await signOut(auth);
            navigate('/');
        } catch (error){
            console.error('Invalid sign out: ', error);
        }
    };
    return(
        <NavLink to={"/"} className="px-3 py-2 rounded-md hover:bg-red-500 transition" onClick={handleSignOut}>Sign Out</NavLink>
    )
}

export default function Navbar() {
    const { user: currentUser } = useAuth();
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
                        <GeneralButton label="Home" route="/home"/>
                        <GeneralButton label="My Account" route={`/profile/${currentUser}`}/>
                        <GeneralButton label="Search" route="/search"/>
                        <GeneralButton label="Generate Image" route="/generate/image"/>
                    </div>
                    <div className="mx-3">
                        <SignOutButton/>
                    </div>
                </div>
            </nav>
        </div>
    )
}



