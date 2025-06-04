import {useEffect, useState} from 'react';
import { useParams } from 'react-router-dom';
import { useNavigate, NavLink } from 'react-router-dom';
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
    const { user: currentUser } = useAuth();

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
    const [justFollowed, setJustFollowed] = useState(false);
    const [justUnfollowed, setJustUnfollowed] = useState(false);

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

    const [timer, setTimer] = useState(false);
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
        else if (following.length > 0 && currentUser) {
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
            setJustUnfollowed(true);
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
            setJustFollowed(true);
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
    }, [followerCount, 
        followingCount, 
        followersPopup, 
        followingPopup, 
        editProfilePopup,
        following,
        followers,
        firstName,
        lastName,
        bio]);

    useEffect(() => {
        if (justFollowed) {
            setAddedFollowersPopup(true);
            setJustFollowed(false);
        }
    }, [justFollowed]);
    
    useEffect(() => {
        if (justUnfollowed) {
            setRemovedFollowersPopup(true);
            setJustUnfollowed(false);
        }
    }, [justUnfollowed]);

    useEffect(() => {
        setTimeout(() => {
            setTimer(true);
        }, 10000);
    }, []);

    return (
        <div className="bg-zinc-900 min-h-screen text-zinc-300 pt-20">
            <Navbar/>
            {userData ? (
                <div>
                    <div>
                        <div  className="flex justify-center">
                            <div className="w-[1200px] h-max mt-5 p-4 bg-zinc-800 rounded-xl shadow-sm flex items-center space-x-4">
                                <div className="w-80 m-5 rounded-full overflow-hidden border-2 border-violet-400">
                                    <img
                                        src={userData.profile_image_path}
                                        alt="Profile"
                                        className="w-full h-full "
                                    />
                                </div>
                                <div className="text-sm text-zinc-400">
                                    <div className="flex items-center">
                                        <h1 className="text-lg font-semibold text-violet-400 pr-2">
                                            {firstName} {lastName}
                                        </h1>
                                        <div className="px-2">
                                            <button onClick={() => setFollowersPopup(true)}>Followers</button>: {displayFollowerCount}
                                            <FollowerPopup trigger={followersPopup} setTrigger={setFollowersPopup}>
                                                <h4 className="pb-1 text-zinc-300 font-medium">Profiles that follow @{username}: </h4>
                                                {Array.isArray(displayFollowing) ? (
                                                    <ul>
                                                        {displayFollowing.map((follower) => (
                                                            <li key={follower.user_id}>
                                                                <a href={`/profile/${follower.user_id}`}>
                                                                    <button className="text-violet-500 hover:text-violet-300 transition underline underline-offset-2" onClick={() => {navigate(`/profile/${follower.user_id}`); setFollowersPopup(false)}}>
                                                                        @{follower.user_id}
                                                                    </button>
                                                                </a>
                                                            </li>
                                                        ))}
                                                    </ul>
                                                ) : (
                                                    <p>No users found.</p>
                                                )}
                                            </FollowerPopup>
                                        </div>
                                        <div className="px-2">
                                            <button onClick={() => setFollowingPopup(true)}>Following</button>: {displayFollowingCount}
                                            <FollowerPopup trigger={followingPopup} setTrigger={setFollowingPopup}>
                                                <h4 className="pb-1 text-zinc-300 font-medium">Profiles that @{username} follows: </h4>
                                                {Array.isArray(displayFollowing) ? (
                                                    <ul>
                                                        {displayFollowers.map((follow) => (
                                                            <li key={follow.following_id}>
                                                                <a href={`/profile/${follow.following_id}`}>
                                                                    <button className="text-violet-500 hover:text-violet-300 transition underline underline-offset-2" onClick={() => {navigate(`/profile/${follow.following_id}`); setFollowingPopup(false)}}>
                                                                        @{follow.following_id}
                                                                    </button>
                                                                </a>
                                                            </li>
                                                        ))}
                                                    </ul>
                                                ) : (
                                                    <p>No users found.</p>
                                                )}
                                            </FollowerPopup>
                                        </div>
                                    </div>
                                    <div className="flex space-x-4">
                                        <h2 className="text-zinc-500">@{userData.username}</h2>
                                        {currentUser !== username && (
                                            <div className="ml-2">
                                                {isFollowing ? (
                                                    <div>
                                                        <button className="text-zinc-500 rounded-md hover:text-zinc-50 transition" onClick={handleUnfollow}>Unfollow</button>
                                                        <AddedFollowerPopup trigger={removedFollowersPopup} setTrigger={setRemovedFollowersPopup}>
                                                            <p className="top-1 left-2 px-2 py-0 text-opacity-80 text-zinc-100">Added @{username}</p>
                                                        </AddedFollowerPopup>
                                                    </div>
                                                ) : (
                                                    <div>
                                                        <button className="text-zinc-500 rounded-md hover:text-zinc-50 transition" onClick={handleFollow}>Follow</button>
                                                        <AddedFollowerPopup trigger={addedFollowersPopup} setTrigger={setAddedFollowersPopup}>
                                                            <p className="top-1 left-2 px-2 py-0 text-opacity-80 text-zinc-100">Removed @{username}</p>
                                                        </AddedFollowerPopup>
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                    <p><span className="font-medium text-zinc-600">Joined:</span> {userData.date_created.split('T')[0]}</p>
                                    <p><span className="font-medium text-zinc-600">Admin:</span> {userData.isadmin ? "Yes" : "No"}</p>
                                    <p><span className="font-medium text-zinc-600">Bio:</span> {bio}</p>
                                    <div>
                                        {currentUser === username && (
                                            <div>
                                                <button
                                                    className="font-medium text-zinc-500 rounded-md hover:text-zinc-50 transition"
                                                    onClick={() => setEditProfilePopup(true)}
                                                >Edit Profile</button>
                                                <EditProfilePopup trigger={editProfilePopup} setTrigger={setEditProfilePopup}>
                                                    <div>
                                                        <h1 className="font-medium text-zinc-400">Edit Profile:</h1>
                                                        <div className="mt-4">
                                                            <input className="w-60 border border-zinc-500 bg-zinc-700 text-zinc-300 rounded-md px-2 py-2 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-violet-500 transition" type="text" placeholder="First Name" value={displayFirstName} onChange={(e) => {setDisplayFirstName(e.target.value)}}/>
                                                            <input className="w-60 ml-8 border border-zinc-500 bg-zinc-700 text-zinc-300 rounded-md px-2 py-2 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-violet-500 transition" type="text" placeholder="Last Name" value={displayLastName} onChange={(e) => {setDisplayLastName(e.target.value)}}/>
                                                        </div>
                                                        <div className="mt-4 mb-4">
                                                            <textarea className="w-full h-64 overflow-visible resize-none border border-zinc-500 bg-zinc-700 text-zinc-300 rounded-md px-2 py-2 overflow-visible focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-violet-500 transition" type="text" placeholder="Bio" value={displayBio} onChange={(e) => {setDisplayBio(e.target.value)}}/>
                                                        </div>
                                                        <button className="ml-32 px-2 py-1 text-zinc-100 bg-green-600 hover:bg-green-700 font-bold rounded transition" onClick={() => {handleProfileUpdate(displayFirstName, displayLastName, displayBio); setEditProfilePopup(false)}}>Save Changes</button>
                                                    </div>
                                                </EditProfilePopup>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="flex justify-center">
                        <div className="w-[1200px] h-max m-6 p-4 bg-zinc-800 rounded-xl shadow-sm space-x-4">
                            <div className="flex flex-col">
                                <div className="flex justify-center text-zinc-300 text-lg pt-5">
                                    <h3>Gallery</h3>
                                </div>
                                {Array.isArray(posts) ? (
                                    <div className="flex justify-center flex-wrap mx-5 my-5">
                                        {posts.map((img) => (
                                            <div key={img.image_id} className="rounded-xl ">
                                                <div className='m-5 w-80 shadow-lg cursor-pointer hover:scale-105'>
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
                                                            <p className="text-sm text-zinc-300"><span className="font-medium text-zinc-400">Prompts: </span>{img.prompt}</p>
                                                            <p className="text-sm text-zinc-300"><span className="font-medium text-zinc-400">Hashtags: </span>{img.hashtags}</p>
                                                            <p className="text-sm text-zinc-300"><span className="font-medium text-zinc-400">Date Created: </span>{img.date_created.split('T')[0]}</p>
                                                        </ImagePopup>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p>No posts found.</p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="bg-zinc-900 h-screen flex justify-center items-center">
                    <div className="bg-zinc-800 p-10 rounded-lg text-center flex flex-col gap-2 w-96">
                        {timer ? (
                            <div>
                                <h1 className="text-2xl text-white mb-2 p-1">Make sure you are logged in</h1>
                                <NavLink to={"/"} className="text-violet-400 text-sm mt-4 hover:text-violet-300 transition">Go back to Login Page →</NavLink>
                            </div>
                        ) : (
                            <div>
                                <h1 className="text-2xl text-white mb-2 p-1">Loading Profile...</h1>
                                <NavLink to={"/home"} className="text-violet-400 text-sm mt-4 hover:text-violet-300 transition">Go back to Home Page →</NavLink>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}

export default Profile;