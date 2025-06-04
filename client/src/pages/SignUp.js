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
    const [loading, setLoading] = useState(false)
    const [profileImagePath, setProfileImagePath] = useState(logo)
    const [creatingProfileError, setCreatingProfileError] = useState(false)

    const navigate = useNavigate();


    const handleSignUp = async () => {
        setLoading(true)

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
            const res = await fetch('/api/generate-profile-image', {
                method: "POST",
                headers: headers,
                body: JSON.stringify({
                    prompt: `Create Profile Image for ${username} in a pixel manner, keep things in theme with cyberpunk, matrix, and bladerunner` ,
                    created_by: username
                }),
            });

            const data = await res.json();
            if(!res.ok || !data.path){
                throw new Error(data.errorMsg || "Image generation failure");
            }

            const imageURL= data.path
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
            setCreatingProfileError(true)
        }
    };

    return (
        <div className="bg-zinc-900 h-screen flex justify-center items-center">
            <div className="bg-zinc-800 p-10 rounded-lg text-center flex flex-col gap-2 w-96">
                {(loading) ?
                    <div className="fixed top-0 left-0 w-full h-screen bg-black bg-opacity-20 flex justify-center items-center z-50">
                        <div className="relative p-8 w-full max-w-xl bg-white rounded-lg shadow-lg">
                            {!(creatingProfileError) ?
                                <div>
                                    Creating Profile...
                                </div>
                                :
                                <div>
                                    <button className="absolute top-4 right-4 px-3 py-1 text-sm text-zinc-400 bg-gray-200 hover:bg-gray-300 rounded"
                                            onClick={() => {
                                                setLoading(false)
                                            }}>
                                        Got it!
                                    </button>
                                    Sorry An Error Occurred... Try Again Please!
                                </div>
                            }


                        </div>
                    </div> : null
                }
                <img src={logo} className="rounded-lg w-50 h-auto mx-auto mb-4" />
                <h1 className="text-2xl text-white mb-2">Sign Up</h1>
                <input className="p-1 bg-zinc-700 text-sm text-zinc-300 placeholder-zinc-400 rounded" type="text" placeholder="First Name" onChange={(e) => {setFirstName(e.target.value)}} required/>
                <input className="p-1 bg-zinc-700 text-sm text-zinc-300 placeholder-zinc-400 rounded" type="text" placeholder="Last Name" onChange={(e) => {setLastName(e.target.value)}} required/>
                <input className="p-1 bg-zinc-700 text-sm text-zinc-300 placeholder-zinc-400 rounded" type="email" placeholder="Email" onChange={(e) => {setEmail(e.target.value)}} required/>
                <input className="p-1 bg-zinc-700 text-sm text-zinc-300 placeholder-zinc-400 rounded" type="password" placeholder="Password" onChange={(e) => {setPassword(e.target.value)}} required/>
                <button className="bg-violet-500 text-sm text-zinc-100 p-1.5 w-full rounded" onClick={handleSignUp}>Sign Up</button>
                <NavLink to={"/"} className="text-violet-400 text-sm mt-4"><button>Switch to Login →</button></NavLink>
            </div>
        </div>
    );
}
export default SignUp