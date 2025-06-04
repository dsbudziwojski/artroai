import { use, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DailyPopup from '../components/DailyPopup';
import Navbar from "../components/Navbar";
import { useAuth } from '../AuthContext';
import {auth} from "../firebase";
import {getIdToken} from "firebase/auth";


function Home() {
    // used to navigate between pages
    const navigate = useNavigate();

    // used for timed popup
    const [timedPopup, setTimedPopup] = useState(false);
    // tracks the current feed type (public/private)
    // "Private" by default
    const [feedType, setFeedType] = useState("Private");

    // posts to be displayed in the feed
    const [posts, setPosts] = useState([]);

    // posts to be displayed after filtering
    const [displayedPosts, setDisplayedPosts] = useState([]);
    const [visiblePostCount, setVisiblePostCount] = useState(3);

    const { user: myUsername } = useAuth();

    // handle switch from public and private feed
    function handleFeedSwitch(type) {
        setFeedType(type);
    }

    const handleLoadMorePosts = () => {
        setVisiblePostCount(prev => prev + 3);
    };

    useEffect(() => {
        // attempt fetch posts from backend based on feedType
        // if fetch fails, fallback to mock data
        async function fetchPosts() {
            try {

                if (feedType === "Public") {
                    if (!auth.currentUser) {
                        return;
                    }
                    const idToken =  await getIdToken(auth.currentUser, false)
                    const headers = {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${idToken}`
                    }
                    await fetch(`/api/users/${myUsername}/publicImages`,{method: 'GET', headers: headers})
                        .then(resp => resp.json())
                        .then(data => {
                            setPosts(data.images);
                            setDisplayedPosts(data.images);
                        })
                        .catch((err) => {
                            console.log(err)
                        });


                } else if (feedType === "Private") {
                    if (!auth.currentUser) {
                        return;
                    }
                    const idToken =  await getIdToken(auth.currentUser, false)
                    const headers = {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${idToken}`
                    }
                    await fetch(`/api/users/${myUsername}/followingImages`,{method: 'GET', headers: headers})
                        .then(resp => resp.json())
                        .then(data => {
                            setPosts(data.images);
                            setDisplayedPosts(data.images);
                        })
                        .catch((err) => {
                            console.log(err)
                        });

                }
            } catch (err) {
                console.log(err)
            }
        }

        void fetchPosts();
    }, [feedType]);

    // popup timer which only activates once per page access
    useEffect(() => {
        setTimeout(() => {
            setTimedPopup(true);
        }, 5000);
    }, []);

    let visiblePosts
    if (displayedPosts) {
        visiblePosts = displayedPosts.slice(0, visiblePostCount);
    }
    return (
        <div className="bg-zinc-900 min-h-screen"> {/* bg-zinc-900*/}
            <DailyPopup trigger={timedPopup} setTrigger={setTimedPopup}>
                <div className="text-sm text-zinc-300">
                    <h3>Hey {myUsername}!</h3>
                    <p>Make sure to generate your daily post!</p>
                </div>
            </DailyPopup>
            <Navbar />
            <div className="pt-20 h-full flex overflow-auto bg-zinc-900">
                <div className="text-zinc-100 justify-center w-full">
                    {/* toggle public and private feeds */}
                    <div className="bg-zinc-800 mx-10 my-5 rounded-md">
                        <nav className="p-3 flex text-zinc-100 justify-center rounded-md">
                            <button
                                className={`
                                px-4 py-2
                                ${feedType === "Public" ? "text-zinc-100 rounded-md hover:bg-zinc-100 hover:text-zinc-700 transition" : "text-zinc-500 rounded-md hover:bg-zinc-100 hover:text-zinc-700 transition"}
                                `}
                                onClick={() => handleFeedSwitch("Public")}>
                                Public Feed
                            </button>
                            <button
                                className={`
                                px-4 py-2
                                ${feedType === "Private" ? "text-zinc-100 rounded-md hover:bg-zinc-100 hover:text-zinc-700 transition" : "text-zinc-500 rounded-md hover:bg-zinc-100 hover:text-zinc-700 transition"}
                                `}
                                onClick={() => handleFeedSwitch("Private")}>
                                Following Feed
                            </button>
                        </nav>
                    </div>
                    {/* scrollable container containing posts */}
                    <div>
                        {Array.isArray(posts) && posts.length > 0 ?
                            <div>
                                {visiblePosts.map((post) => (
                                    <div
                                        className="bg-zinc-800 mx-10 my-5 p-10 flex-col rounded-md"
                                        key={post.photo_id}
                                    >
                                        <img
                                            className="w-full p-10"
                                            src={post.path}
                                            alt="post_img"
                                        />
                                        <p><strong>Prompt:</strong> {post.prompt}</p>
                                        {/* post: click user profile name to go to profile */}
                                        <p>
                                            <strong>By:</strong>
                                            <button
                                                onClick={() => navigate(`/profile/${post.created_by}`)}
                                                className="ml-2 underline text-violet-400 hover:text-violet-200"
                                            >
                                                {post.created_by}
                                            </button>
                                        </p>
                                        <p><strong>Tags:</strong> {post.hashtags}</p>
                                        <p style={{ fontSize: "0.8rem", color: "gray" }}>{post.date_created.split('T')[0]}</p>
                                    </div>
                                ))}
                                {visiblePostCount < displayedPosts.length && (
                                    <button
                                        onClick={handleLoadMorePosts}
                                        className="bg-zinc-800 mx-10 mb-5 hover:bg-violet-500 text-zinc-100 py-2 px-4 rounded-lg"
                                    >
                                        Load More Posts
                                    </button>
                                )}
                            </div>
                            :
                                <div className="bg-zinc-800 mx-10 my-5 p-10 flex-col rounded-md">
                                    {feedType === "Private" ?
                                        <div className="flex justify-center">
                                            <button
                                                className="bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg"
                                                onClick={()=> {navigate("/search")}}
                                            >
                                                <h2>Find Others</h2>
                                            </button>
                                        </div>
                                        :
                                        <div className="text-zinc-400 py-2 px-4 flex justify-center">
                                                <h1>No Posts</h1>
                                        </div>
                                    }
                                </div>
                            }
                    </div>
                </div>
            </div>
        </div>
    );
}
export default Home;