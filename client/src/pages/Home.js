import { useEffect, useState } from 'react';

function Home() {
    function handleSwitch(type) {
        setFeedType(type);
    }
    const [posts, setPosts] = useState([]);
    const [feedType, setFeedType] = useState("Private");

    const mockPublicFeed = [
        {
            photo_id: 1,
            photo_location: "https://thebutlercollegian.com/wp-content/uploads/2019/11/Short-people.jpg",
            prompt: "NO ACCESS TO BACKEND. Lorem ipsum dolor sit amet.",
            hashtags: "#cats #yes #legs",
            created_by: "justin",
            date_created: "2024",
        },
    ];

    const mockPrivateFeed = [
        {
            photo_id: 2,
            photo_location: "https://thebutlercollegian.com/wp-content/uploads/2019/11/Short-people.jpg",
            prompt: "NO ACCESS TO BACKEND. Lorem ipsum dolor sit amet.",
            hashtags: "#private #mock",
            created_by: "alex",
            date_created: "2024",
        },
    ];

    useEffect(() => {
        async function fetchPosts() {
            try {
                if (feedType === "Public") {
                    const usersRes = await fetch("/api/users");
                    if (!usersRes.ok) throw new Error("Failed to fetch users");
                    const users = await usersRes.json();
                    const userIds = users.map(user => user.user_id);

                    // Fetch posts for all users
                    const allPostsByUser = await Promise.all(
                        userIds.map(userId =>
                            fetch(`/api/users/${userId}/image`).then(res => res.json())
                        )
                    );
                    // Flatten the array of arrays and sort by date
                    const mergedPublicPosts = allPostsByUser.flat().sort((a, b) =>
                        new Date(b.date_created) - new Date(a.date_created)
                    );

                    setPosts(mergedPublicPosts);
                } else if (feedType === "Private") {
                    const myUsername = "justin";
                    const followingRes = await fetch(`/api/users/${myUsername}/following`);
                    if (!followingRes.ok) throw new Error("Failed to fetch following list");
                    const followingList = await followingRes.json();

                    // Fetch posts for each user in the following list
                    const allPosts = await Promise.all(
                        followingList.map(username =>
                            fetch(`/api/users/${username}/image`).then(res => res.json())
                        )
                    );
                    // Flatten the array of arrays and sort by date
                    const merged = allPosts.flat().sort((a, b) =>
                        new Date(b.date_created) - new Date(a.date_created)
                    );

                    setPosts(merged);
                }
            } catch {
                setPosts(feedType === "Public" ? mockPublicFeed : mockPrivateFeed);
            }
        }

        fetchPosts();
    }, [feedType]);

    return (
        <div style={{ padding: "1rem" }}>
            <div>
                <button onClick={() => handleSwitch("Public")}>Public Feed</button>
                <button onClick={() => handleSwitch("Private")}>Private Feed</button>
            </div>
            <h2>{feedType} Feed</h2>
            <div
                style={{
                    height: "400px",
                    overflowY: "scroll",
                    border: "1px solid gray",
                    marginTop: "1rem",
                    padding: "0.5rem",
                }}
            >
                {posts.map((post) => (
                    <div key={post.photo_id} style={{ marginBottom: "1rem", border: "1px solid #ddd", padding: "0.5rem" }}>
                        <img src={post.photo_location} alt="Generated art" style={{ width: "100%" }} />
                        <p><strong>Prompt:</strong> {post.prompt}</p>
                        <p><strong>By:</strong> {post.created_by}</p>
                        <p><strong>Tags:</strong> {post.hashtags}</p>
                        <p style={{ fontSize: "0.8rem", color: "gray" }}>{post.date_created}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Home;




