import {useEffect, useState} from 'react';
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';
import FollowerPopup from '../components/FollowerPopup';
import ImagePopup from '../components/ImagePopup';
import Navbar from "../components/Navbar";
import { getIdToken } from "firebase/auth";
import {auth} from "../firebase";

function Profile() {
    const { username } = useParams();
    const currentUser = useAuth();
    const [userData, setUserData] = useState(false);
    const [followers, setFollowers] = useState([]);
    const [following, setFollowing] = useState([]);
    const [posts, setPosts] = useState([]);
    const [followersPopup, setfollowersPopup] = useState(false);
    const [followingPopup, setfollowingPopup] = useState(false);
    const [imagePopup, setImagePopup] = useState(false);
    const [selectedImage, setSelectedImage] = useState(null);
    const [isFollowing, setIsFollowing] = useState(null);
    const navigate = useNavigate(); 
    useEffect(() => {
        async function getData(){
            if (!auth.currentUser) {
                return;
            }
            const idToken =  await getIdToken(auth.currentUser, false)
            const headers = {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${idToken}`
            }

            await fetch(`/api/users/${username}`,{method: 'GET', headers: headers})
                .then(resp => resp.json())
                .then(data => {
                    setUserData(data.profile);
                })
            await fetch(`/api/users/${username}/followers`, {method: 'GET', headers: headers})
                .then(resp => resp.json())
                .then(data => {
                    setFollowers(data.followers);
                })
            await fetch(`/api/users/${username}/following`, {method: 'GET', headers: headers})
                .then(resp => resp.json())
                .then(data => {
                    setFollowing(data.following);
                })
            await fetch(`/api/users/${username}/images`, {method: 'GET', headers: headers})
                .then(resp => resp.json())
                .then(data => {
                    setPosts(data.images);
                })
        }
        void getData()
    }, [username]);

    useEffect(() => {
        if (following.length > 0 && currentUser) {
            setIsFollowing(following.some(follower => follower.user_id === currentUser));
        }
    }, [following, currentUser]);

    const handleFollow = async () => {
        if (!auth.currentUser) {
            return;
        }
        const idToken =  await getIdToken(auth.currentUser, false)
        const headers = {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${idToken}`
        }
        const response = await fetch(`/api/users/${currentUser}/follow-other`, {
            method: 'POST',
            headers: headers,
            body: JSON.stringify({
                following_id: username,
            }),
        });
    
        if (response.ok) {
            setIsFollowing(true);
            setFollowing(prev => [...prev, { user_id: currentUser, following_id: username }]);
        }
        console.log("Follow clicked. currentUser:", currentUser, "following_id (username):", username);
    }

    const handleUnfollow = async () => {
        if (!auth.currentUser) {
            return;
        }
        const idToken =  await getIdToken(auth.currentUser, false)
        const headers = {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${idToken}`
        }
        const response = await fetch(`/api/users/${currentUser}/unfollow-other`, {
            method: 'POST',
            headers: headers,
            body: JSON.stringify({
                following_id: username,
            }),
        });
    
        if (response.ok) {
            setIsFollowing(false);
            setFollowers(prev => prev.filter(f => f.following_id !== username));
        }
    }

    return (
        <div className="bg-zinc-900 min-h-screen">
            <Navbar/>
            {userData ? (
                <div>
                    <div>
                        <h1>{userData.first_name} {userData.last_name}'s profile</h1>
                        <h2>@{userData.username}</h2>
                        <p>Joined: {userData.date_created}</p>
                        <p>Admin: {userData.isadmin ? "Yes" : "No"}</p>
                        <p>Bio: {userData.bio}</p>
                    </div>
                    <div>
                        {currentUser === username ? (
                            <button onClick={() => navigate(`/profile/edit/${username}`)}>Edit Profile</button>
                        ) : isFollowing ? (
                            <a href="">
                                <button onClick={handleUnfollow}>Unfollow</button>
                            </a>
                        ) : (
                            <a href="">
                                <button onClick={handleFollow}>Follow</button>
                            </a>
                        )}
                    </div>
                    <div>
                        <button onClick={() => setfollowersPopup(true)}>Followers</button>
                        <FollowerPopup trigger={followersPopup} setTrigger={setfollowersPopup}>
                            <h4>Profiles that follow @{username}: </h4>
                            <ul>
                                {following.map((follower) => (
                                    <a href="">
                                        <li key={follower.user_id} onClick={() => {
                                            navigate(`/profile/${follower.user_id}`)
                                            setfollowersPopup(false)
                                            }}>
                                                @{follower.user_id}
                                        </li>
                                    </a>
                                ))}
                            </ul>
                        </FollowerPopup>
                        <br></br>
                        <button onClick={() => setfollowingPopup(true)}>Following</button>
                        <FollowerPopup trigger={followingPopup} setTrigger={setfollowingPopup}>
                            <h4>Profiles that @{username} follows: </h4>
                            <ul>
                                {followers.map((follow) => (
                                    <a href="">
                                        <li key={follow.following_id} onClick={() => {
                                            navigate(`/profile/${follow.following_id}`)
                                            setfollowingPopup(false)
                                            }}>
                                                @{follow.following_id}
                                        </li>
                                    </a>
                                ))}
                            </ul>
                        </FollowerPopup>
                    </div>
                    <div className="flex justify-center">
                        <h3>Gallery: </h3>
                        <div className="flex justify-center flex-wrap mx-5 my-10">
                            {posts.map((img) => (
                                <div key={img.image_id} className="rounded-xl ">
                                    <div className='m-5 w-96 shadow-lg cursor-pointer hover:scale-105'>
                                        <img
                                            src={img.path}
                                            alt={img.prompt}
                                            onClick={() => {
                                                setImagePopup(true);
                                                setSelectedImage(img);}}
                                            className="w-full h-auto"
                                        >
                                        </img>
                                    </div>
                                    <div className="relative">
                                        {selectedImage?.image_id === img.image_id && (
                                            <ImagePopup trigger={imagePopup} setTrigger={setImagePopup}>
                                                <p>Prompts: {img.prompt}</p>
                                                <p>Hashtags: {img.hashtags}</p>
                                                <p>Date Created: {img.date_created}</p>
                                            </ImagePopup>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            ) : (
                <h1>Loading profile...</h1>
            )}
        </div>
    );
}

export default Profile;