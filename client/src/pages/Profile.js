import {useEffect, useState} from 'react';
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';
import FollowerPopup from '../components/FollowerPopup';
import ImagePopup from '../components/ImagePopup';
import EditProfilePopup from '../components/EditProfilePopup';
import AddedFollowerPopup from '../components/AddedFollowerPopup';
import Navbar from "../components/Navbar";
import { getIdToken } from "firebase/auth";
import {auth} from "../firebase";

function Profile() {
    const { username } = useParams();
    const currentUser = useAuth();

    const [userData, setUserData] = useState(false);
    const [followers, setFollowers] = useState([]);
    const [following, setFollowing] = useState([]);
    const [displayFollowers, setDisplayFollowers] = useState([]);
    const [displayFollowing, setDisplayFollowing] = useState([]);
    const [posts, setPosts] = useState([]);

    const [followersPopup, setFollowersPopup] = useState(false);
    const [followingPopup, setFollowingPopup] = useState(false);
    const [imagePopup, setImagePopup] = useState(false);
    const [editProfilePopup, setEditProfilePopup] = useState(false);
    const [addedFollowersPopup, setAddedFollowersPopup] = useState(false);
    const [removedFollowersPopup, setRemovedFollowersPopup] = useState(false);

    const [selectedImage, setSelectedImage] = useState(null);
    const [isFollowing, setIsFollowing] = useState(null);
    const [followerCount, setFollowerCount] = useState(null);
    const [followingCount, setFollowingCount] = useState(null);
    const [displayFollowerCount, setDisplayFollowerCount] = useState(null);
    const [displayFollowingCount, setDisplayFollowingCount] = useState(null);

    const [firstName, setFirstName] = useState(null);
    const [lastName, setLastName] = useState(null);
    const [bio, setBio] = useState(null);
    const [displayFirstName, setDisplayFirstName] = useState(null);
    const [displayLastName, setDisplayLastName] = useState(null);
    const [displayBio, setDisplayBio] = useState(null);
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
                    setDisplayFollowers(data.followers);
                    setFollowingCount(data.count);
                    setDisplayFollowingCount(data.count);
                })
            await fetch(`/api/users/${username}/following`, {method: 'GET', headers: headers})
                .then(resp => resp.json())
                .then(data => {
                    setFollowing(data.following);
                    setDisplayFollowing(data.following);
                    setFollowerCount(data.count);
                    setDisplayFollowerCount(data.count);
                })
            await fetch(`/api/users/${username}/images`, {method: 'GET', headers: headers})
                .then(resp => resp.json())
                .then(data => {
                    setPosts(data.images);
                })
        }
        void getData()
    }, [username, isFollowing]);

    useEffect(() => {
        if(following === undefined){
            console.error("You have no profile");
        }
        if (following.length > 0 && currentUser) {
            setIsFollowing(following.some(follower => follower.user_id === currentUser));
        }
    }, [following, followers, currentUser]);

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
            setFollowerCount(followerCount+1);
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
            setFollowerCount(followerCount-1);
        }
    }

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
                setFirstName(data.profile.first_name || "");
                setLastName(data.profile.last_name || "");
                setBio(data.profile.bio || "");
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
        setFirstName(firstName);
        setLastName(lastName);
        setBio(bio);
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

    useEffect(() => {
        if (editProfilePopup) {
            setDisplayFirstName(firstName);
            setDisplayLastName(lastName);
            setDisplayBio(bio);
        }
        setDisplayFollowerCount(followerCount);
        setDisplayFollowingCount(followingCount);
        if(followersPopup){
            setDisplayFollowing(following);
        }
        if(followingPopup){
            setDisplayFollowers(followers);
        }
    }, [editProfilePopup, isFollowing, followersPopup, followingPopup]);

    return (
        <div className="bg-zinc-900 min-h-screen text-zinc-300">
            <Navbar/>
            {userData ? (
                <div>
                    <div>
                        <h1>{firstName} {lastName}'s profile</h1>
                        <h2>@{userData.username}</h2>
                        <p>Joined: {userData.date_created}</p>
                        <p>Admin: {userData.isadmin ? "Yes" : "No"}</p>
                        <p>Bio: {bio}</p>
                        {currentUser === username ? (
                            <div>
                                <button onClick={() => setEditProfilePopup(true)}>Edit Profile</button>
                                <EditProfilePopup trigger={editProfilePopup} setTrigger={setEditProfilePopup}>
                                    <div>
                                        <h1>Edit Profile:</h1>
                                        <input type="text" placeholder="First Name" value={displayFirstName} onChange={(e) => {setDisplayFirstName(e.target.value)}}/>
                                        <input type="text" placeholder="Last Name" value={displayLastName} onChange={(e) => {setDisplayLastName(e.target.value)}}/>
                                        <input type="text" placeholder="Bio Name" value={displayBio} onChange={(e) => {setDisplayBio(e.target.value)}}/>
                                        <br></br>
                                        <button onClick={() => {handleProfileUpdate(displayFirstName, displayLastName, displayBio); setEditProfilePopup(false)}}>Save Changes</button>
                                    </div>
                                </EditProfilePopup>
                            </div>
                        ) : isFollowing ? (
                            <div>
                                <button onClick={async () => {await handleUnfollow(); await setRemovedFollowersPopup(true)}}>Unfollow</button>
                                <AddedFollowerPopup trigger={removedFollowersPopup} setTrigger={setRemovedFollowersPopup}>
                                    <p>Added @{username}</p>
                                </AddedFollowerPopup>
                            </div>
                        ) : (
                            <div>
                                <button onClick={async () => {await handleFollow(); await setAddedFollowersPopup(true)}}>Follow</button>
                                <AddedFollowerPopup trigger={addedFollowersPopup} setTrigger={setAddedFollowersPopup}>
                                    <p>Removed @{username}</p>
                                </AddedFollowerPopup>
                            </div>
                        )}
                    </div>
                    <div>
                        <div>
                            <button onClick={() => setFollowersPopup(true)}>Followers</button>: {displayFollowerCount}
                            <FollowerPopup trigger={followersPopup} setTrigger={setFollowersPopup}>
                                <h4>Profiles that follow @{username}: </h4>
                                <ul>
                                    {displayFollowing.map((follower) => (
                                        <li key={follower.user_id}>
                                            <a href={`/profile/${follower.user_id}`}>
                                                <button onClick={() => {navigate(`/profile/${follower.user_id}`); setFollowersPopup(false)}}>
                                                    @{follower.user_id}
                                                </button>
                                            </a>
                                        </li>
                                    ))}
                                </ul>
                            </FollowerPopup>
                        </div>
                        <div>
                            <button onClick={() => setFollowingPopup(true)}>Following</button>: {displayFollowingCount}
                            <FollowerPopup trigger={followingPopup} setTrigger={setFollowingPopup}>
                                <h4>Profiles that @{username} follows: </h4>
                                <ul>
                                    {displayFollowers.map((follow) => (
                                        <li key={follow.following_id}>
                                            <a href={`/profile/${follow.following_id}`}>
                                                <button onClick={() => {navigate(`/profile/${follow.following_id}`); setFollowingPopup(false)}}>
                                                    @{follow.following_id}
                                                </button>
                                            </a>
                                        </li>
                                    ))}
                                </ul>
                            </FollowerPopup>
                        </div>
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