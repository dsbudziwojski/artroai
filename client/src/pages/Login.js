import {useState} from 'react';
import {NavLink, useNavigate} from 'react-router-dom';
import logo from '../artroai.png';
import {createContext, useContext, useEffect} from 'react';
import {getAuth, onAuthStateChanged, updateCurrentUser} from 'firebase/auth'
import {auth} from '../firebase'
import { signInWithEmailAndPassword } from 'firebase/auth';



function Login() {

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const handleLogin = async() =>{
        try{
            const userCredential = await signInWithEmailAndPassword(auth, username, password);
            const user = userCredential.user;
            console.log("Logged in user: ", user);
            navigate("/home");
        } catch (error) {
            console.error("Login error:", error.message);
            alert("Login failed. please check your email and password.");
        }
    };

    return (
        <div className="bg-zinc-900 h-screen flex justify-center items-center">
            <div className="bg-zinc-800 p-10 rounded-3xl text-center flex flex-col gap-2 w-96">
                <img src={logo} className="rounded-lg w-50 h-auto mx-auto mb-4" />
                <h1 className="text-2xl text-zinc-100 mb-2">Login</h1>
                <input className="p-1 text-sm border border-zinc-500 bg-zinc-700 text-zinc-300 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-violet-500 transition placeholder-zinc-400 rounded" type="text" placeholder="Email" onChange={(e) => {setUsername(e.target.value)}} required/>
                <input className="p-1 text-sm border border-zinc-500 bg-zinc-700 text-zinc-300 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-violet-500 transition placeholder-zinc-400 rounded" type="password" placeholder="Password" onChange={(e) => {setPassword(e.target.value)}} required/>
                <button className="bg-violet-500 text-sm text-zinc-100 p-1.5 w-full hover:bg-violet-600 rounded-md transition" onClick={handleLogin}>Login</button>
                <div className="text-zinc-300 text-xs">Forgot Password? <NavLink to={"/lostpassword"} className="text-zinc-300 hover:text-zinc-100 transition underline">Click Here</NavLink></div>
                <NavLink to={"/signup"} className="text-violet-400 text-sm mt-4 hover:text-violet-300 transition"><button>Switch to Sign Up →</button></NavLink>
            </div>
        </div>
    );
}

export default Login;