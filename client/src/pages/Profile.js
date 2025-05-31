import {useEffect, useState} from 'react';
import { useParams } from 'react-router-dom';
import FollowerPopup from '../components/FollowerPopup';

function Profile() {
    const { username } = useParams();
    const [userData, setUserData] = useState(false);
    const [followers, setFollowers] = useState();
    const [following, setFollowing] = useState();
    const [posts, setPosts] = useState();
    const [followersPopup, setfollowersPopup] = useState(false)
    const [followingPopup, setfollowingPopup] = useState(false)
    useEffect(() => {
        fetch(`/api/test/users/${username}`)
            .then(resp => resp.json())
            .then(data => {
                setUserData(data.profile);
                console.log(userData);
            })
        /* COMMENT OUT WHEN DUMMY DATA IS READY
        fetch(`/api/test/users/${username}/follower`)
            .then(resp => resp.json())
            .then(data => {
                setFollowers(data);
                console.log(followers);
            })
        fetch(`/api/test/users/${username}/following`)
            .then(resp => resp.json())
            .then(data => {
                setFollowing(data);
                console.log(following);
            })
        fetch(`/api/test/users/${username}/image`)
            .then(resp => resp.json())
            .then(data => {
                setPosts(data);
                console.log(posts);
            })
        */
    }, [username]);

    return (
        <div>
            {userData ? (
                <div>
                    <div>
                        <h1>This is {userData.first_name} {userData.last_name}'s profile</h1>
                        <h2>@{userData.username}</h2>
                        <p>Joined: {userData.date_created}</p>
                        <p>Admin: {userData.isadmin ? "Yes" : "No"}</p>
                        <p>Bio: {userData.bio}</p>
                    </div>
                    <div>
                        <button onClick={() => setfollowersPopup(true)}>Followers</button>
                        <FollowerPopup trigger={followersPopup} setTrigger={setfollowersPopup}>
                            <h4>Profiles that follow @{username}: </h4>
                            <p>{followers}</p>
                        </FollowerPopup>
                        <br></br>
                        <button onClick={() => setfollowingPopup(true)}>Following</button>
                        <FollowerPopup trigger={followingPopup} setTrigger={setfollowingPopup}>
                            <h4>Profiles that @{username} follows: </h4>
                            <p>{following}</p>
                        </FollowerPopup>
                    </div>
                    <div>
                        <h3>Posts: {posts}</h3>
                    </div>
                </div>
            ) : (
                <h1>Loading profile...</h1>
            )}
        </div>
    );
}

export default Profile;