import {useState} from "react";
import { NavLink, useNavigate } from 'react-router-dom';
import logo from '../artroai.png';

function SignUp() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();
    return (
        <div className="bg-zinc-900 h-screen flex justify-center items-center">
            <div className="bg-zinc-800 p-10 rounded-lg text-center flex flex-col gap-2 w-96">
                <img src={logo} className="rounded-lg w-50 h-auto mx-auto mb-4" />
                <h1 className="text-2xl text-white mb-2">Sign Up</h1>
                <input className="p-1 bg-zinc-700 text-sm text-zinc-300 placeholder-zinc-400 rounded" type="text" placeholder="Name" onChange={(e) => {setName(e.target.value)}} required/>
                <input className="p-1 bg-zinc-700 text-sm text-zinc-300 placeholder-zinc-400 rounded" type="email" placeholder="Email" onChange={(e) => {setEmail(e.target.value)}} required/>
                <input className="p-1 bg-zinc-700 text-sm text-zinc-300 placeholder-zinc-400 rounded" type="password" placeholder="Password" onChange={(e) => {setPassword(e.target.value)}} required/>
                <button className="bg-violet-500 text-sm text-zinc-100 p-1.5 w-full rounded" onClick={() => navigate("/home")}>Sign Up</button>
                <NavLink to={"/"} className="text-violet-400 text-sm mt-4"><button>Switch to Login →</button></NavLink>
            </div>
        </div>
    );
}
export default SignUp