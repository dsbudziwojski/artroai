import { useParams } from "react-router-dom";
import { useNavigate } from 'react-router-dom';
import { getIdToken } from "firebase/auth";
import { useState } from "react";
import { useEffect } from "react";
import {auth} from "../firebase";

function EditProfile() {
    const { username } = useParams();
    const [firstName, setFirstName] = useState(null);
    const [lastName, setLastName] = useState(null);
    const [bio, setBio] = useState(null);
    const [displayFirstName, setDisplayFirstName] = useState(null);
    const [dispalyLastName, setDisplayLastName] = useState(null);
    const [displayBio, setDisplayBio] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        async function fetchProfileData() {
            if (!auth.currentUser ){
                return;
            }
            const idToken = await getIdToken(auth.currentUser, false);
            const headers = {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${idToken}`,
            };
            const response = await fetch(`/api/users/${username}`, {
                method: 'GET',
                headers: headers,
            });
            if (response.ok) {
                const data = await response.json();
                setDisplayFirstName(data.profile.first_name || "");
                setDisplayLastName(data.profile.last_name || "");
                setDisplayBio(data.profile.bio || "");
            }
        }
        fetchProfileData();
    }, [username]);

    const handleProfileUpdate = async (firstName, lastName, bio) => {
        if (!auth.currentUser){
            return
        }
        const idToken = await getIdToken(auth.currentUser, false);
        const headers = {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${idToken}`
        }
        const data = {
            first_name: firstName,
            last_name: lastName,
            bio: bio
          };
        const response = await fetch(`/api/users/${username}`, {
            method: 'PATCH',
            headers: headers,
            body: JSON.stringify(data)
        });
        if (response.ok) {
            const result = await response.json();
            console.log("Profile updated:", result);
        }
    };

    return (
        <div>
            <div>
                <h1>Edit Profile:</h1>
                <input type="text" placeholder="First Name" value={displayFirstName} onChange={(e) => {setFirstName(e.target.value); setDisplayFirstName(e.target.value)}}/>
                <input type="text" placeholder="Last Name" value={dispalyLastName} onChange={(e) => {setLastName(e.target.value); setDisplayLastName(e.target.value)}}/>
                <input type="text" placeholder="Bio Name" value={displayBio} onChange={(e) => {setBio(e.target.value); setDisplayBio(e.target.value)}}/>
            </div>
            <div>
                <button onClick={() => handleProfileUpdate(firstName, lastName, bio)}>Save Changes</button>
                <br></br>
                <button onClick={() => navigate(`/profile/${username}`)}>Done</button>
            </div>
        </div>
    );
}

export default EditProfile;