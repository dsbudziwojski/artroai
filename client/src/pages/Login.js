import {useState} from 'react';
import {NavLink, useNavigate} from 'react-router-dom';
import logo from '../artroai.png';

function Login() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();
    return (
        <div className="bg-zinc-900 h-screen flex justify-center items-center">
            <div className="bg-zinc-800 p-10 rounded-lg text-center flex flex-col gap-2 w-96">
                <img src={logo} alt="ArtroAI Logo" className="w-22 h-22 mx-auto mb-4" />
                <h1 className="text-2xl text-white mb-2">Login</h1>
                <input className="p-1 bg-zinc-700 text-sm text-zinc-300 placeholder-zinc-400 rounded" type="text" placeholder="Username" onChange={(e) => {setUsername(e.target.value)}} required/>
                <input className="p-1 bg-zinc-700 text-sm text-zinc-300 placeholder-zinc-400 rounded" type="password" placeholder="Password" onChange={(e) => {setPassword(e.target.value)}} required/>
                <button className="bg-violet-500 text-sm text-zinc-100 p-1.5 w-full rounded" onClick={() => navigate("/home")}>Login</button>
                <div className="text-zinc-300 text-xs">Forgot Password? <span className="text-zinc-200 underline" onClick={() => navigate("/lostpassword")}>Click Here</span></div>
                <NavLink to={"/signup" /*ADD THIS PLEASE*/} className="text-violet-400 text-sm mt-4"><button>Switch to Sign Up →</button></NavLink>
            </div>
        </div>
    );
}

export default Login;