
This doc explains how the `Home.tsx` component in the frontend handles feed fetching, fallback behavior, and post rendering using TypeScript

## Home.tsx:

- Falls back to mock data if the backend is not available
- Fetches post data from the backend for either **public** or **private** feed
- Renders each post using expected `Post` structure

## Fetch logic

When `feedType` changes, the following runs:

```ts
useEffect(() => {
  async function fetchPosts() {
    try {
      const res = await fetch(`/api/feed/${feedType.toLowerCase()}`);
      if (!res.ok) throw new Error("Request failed");
      const data = await res.json();
      setPosts(data);
    } catch {
      setPosts(feedType === "Public" ? mockPublicFeed : mockPrivateFeed);
    }
  }

  fetchPosts();
}, [feedType]);