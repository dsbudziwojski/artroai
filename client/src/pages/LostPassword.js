import {NavLink, useNavigate} from 'react-router-dom';
import logo from "../artroai.png";

function LostPassword() {
    const navigate = useNavigate();
    return (
        <div className="bg-zinc-900 h-screen flex justify-center items-center">
            <div className="bg-zinc-800 p-10 rounded-lg text-center flex flex-col gap-2 w-96">
                <h1 className="text-2xl text-white mb-2">That's a you problem buddy</h1>
                <NavLink to={"/"} className="text-violet-400 text-sm mt-4"><button onClick={() => navigate("/")}>Go back to Login →</button></NavLink>
            </div>
        </div>

    );
}

export default LostPassword;