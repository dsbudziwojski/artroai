import { useEffect, useState } from 'react';
import { useOutletContext, useNavigate } from 'react-router-dom';
import { filterPosts } from "../utils/searchFilter";
import Navbar from "../components/Navbar";
import {auth} from "../firebase";
import {getIdToken} from "firebase/auth";

// Mock data for fallback
const mockUsers = [
    { user_id: "bob", username: "bob" },
    { user_id: "lucy", username: "lucy" },
    { user_id: "laa", username: "laa" },
    { user_id: "art_lover", username: "art_lover" },
    { user_id: "digital_creator", username: "digital_creator" },
    { user_id: "pixel_master", username: "pixel_master" },
    { user_id: "ai_artist", username: "ai_artist" },
    { user_id: "design_guru", username: "design_guru" },
    { user_id: "creative_soul", username: "creative_soul" },
    { user_id: "art_explorer", username: "art_explorer" },
    { user_id: "visual_poet", username: "visual_poet" },
    { user_id: "color_dreamer", username: "color_dreamer" },
    { user_id: "canvas_king", username: "canvas_king" },
    { user_id: "brush_strokes", username: "brush_strokes" },
    { user_id: "art_ninja", username: "art_ninja" },
    { user_id: "digital_dreamer", username: "digital_dreamer" },
    { user_id: "creative_mind", username: "creative_mind" },
    { user_id: "art_wizard", username: "art_wizard" },
    { user_id: "design_master", username: "design_master" },
    { user_id: "visual_artist", username: "visual_artist" },
    { user_id: "art_enthusiast", username: "art_enthusiast" },
    { user_id: "creative_spirit", username: "creative_spirit" },
    { user_id: "digital_artist", username: "digital_artist" }
];

