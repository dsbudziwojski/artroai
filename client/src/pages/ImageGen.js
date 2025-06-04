import React, {useState, useEffect} from 'react';
import ImagePopup from '../components/ImagePopup';
import {useAuth} from '../AuthContext';
import { useSearchParams } from 'react-router-dom';
import Navbar from '../components/Navbar';

import { auth } from '../firebase';
import { getIdToken } from 'firebase/auth';
function ImageGen() {
    const { user: user } = useAuth();
    const [prompt, setPrompt]= useState("");
    // const [username, setUsername]= useState("");
    const [imagePath, setImagePath]= useState("");
    const [hashtags, setHashtags] = useState("");
    const [showPopup, setShowPopup]=useState(false);
    const [loading, setLoading]=useState(false);
    const[error, setError]=useState("");
    console.log("Using username:", user);


    const genImage = async () => {
        if (!user){
            alert("Please sign in to generate image");
            return;
        }

        const created_by =user;
        console.log("Sending request with created_by: ", created_by);

        
        setLoading(true);
        setShowPopup(true);
        setError("");

        let finalUsername = "guest_user";

        

        try {
            if (!auth.currentUser) {
                throw new Error("Invalid user");
            }
            const idToken =  await getIdToken(auth.currentUser, false)
            const headers = {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${idToken}`
            }
            const res = await fetch('/api/generate-images', {
                method: "POST",
                headers: headers,
                body: JSON.stringify({
                    prompt,
                    created_by
                }),
            });

            const data = await res.json();
            if(!res.ok || !data.image){
                throw new Error(data.errorMsg || "Image generation failure");
            }

            console.log("Image path from backend:", data.image.path);
            console.log("Hashtags:", data.image.hashtags);

            const imageURL= data.image.path //`/api/generated-image/${data.image.path.split('/').pop()}`;
            console.log("image url:", imageURL);
            setImagePath(imageURL);
            setHashtags(data.image.hashtags);
        } catch (error){
            setImagePath("");
            alert(error.message);
            setError(error.message);
        } finally{
            setLoading(false);
        }
    };

    return(
        <div className="bg-zinc-900 h-screen flex justify-center items-center">
            <Navbar/>
            <div className="bg-zinc-800 p-10 rounded-lg text-center flex flex-col gap-2 w-96">
                <div>
                    {loading ? (
                        <div className="flex flex-col items-center">
                            <img
                                src="/image-generation-loading.png"
                                alt="Generating Image"
                                className="max-w-full max-h-[75vh] rounded shadow-md"
                            />
                        </div>
                    ) : error ? (
                        <img
                            src="/image-fail-generation.png"
                            alt="Generating Image"
                            className="max-w-full max-h-[75vh] rounded shadow-md"
                        />
                    ) : imagePath ? (
                        <div className="flex flex-col items-center">
                            <img
                                src={imagePath}
                                alt="AI-art"
                                className="max-w-full max-h-[75vh] rounded shadow-md"
                            />
                            <p className="text-sm text-gray-600 mt-2">{hashtags}</p>
                        </div>
                    ) : (
                        <div className="flex flex-col items-center">
                            <img
                                src='/image-pre-prompting.png'
                                alt="AI-art"
                                className="max-w-full max-h-[75vh] rounded shadow-md"
                            />
                            <p className="text-sm text-gray-600 mt-2">{hashtags}</p>
                        </div>
                    )}
                </div>
                <textarea
                    className="w-full bg-zinc-700 border mt-5 border-zinc-500 overflow-visible resize-none placeholder-zinc-400 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-violet-500 transition"
                    placeholder="Enter a prompt"
                    value={prompt}
                    rows={4}
                    onChange={(e) => setPrompt(e.target.value)}
                />

                <button
                    onClick={genImage}
                    className="mt-3 px-4 py-2 bg-violet-500 text-zinc-100 hover:bg-violet-600 transition rounded"
                >
                    Generate image
                </button>
            </div>
        </div>
    );
}
export default ImageGen;




