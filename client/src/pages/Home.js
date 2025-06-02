import { use, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DailyPopup from '../components/DailyPopup';
import Navbar from "../components/Navbar";
import { useAuth } from '../AuthContext';
import { useOutletContext } from 'react-router-dom';
import { filterPosts } from "../utils/searchFilter"
import {auth} from "../firebase";
import {getIdToken} from "firebase/auth";

/* \/\/\/\/\/\/\/\/\/\/\/\/\/\*MOCK DATA  as fallback \/\/\/\/\/\/\/\/\/\/\/\/\/\**/
const mockPublicFeed = [
    {
        photo_id: 1,
        path: "https://thebutlercollegian.com/wp-content/uploads/2019/11/Short-people.jpg",
        prompt: "NO ACCESS TO BACKEND. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
        hashtags: "#cats #no #legs",
        created_by: "bob",
        date_created: "2024",
    },
    {
        photo_id: 2,
        path: "https://thebutlercollegian.com/wp-content/uploads/2019/11/Short-people.jpg",
        prompt: "NO ACCESS TO BACKEND. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
        hashtags: "#cats #yes #legs",
        created_by: "lucy",
        date_created: "2024",
    },
    {
        photo_id: 3,
        path: "https://thebutlercollegian.com/wp-content/uploads/2019/11/Short-people.jpg",
        prompt: "NO ACCESS TO BACKEND. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
        hashtags: "#cats #yes #legs",
        created_by: "lucy",
        date_created: "2024",
    },
    {
        photo_id: 4,
        path: "https://thebutlercollegian.com/wp-content/uploads/2019/11/Short-people.jpg",
        prompt: "NO ACCESS TO BACKEND. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
        hashtags: "#cats #yes #legs",
        created_by: "lucy",
        date_created: "2024",
    },
    {
        photo_id: 5,
        path: "https://thebutlercollegian.com/wp-content/uploads/2019/11/Short-people.jpg",
        prompt: "NO ACCESS TO BACKEND. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
        hashtags: "#cats #yes #legs",
        created_by: "lucy",
        date_created: "2024",
    },
    {
        photo_id: 6,
        path: "https://thebutlercollegian.com/wp-content/uploads/2019/11/Short-people.jpg",
        prompt: "NO ACCESS TO BACKEND. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
        hashtags: "#cats #yes #legs",
        created_by: "lucy",
        date_created: "2024",
    },
];

const mockPrivateFeed = [
    {
        photo_id: 1,
        path: "data:image/png;base64,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",
        prompt: "NO ACCESS TO BACKEND. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
        hashtags: "#cats #yes #legs",
        created_by: "bob",
        date_created: "2024",
    },
    {
        photo_id: "102",
        path: "/images/private.jpg",
        prompt: "NO ACCESS TO BACKEND. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
        created_by: "laa",
        hashtags: "#legs #trees",
        date_created: "2024-06-04"
    }
];
/* \/\/\/\/\/\/\/\/\/\/\/\/\/\*MOCK DATA  as fallback \/\/\/\/\/\/\/\/\/\/\/\/\/\**/

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


    const myUsername = useAuth();

    // handle switch from public and private feed
    function handleFeedSwitch(type) {
        setFeedType(type);
    }

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
                            setPosts(mockPublicFeed);
                            setDisplayedPosts(mockPublicFeed);
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
                            setPosts(mockPrivateFeed);
                            setDisplayedPosts(mockPrivateFeed);
                        });

                }
            } catch (err) {
                setPosts(feedType === "Public" ? mockPublicFeed : mockPrivateFeed);

                setDisplayedPosts(feedType === "Public" ? mockPublicFeed : mockPrivateFeed);

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

    // move to search
    /*useEffect(() => {
        // filter posts based on search query
        const filtered = filterPosts(posts, searchQuery);
        setDisplayedPosts(filtered);
    }, [searchQuery, posts]);*/

    // Handler for loading more posts

    // Only show up to visibleCount posts
    //const visiblePosts = displayedPosts


    return (
        <div className="bg-zinc-900 min-h-screen"> {/* bg-zinc-900*/}
            <DailyPopup trigger={timedPopup} setTrigger={setTimedPopup}>
                <h3>Hey {myUsername}!</h3>
                <p>Make sure to generate your daily post! Your current streak is: </p>
            </DailyPopup>
            <Navbar />
            <div className="pt-20 h-full flex overflow-auto bg-zinc-900">
                <div className="text-zinc-100 justify-center">
                    {/* toggle public and private feeds */}
                    <div className="bg-zinc-800 mx-10 my-5 rounded-md">
                        <nav className="p-3 flex text-zinc-100 justify-center rounded-md">
                            <button
                                className={`
                                px-3 py-2
                                ${feedType === "Public" ? "text-zinc-100" : "text-zinc-500"}
                                `}
                                onClick={() => handleFeedSwitch("Public")}>
                                Public Feed
                            </button>
                            <button
                                className={`
                                px-3 py-2
                                ${feedType === "Private" ? "text-zinc-100" : "text-zinc-500"}
                                `}
                                onClick={() => handleFeedSwitch("Private")}>
                                Private Feed
                            </button>
                        </nav>
                    </div>
                    {/* scrollable container containing posts */}
                    <div className="">
                        {/* maps over all posts & render post details */}
                        {posts.map((post) => (
                            <div
                                className="bg-zinc-800 mx-10 my-5 p-10 flex-col rounded-md"
                                key={post.photo_id}
                            >
                                <img
                                    className="w-full h-auto p-10"
                                    src={post.path}
                                    alt="post_img"
                                />
                                <p><strong>Prompt:</strong> {post.prompt}</p>
                                <p><strong>By:</strong> {post.created_by}</p>
                                <p><strong>Tags:</strong> {post.hashtags}</p>
                                <p style={{ fontSize: "0.8rem", color: "gray" }}>{post.date_created}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Load More button Formatting needed
                {visibleCount < displayedPosts.length && (
                    <button onClick={handleLoadMore} style={{ marginTop: "1rem" }}>
                        Load More
                    </button>
                )}*/}

            </div>
        </div>
    );

    {
    }
}
export default Home;