import React, { useState } from "react";
import { Card, CardContent, Button, Snackbar, TextField, Tooltip } from "@mui/material";
import MuiAlert from "@mui/material/Alert";
import { Loader2, Sparkles } from "lucide-react";

// Snackbar Alert
const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

export default function AutoPostAI() {
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [posts, setPosts] = useState([]);

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text).then(() => {
      setSnackbarMessage("Copied to clipboard!");
      setSnackbarSeverity("success");
      setSnackbarOpen(true);
    });
  };

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    setLoading(true);

    try {
      const response = await fetch(import.meta.env.VITE_API_GENERATE_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });

      const data = await response.json();
      const newPosts = data.posts || [];
      setPosts(newPosts);
    } catch (err) {
      console.error("Error generating post:", err);
      setPosts(["Failed to generate post. Try again."]);
      setSnackbarMessage("Error occurred. Please try again.");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    }

    setLoading(false);
  };

  const handlePostToTwitter = async (content) => {
    const token = localStorage.getItem("twitter_token");
    const secret = localStorage.getItem("twitter_secret");

    if (!token || !secret) {
      setSnackbarMessage("❌ Twitter not connected.");
      setSnackbarSeverity("warning");
      setSnackbarOpen(true);
      return;
    }

    try {
      const tweetResponse = await fetch(import.meta.env.VITE_API_POST_TO_TWITTER_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content, token, secret }),
      });

      if (tweetResponse.ok) {
        setSnackbarMessage("✅ Posted to Twitter!");
        setSnackbarSeverity("success");
      } else {
        const errorText = await tweetResponse.text();
        console.error("Post failed:", errorText);
        setSnackbarMessage("❌ Failed to post to Twitter.");
        setSnackbarSeverity("error");
      }
    } catch (error) {
      console.error("Error posting:", error);
      setSnackbarMessage("Error posting to Twitter.");
      setSnackbarSeverity("error");
    }

    setSnackbarOpen(true);
  };

  return (
    <div className="space-y-4 mt-6">
      <Card className="mb-6">
        <CardContent>
          <TextField
            fullWidth
            multiline
            rows={3}
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="e.g. Launching a new summer t-shirt collection..."
            variant="outlined"
          />
          </CardContent>
        <CardContent className="flex justify-end">
          <Button
            className="mt-4 w-full flex items-center justify-center gap-2"
            onClick={handleGenerate}
            disabled={loading}
            variant="contained"
            color="primary"
          >
            {loading ? <Loader2 className="animate-spin" /> : <Sparkles />}
            {loading ? "Generating..." : "Generate Posts"}
          </Button>
        </CardContent>
      </Card>

      {posts.length > 0 && (
        <div className="space-y-4">
          {posts.map((post, idx) => (
            <Card key={idx} className="relative">
              <CardContent className="p-4 text-gray-800 whitespace-pre-wrap">
                {post}

                <div style={{ marginTop: "12px", display: "flex", justifyContent: "flex-end", gap: "10px" }}>
                  <Tooltip title="Copy to clipboard">
                    <Button
                      size="small"
                      onClick={() => handleCopy(post)}
                      variant="outlined"
                    >
                      📋 Copy
                    </Button>
                  </Tooltip>
                  <Tooltip title="Post to Twitter">
                    <Button
                      size="small"
                      onClick={() => handlePostToTwitter(post)}
                      variant="contained"
                      color="primary"
                    >
                      🐦 Tweet
                    </Button>
                  </Tooltip>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert onClose={() => setSnackbarOpen(false)} severity={snackbarSeverity}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </div>
  );
}
