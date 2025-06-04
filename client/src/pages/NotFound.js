import { NavLink } from 'react-router-dom';

function NotFound() {
    return (
        <div className="bg-zinc-900 h-screen flex justify-center items-center">
            <div className="bg-zinc-800 p-10 rounded-lg text-center flex flex-col gap-2 w-96">
                <h1 className="text-2xl text-white mb-2">404 | Page Not Found</h1>
                <NavLink to={"/home"} className="text-violet-400 text-sm hover:text-violet-300 transition">Go back to Home Page →</NavLink>
            </div>
        </div>
    );
}

export default NotFound;