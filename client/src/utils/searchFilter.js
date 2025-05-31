/* 
    Filters an array of posts objects

    checks if searchQuery appears either in:
        1. the hashtags of the post
        2. the username of the post creator
*/
export function filterPosts(posts, searchQuery) {
    const normalizedQuery = (searchQuery || "").toLowerCase().trim();

    return posts.filter(post => {
        const hashtags = post.hashtags?.toLowerCase() || "";
        const user = post.created_by?.toLowerCase() || "";

        return hashtags.includes(normalizedQuery) || user.includes(normalizedQuery);
    });
}