/* 
    Filters an array of posts objects

    checks if searchQuery appears either in:
        1. the hashtags of the post
        2. the username of the post creator
*/
export function filterPosts(posts, searchQuery) {
    const normalizedQuery = searchQuery.toLowerCase().trim();

    return posts.filter(post => {
        const tags = post.hashtags?.toLowerCase().split('#').filter(Boolean) || [];
        const user = post.created_by?.toLowerCase() || "";

        // check if any tag contains the searchQuery
        return tags.some(tag => tag.includes(normalizedQuery)) ||
            user.includes(normalizedQuery);
    });
}