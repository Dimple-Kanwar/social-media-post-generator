import { useState, useEffect } from "react";
import { Button, Switch, FormControlLabel } from "@mui/material";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import toast from "react-hot-toast";

export default function PostActions({ content, twitterToken }) {
  const [autoPost, setAutoPost] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(content);
    toast.success("Copied to clipboard!");
  };

  const handleAutoPost = async () => {
    if (!autoPost || !twitterToken) return;
    const res = await fetch(`${process.env.VITE_API_POST_TO_TWITTER_URL}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        content,
        token: twitterToken.token,
        secret: twitterToken.secret,
      }),
    });
    const result = await res.json();
    if (result.success) {
      toast.success("Posted to Twitter!");
    } else {
      toast.error("Failed to post.");
    }
  };

  useEffect(() => {
    handleAutoPost(); // Trigger when autoPost is enabled
  }, [autoPost]);

  return (
    <div className="flex justify-between items-center mt-2">
      <FormControlLabel
        control={<Switch checked={autoPost} onChange={(e) => setAutoPost(e.target.checked)} />}
        label="Auto-post to Twitter"
      />
      <Button variant="outlined" onClick={handleCopy} startIcon={<ContentCopyIcon />}>
        Copy
      </Button>
    </div>
  );
}
