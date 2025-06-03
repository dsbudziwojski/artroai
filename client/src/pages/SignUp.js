import {useState} from "react";
import { NavLink, useNavigate } from 'react-router-dom';
import logo from '../artroai.png';
import {auth} from '../firebase';
import {createUserWithEmailAndPassword, getIdToken, updateProfile} from "firebase/auth";

function SignUp() {
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(true)
    const [profileImagePath, setProfileImagePath] = useState(logo)

    const navigate = useNavigate();

    const handleSignUp = async () => {
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const firebaseUser = userCredential.user;
            await updateProfile(firebaseUser, {
                displayName: firstName,
            });
            if (!auth.currentUser) {
                return;
            }
            const idToken =  await getIdToken(auth.currentUser, false)
            const headers = {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${idToken}`
            }
            const username = firebaseUser.email.split("@")[0]

            // profile image gen
            const res = await fetch('/api/generate-images', {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({
                    prompt: `Create Profile Image for ${username} in a pixel manner`
                }),
            });

            const data = await res.json();
            if(!res.ok || !data.image){
                throw new Error(data.errorMsg || "Image generation failure");
            }

            const imageURL= data.image.path
            setProfileImagePath(imageURL)

            const response = await fetch("/api/users", {
                method: "POST",
                headers: headers,
                body: JSON.stringify({
                    username: username,
                    first_name: firstName,
                    last_name: lastName,
                    email: firebaseUser.email,
                    bio: "",
                    isadmin:false,
                    profile_image_path: imageURL
                }),
            });

            if (!response.ok) {
                throw new Error("Failed create user profile");
            }
            navigate("/home");
        } catch (error){
            console.error("Sign-up error:" , error.message);
            alert("Sign-up failed: " + error.message);
        }
    };

    return (
        <div className="bg-zinc-900 h-screen flex justify-center items-center">
            <div className="bg-zinc-800 p-10 rounded-lg text-center flex flex-col gap-2 w-96">
                <img src={logo} className="rounded-lg w-50 h-auto mx-auto mb-4" />
                <h1 className="text-2xl text-white mb-2">Sign Up</h1>
                <input className="p-1 bg-zinc-700 text-sm text-zinc-300 placeholder-zinc-400 rounded" type="text" placeholder="First Name" onChange={(e) => {setFirstName(e.target.value)}} required/>
                <input className="p-1 bg-zinc-700 text-sm text-zinc-300 placeholder-zinc-400 rounded" type="text" placeholder="Last Name" onChange={(e) => {setLastName(e.target.value)}} required/>
                <input className="p-1 bg-zinc-700 text-sm text-zinc-300 placeholder-zinc-400 rounded" type="email" placeholder="Email" onChange={(e) => {setEmail(e.target.value)}} required/>
                <input className="p-1 bg-zinc-700 text-sm text-zinc-300 placeholder-zinc-400 rounded" type="password" placeholder="Password" onChange={(e) => {setPassword(e.target.value)}} required/>
                <button className="bg-violet-500 text-sm text-zinc-100 p-1.5 w-full rounded" onClick={handleSignUp}>Sign Up</button>
                <NavLink to={"/"} className="text-violet-400 text-sm mt-4"><button>Switch to Login →</button></NavLink>
                <img src={profileImagePath} />
            </div>
        </div>
    );
}
export default SignUp