import "./styles.css";
import AutoPostAI from "./components/PostGenerator";
import ConnectSocials from "./components/ConnectSocials";
import { useState, useEffect } from "react";
import { Button } from "@mui/material";

function App() {
  const [twitterConnected, setTwitterConnected] = useState(false);
  const [linkedinConnected, setLinkedinConnected] = useState(false);
  const [discordConnected, setDiscordConnected] = useState(false);
  const handleDisconnect = (platform) => {
    if (platform === "twitter") {
      localStorage.removeItem("twitter_token");
      localStorage.removeItem("twitter_secret");
      setTwitterConnected(false);
    } else if (platform === "linkedin") {
      localStorage.removeItem("linkedin_token");
      setLinkedinConnected(false);
    } else if (platform === "discord") {
      localStorage.removeItem("discord_token");
      setDiscordConnected(false);
    }
  };

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");
    const secret = params.get("secret");

    if (token && secret) {
      // Store tokens locally for now (for dev only)
      localStorage.setItem("twitter_token", token);
      localStorage.setItem("twitter_secret", secret);
      setTwitterConnected(true);

      // Clean URL
      window.history.replaceState({}, document.title, "/");
    } else {
      // Check existing session
      const storedToken = localStorage.getItem("twitter_token");
      if (storedToken) setTwitterConnected(true);
    }

    // Placeholder: Update these once LinkedIn/Discord connected
    setLinkedinConnected(false);
    setDiscordConnected(false);
  }, []);

  return (
    <div className="container mx-auto px-4 py-6">
      <h1 className="text-4xl font-bold mb-2 text-center">AutoPost.AI</h1>
      <p className="text-center text-gray-600 mb-6">
        Your smart social media content assistant ✨
      </p>

      {twitterConnected ? (
        <>
          <Button
            variant="outlined"
            onClick={() => handleDisconnect("twitter")}
          >
            Disconnect Twitter
          </Button>
          
          <AutoPostAI />
        </>
      ) : (
        <ConnectSocials />
      )}
      
    </div>
  );
}

export default App;