/* \/\/\/\/\/\/\/\/\/\/\/\/\/\*MOCK DATA  as fallback \/\/\/\/\/\/\/\/\/\/\/\/\/\**/
const mockPosts = [
    {
        photo_id: 1,
        photo_location: "https://thebutlercollegian.com/wp-content/uploads/2019/11/Short-people.jpg",
        prompt: "NO ACCESS TO BACKEND. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
        hashtags: "#cats #no #legs",
        created_by: "bob",
        date_created: "1824-04-20",
    },
    {
        photo_id: 2,
        photo_location: "https://thebutlercollegian.com/wp-content/uploads/2019/11/Short-people.jpg",
        prompt: "NO ACCESS TO BACKEND. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
        hashtags: "#cats #yes #legs",
        created_by: "lucy",
        date_created: "1704-03-11",
    },
    {
        photo_id: 3,
        photo_location: "https://thebutlercollegian.com/wp-content/uploads/2019/11/Short-people.jpg",
        prompt: "NO ACCESS TO BACKEND. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
        hashtags: "#cats #yes #legs",
        created_by: "lucy",
        date_created: "1999-01-03",
    },
    {
        photo_id: 4,
        photo_location: "https://thebutlercollegian.com/wp-content/uploads/2019/11/Short-people.jpg",
        prompt: "NO ACCESS TO BACKEND. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
        hashtags: "#cats #yes #legs",
        created_by: "lucy",
        date_created: "2024-03-01",
    },
    {
        photo_id: 5,
        photo_location: "https://thebutlercollegian.com/wp-content/uploads/2019/11/Short-people.jpg",
        prompt: "NO ACCESS TO BACKEND. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
        hashtags: "#cats #no #legs",
        created_by: "lucy",
        date_created: "2025-03-02",
    },
    {
        photo_id: 6,
        photo_location: "https://thebutlercollegian.com/wp-content/uploads/2019/11/Short-people.jpg",
        prompt: "NO ACCESS TO BACKEND. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
        hashtags: "#cats #no #legs",
        created_by: "lucy",
        date_created: "2025-03-03",
    },
    {
        photo_id: 7,
        photo_location: "https://thebutlercollegian.com/wp-content/uploads/2019/11/Short-people.jpg",
        prompt: "A new year, a new post!",
        hashtags: "#newyear #2023",
        created_by: "art_lover",
        date_created: "2023-01-01"
    },
    {
        photo_id: 8,
        photo_location: "https://thebutlercollegian.com/wp-content/uploads/2019/11/Short-people.jpg",
        prompt: "Spring vibes.",
        hashtags: "#spring #flowers",
        created_by: "digital_creator",
        date_created: "2024-03-21"
    },
    {
        photo_id: 9,
        photo_location: "https://thebutlercollegian.com/wp-content/uploads/2019/11/Short-people.jpg",
        prompt: "Throwback to 2022.",
        hashtags: "#throwback #2022",
        created_by: "pixel_master",
        date_created: "2022-07-15"
    },
    {
        photo_id: 10,
        photo_location: "https://thebutlercollegian.com/wp-content/uploads/2019/11/Short-people.jpg",
        prompt: "Summer art session.",
        hashtags: "#summer #art #no",
        created_by: "ai_artist",
        date_created: "2025-05-11"
    },
    {
        photo_id: 11,
        photo_location: "https://thebutlercollegian.com/wp-content/uploads/2019/11/Short-people.jpg",
        prompt: "Just another day in 2021.",
        hashtags: "#2021 #oldie #no",
        created_by: "design_guru",
        date_created: "2021-01-05"
    },
    {
        photo_id: 12,
        photo_location: "https://thebutlercollegian.com/wp-content/uploads/2019/11/Short-people.jpg",
        prompt: "Mid-2024 update.",
        hashtags: "#update #2024",
        created_by: "creative_soul",
        date_created: "2024-06-10"
    }
];
/* \/\/\/\/\/\/\/\/\/\/\/\/\/\*MOCK DATA  as fallback \/\/\/\/\/\/\/\/\/\/\/\/\/\**/
function Search() {
    // local search state
    const [searchQuery, setSearchQuery] = useState('');

    // states for posts and users
    const [posts, setPosts] = useState([]);
    const [users, setUsers] = useState([]);
    const [displayedPosts, setDisplayedPosts] = useState([]);
    const [displayedUsers, setDisplayedUsers] = useState([]);

    // pagination states
    const [visiblePostCount, setVisiblePostCount] = useState(3);
    const [visibleUserCount, setVisibleUserCount] = useState(10);

    // for posts and users view
    const [viewType, setViewType] = useState("posts");

    // useNavigate hook for navigation
    const navigate = useNavigate();

    // Fetch all posts and users
    useEffect(() => {
        async function fetchData() {
            if (!auth.currentUser) {
                return;
            }
            const idToken =  await getIdToken(auth.currentUser, false)
            const headers = {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${idToken}`
            }
            try {
                // Use a placeholder username for now
                const username = "localdev";
                const res = await fetch(`/api/users/${username}/all-users-and-images`, {method: 'GET', headers: headers});
                if (!res.ok) throw new Error("Failed to fetch search data");
                const data = await res.json();
                // assuming the endpoint returns { users: [...], images: [...] }
                setUsers(data.users || []);
                setPosts(data.images || []);
            } catch (err) {
                console.error("Error fetching data:", err);
                setUsers(mockUsers);
                setPosts(mockPosts);
            }
        }

        fetchData();
    }, []);

    // filter posts and users based on search query
    useEffect(() => {
        if (searchQuery) {
            // filter posts
            const filteredPosts = filterPosts(posts, searchQuery);
            // Sort filtered posts by date (newest first)
            filteredPosts.sort((a, b) => new Date(b.date_created) - new Date(a.date_created));

            setDisplayedPosts(filteredPosts);

            // filter users
            const filteredUsers = users.filter(user =>
                user.username.toLowerCase().includes(searchQuery.toLowerCase())
            );
            setDisplayedUsers(filteredUsers);
        } else {
            // sort posts by most recent by default
            const sortedPosts = [...posts].sort((a, b) => new Date(b.date_created) - new Date(a.date_created));
            setDisplayedPosts(sortedPosts);
            setDisplayedUsers(users);
        }
    }, [searchQuery, posts, users]);

    // Handlers for loading more content
    const handleLoadMorePosts = () => {
        setVisiblePostCount(prev => prev + 3);
    };

    const handleLoadMoreUsers = () => {
        setVisibleUserCount(prev => prev + 10);
    };

    const handleProfileClick = (user) => {
        navigate(`/profile/${user.username}`);
    };

    // Get visible content based on pagination
    const visiblePosts = displayedPosts.slice(0, visiblePostCount);
    const visibleUsers = displayedUsers.slice(0, visibleUserCount);

    return (
        <div className="bg-zinc-900 min-h-screen">
            <Navbar />
            <div className="pt-20 h-full flex overflow-auto bg-zinc-900">
                <div className="text-zinc-100 justify-center w-full">

                    {/* toggle between posts and users with search bar */}
                    <div className="bg-zinc-800 mx-10 my-5 rounded-md">
                        <div className="p-3 flex items-center justify-between rounded-md">
                            <nav className="flex text-zinc-100">
                                <button
                                    className={`px-3 py-2 ${viewType === "posts" ? "text-zinc-100 rounded-md hover:bg-zinc-100 hover:text-zinc-700 transition" : "text-zinc-500 rounded-md hover:bg-zinc-100 hover:text-zinc-700 transition"}`}
                                    onClick={() => setViewType("posts")}
                                >
                                    Posts
                                </button>
                                <button
                                    className={`px-3 py-2 ${viewType === "users" ? "text-zinc-100 rounded-md hover:bg-zinc-100 hover:text-zinc-700 transition" : "text-zinc-500 rounded-md hover:bg-zinc-100 hover:text-zinc-700 transition"}`}
                                    onClick={() => setViewType("users")}
                                >
                                    Users
                                </button>
                            </nav>
                            <div className="flex-1 mx-4">
                                <input
                                    type="text"
                                    placeholder="Search..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full px-4 py-2 bg-zinc-700 text-zinc-100 rounded-md focus:outline-none focus:ring-2 focus:ring-zinc-500"
                                />
                            </div>
                        </div>
                    </div>

                    {/* display content based on view type */}
                    <div className="">
                        {viewType === "posts" ? (
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
                                                onClick={() => handleProfileClick({ username: post.created_by })}
                                                className="ml-2 underline text-violet-400 hover:text-violet-200"
                                            >
                                                {post.created_by}
                                            </button>
                                        </p>
                                        <p><strong>Tags:</strong> {post.hashtags}</p>
                                        <p style={{ fontSize: "0.8rem", color: "gray" }}>{post.date_created}</p>
                                    </div>
                                ))}
                                {visiblePostCount < displayedPosts.length && (
                                    <button
                                        onClick={handleLoadMorePosts}
                                        className="bg-zinc-800 text-zinc-100 px-4 py-2 rounded-md mx-10 mb-5 hover:bg-violet-500 text-zinc-100 py-2 px-4 rounded-lg transition"
                                    >
                                        Load More Posts
                                    </button>
                                )}
                            </div>
                        ) : (
                            <div>
                                {visibleUsers.map((user) => (
                                    <div
                                        className="bg-zinc-800 mx-10 my-5 p-5 flex justify-between items-center rounded-md"
                                        key={user.user_id}
                                    >
                                        <span className="text-zinc-100">{user.username}</span>
                                        <button
                                            onClick={() => handleProfileClick(user)}
                                            className="bg-zinc-700 text-zinc-100 px-4 py-2 rounded-md hover:bg-zinc-100 hover:text-zinc-700 transition"
                                        >
                                            View Profile
                                        </button>
                                    </div>
                                ))}
                                {visibleUserCount < displayedUsers.length && (
                                    <button
                                        onClick={handleLoadMoreUsers}
                                        className="bg-zinc-800 text-zinc-100 px-4 py-2 rounded-md mx-10 mb-5 hover:bg-violet-500 text-zinc-100 py-2 px-4 rounded-lg transition"
                                    >
                                        Load More Users
                                    </button>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Search;