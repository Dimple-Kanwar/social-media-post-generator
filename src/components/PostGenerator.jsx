import { useState } from "react";
import { Card, CardContent, Button, TextField } from "@mui/material";
import { Loader2, Sparkles } from "lucide-react";

export default function AutoPostAI() {
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [posts, setPosts] = useState([]);

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    setLoading(true);
    try {
      const response = await fetch("https://zfdnpgjqh6.execute-api.ap-south-1.amazonaws.com/Prod/generate-post", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });
      const data = await response.json();
      setPosts(data.posts || []);
    } catch (err) {
      console.error("Error generating posts:", err);
      setPosts(["Failed to generate posts. Please try again."]);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-blue-50 p-6">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-4xl font-bold mb-4 text-center">AutoPost.AI</h1>
        <p className="text-center mb-6 text-gray-600">
          Enter a topic, product, or campaign – we’ll generate your next viral social post ✨
        </p>

        <Card className="mb-6 shadow-lg">
          <CardContent>
            <TextField
              label="Your Prompt"
              variant="outlined"
              multiline
              minRows={3}
              fullWidth
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="e.g. Launching a new summer t-shirt collection..."
            />
            <Button
              variant="contained"
              fullWidth
              sx={{ mt: 2 }}
              onClick={handleGenerate}
              disabled={loading}
              startIcon={loading ? <Loader2 className="animate-spin" /> : <Sparkles />}
            >
              {loading ? "Generating..." : "Generate Posts"}
            </Button>
          </CardContent>
        </Card>

        {posts.length > 0 && (
          <div className="space-y-4">
            {posts.map((post, idx) => (
              <Card key={idx} className="shadow-md">
                <CardContent className="text-gray-800 whitespace-pre-wrap">
                  {post}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
