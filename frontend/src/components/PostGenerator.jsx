import React, { useState } from "react";
import axios from "axios";

const PostGenerator = () => {
  const [topic, setTopic] = useState("");
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const API_URL = "https://<your-api-id>.execute-api.<region>.amazonaws.com/Prod/generate/"; 

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!topic.trim()) return;

    setLoading(true);
    setError("");
    try {
      const response = await axios.post(API_URL, { topic });
      setPosts(response.data.posts || []);
    } catch (err) {
      console.error(err);
      setError("Failed to generate posts. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <label>
          <strong>Enter Topic:</strong>
        </label>
        <input
          type="text"
          placeholder="e.g., eco-friendly living"
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
        />
        <button type="submit" disabled={loading}>
          {loading ? "Generating..." : "Generate Posts"}
        </button>
      </form>

      {error && <p style={{ color: "red" }}>{error}</p>}

      <div className="posts">
        {posts.map((post, index) => (
          <div key={index} className="post">
            {post}
          </div>
        ))}
      </div>
    </div>
  );
};

export default PostGenerator;