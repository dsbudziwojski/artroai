import { useNavigate } from 'react-router-dom';

function NotFound() {
    const navigate = useNavigate();
    return (
        <div className="bg-zinc-900 h-screen flex justify-center items-center">
            <div className="bg-zinc-800 p-10 rounded-lg text-center flex flex-col gap-2 w-96">
                <h1 className="text-2xl text-white mb-2">404 | Page Not Found</h1>
                <button className="text-violet-400 text-sm mt-4" onClick={() => navigate("/home")}>Go back to Home Page →</button>
            </div>
        </div>
    );
}

export default NotFound;