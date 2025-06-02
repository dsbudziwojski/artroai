import React, {useState} from 'react';
import ImagePopup from '../components/ImagePopup';
import {useAuth} from '../AuthContext';
import { useSearchParams } from 'react-router-dom';

function ImageGen() {
    const { user } =useAuth();
    const [prompt, setPrompt]= useState("");
    const [imagePath, setImagePath]= useState("");
    const [hashtags, setHashtags] = useState("");
    const [showPopup, setShowPopup]=useState(false);
    const [loading, setLoading]=useState(false);

    const genImage = async () => {
        if (!user || (!user.displayName && !user.email)){
            return alert("Please sign in to generate image");
        }

        setLoading(true);
        setShowPopup(true);

        try {
            const res = await fetch('/api/generate-image', {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({
                    prompt,
                    created_by: user.displayName || user.email
                }),
            });

            const data = await res.json();
            if(!res.ok || !data.image){
                throw new Error(data.errorMsg || "Image generation failure");
            }

            console.log("Image path from backend:", data.image.path);
            console.log("Hashtags:", data.image.hashtags);

            const imageURL= `/api/generate-image/${data.image.path.split('/').pop()}`;
            setImagePath(imageURL);
            setHashtags(data.image.hashtags);
        } catch (error){
            alert("Failed to generate image: " + error.message);
            setImagePath("");
        } finally{
            setLoading(false);
        }
    };

    return(
        <div className="flex flex-col items-center">
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

            <ImagePopup trigger={showPopup} setTrigger={setShowPopup}>
                {loading ? (
                    <p className="text-center text-gray-600">Generating image...</p>
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
                    <p>Error loading image</p>

                )}
            </ImagePopup>
        </div>
    );
}
export default ImageGen;




