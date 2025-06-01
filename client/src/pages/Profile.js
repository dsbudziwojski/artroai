import {useEffect, useState} from 'react';
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import FollowerPopup from '../components/FollowerPopup';
import Navbar from "../components/Navbar";
import { getIdToken } from "firebase/auth";
import {auth} from "../firebase";

function Profile() {
    const { username } = useParams();
    const [userData, setUserData] = useState(false);
    const [followers, setFollowers] = useState([]);
    const [following, setFollowing] = useState([]);
    const [posts, setPosts] = useState([]);
    const [followersPopup, setfollowersPopup] = useState(false)
    const [followingPopup, setfollowingPopup] = useState(false)
    const [imagePopup, setImagePopup] = useState(false)
    const [selectedImage, setSelectedImage] = useState(null)
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
    }, [username, auth.currentUser]);

    return (
        <div>
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
                        <button>Follow</button>
                        <br></br>
                        <button onClick={() => navigate(`/profile/edit/${username}`)}>Edit Profile</button>
                    </div>
                    <div>
                        <button onClick={() => setfollowersPopup(true)}>Followers</button>
                        <FollowerPopup trigger={followersPopup} setTrigger={setfollowersPopup}>
                            <h4>Profiles that follow @{username}: </h4>
                            <ul>
                                {followers.map((follower) => (
                                    <a href="">
                                        <li key={follower.following_id} onClick={() => navigate(`/profile/${follower.following_id}`)}>@{follower.following_id}</li>
                                    </a>
                                ))}
                            </ul>
                        </FollowerPopup>
                        <br></br>
                        <button onClick={() => setfollowingPopup(true)}>Following</button>
                        <FollowerPopup trigger={followingPopup} setTrigger={setfollowingPopup}>
                            <h4>Profiles that @{username} follows: </h4>
                            <ul>
                                {following.map((follow) => (
                                    <a href="">
                                        <li key={follow.user_id} onClick={() => navigate(`/profile/${follow.user_id}`)}>@{follow.user_id}</li>
                                    </a>
                                ))}
                            </ul>
                        </FollowerPopup>
                    </div>
                    <h3>Gallery: </h3>
                    <div className='flex justify-center m-10'>
                        {posts.map((img) => (
                            <div key={img.image_id} className='rounded-md p-4 w-124'>
                                <img src={img.path} alt={img.prompt} onClick={() => {
                                    setImagePopup(true);
                                    setSelectedImage(img);
                                }}>
                                </img>
                                {selectedImage?.image_id === img.image_id && (
                                    <FollowerPopup trigger={imagePopup} setTrigger={setImagePopup}>
                                        <p>Prompts: {img.prompt}</p>
                                        <p>Hashtags: {img.hashtags}</p>
                                        <p>Date Created: {img.date_created}</p>
                                    </FollowerPopup>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            ) : (
                <h1>Loading profile...</h1>
            )}
        </div>
    );
}

export default Profile;