import React, {useState, useEffect} from 'react';
import ImagePopup from '../components/ImagePopup';
import {useAuth} from '../AuthContext';
import { useSearchParams } from 'react-router-dom';
import Navbar from '../components/Navbar';

function ImageGen() {
    const user = useAuth();
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
            const res = await fetch('/api/generate-images', {
                method: "POST",
                headers: {"Content-Type": "application/json"},
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
        
        <div className="flex flex-col items-center pt-32">
            <Navbar/>
            <input 
                type="text"
                placeholder="Enter a prompt"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                className="p-2 rounded bg-gray-200 text-black w-72"
            />

            <button
                onClick={genImage}
                className="mt-3 px-4 py-2 bg-purple-600 text-white rounded"
            >
                Generate image
            </button>

            <div>
                {loading ? (
                    <p className="text-center text-gray-600">Generating image...</p>
                ) : error ? (
                    <p className="text-center text-gray-600">{error}</p>
                ) : imagePath ? (
                    <div className="flex flex-col items-center">
                        <img
                            src={imagePath}
                            alt="AI-art"
                            className="max-w-full max-h-[75vh] rounded shadow-md"
                        />
                        <p className="text-sm text-gray-600 mt-2">{hashtags}</p>
                    </div>
                ) : null}
            </div>
        </div>
    );
}
export default ImageGen;




