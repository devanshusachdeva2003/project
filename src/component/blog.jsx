import { useEffect, useState } from "react";
function Blog() {
  const [posts, setPosts] = useState([]);
  const [commentText, setCommentText] = useState("");
  
  const VITE_API_BASE_URL = import.meta.env.VITE_API_BASE_URL ;
  const token = localStorage.getItem("token");
  
  // FETCH POSTS
  const fetchPosts = () => {
    fetch(`${VITE_API_BASE_URL}/api/blog`)
      .then((res) => res.json())
      .then((data) => setPosts(data));
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  // LIKE POST
  const likePost = async (id) => {
    await fetch(`${VITE_API_BASE_URL}/api/blog/${id}/like`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    fetchPosts();
  };

  // SAVE POST
  const savePost = async (id) => {
    await fetch(`${VITE_API_BASE_URL}/api/blog/${id}/save`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    fetchPosts();
  };

  // COMMENT POST
  const addComment = async (id) => {
    if (!commentText) return;

    await fetch(`${VITE_API_BASE_URL}/api/blog/${id}/comment`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ text: commentText }),
    });

    setCommentText("");
    fetchPosts();
  };

  return (
    <div style={{ padding: "40px" }}>
      <h1>Blog Posts</h1>

      {posts.map((post) => (
        <div
          key={post._id}
          style={{
            border: "1px solid #ddd",
            padding: "20px",
            marginBottom: "20px",
            borderRadius: "10px",
          }}
        >
          <h3>{post.title}</h3>

          <p>{post.content}</p>

          {/* LIKE SAVE COMMENT COUNT */}
          <div style={{ display: "flex", gap: "15px" }}>
            <button onClick={() => likePost(post._id)}>
              ❤️ {post.likes?.length || 0}
            </button>

            <button onClick={() => savePost(post._id)}>
              🔖 {post.saves?.length || 0}
            </button>

            <span>💬 {post.comments?.length || 0}</span>
          </div>

          {/* COMMENT INPUT */}
          <div style={{ marginTop: "10px" }}>
            <input
              type="text"
              placeholder="Write comment..."
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
            />

            <button onClick={() => addComment(post._id)}>Post</button>
          </div>

          {/* SHOW COMMENTS */}
          <div style={{ marginTop: "10px" }}>
            {post.comments?.map((c, i) => (
              <p key={i}>
                <b>{c.username}:</b> {c.text}
              </p>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

export default Blog;
```
