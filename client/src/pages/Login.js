import {useState} from 'react';
import { useNavigate } from 'react-router-dom';

function Login() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [action, setAction] = useState("Sign Up");
    const navigate = useNavigate();
    return (
        <div className="container">
            <div className="header">
                <div className="text">{action}</div>
            </div>
            <div className="inputs">
                {action==="Login"?<div></div>:<div className="input">
                    <img src="" alt="" />
                    <input type="text" placeholder="Name" onChange={(e) => {setName(e.target.value)}} required/>
                </div>}
                <div className="input">
                    <img src="" alt="" />
                    <input type="email" placeholder="Email" onChange={(e) => {setEmail(e.target.value)}} required/>
                </div>
                <div className="input">
                    <img src="" alt="" />
                    <input type="password" placeholder="Password" onChange={(e) => {setPassword(e.target.value)}} required/>
                </div>
            </div>
            <div className="submits">
                {action==="Sign Up"?<button onClick={() => navigate("/home")}>Sign Up</button>:<button onClick={() => navigate("/home")}>Login</button>}
            </div>
            {action==="Sign Up"?<div></div>:<div className="forgot-password">Forgot Password? <span onClick={() => navigate("/lostpassword")}>Click Here!</span></div>}
            <div className="switches">
                {action==="Sign Up"?<div onClick={() => {setAction("Login")}}>Switch to Login</div>:<div onClick={() => {setAction("Sign Up")}}>Switch to Sign Up</div>}
            </div>
        </div>
    );
}

export default Login;