import { useState, useEffect } from "react";
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  Stack,
  FormControlLabel,
  Switch,
  Typography,
} from "@mui/material";

const PLATFORMS = [
  { name: "Twitter", path: "twitter" },
  { name: "LinkedIn", path: "linkedin" },
  { name: "Discord", path: "discord" },
];

export default function ConnectSocials() {
  const [isOpen, setIsOpen] = useState(false);
  const [twitterConnected, setTwitterConnected] = useState(false);
  const [autoPost, setAutoPost] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("twitter_token");
    const secret = localStorage.getItem("twitter_secret");
    setTwitterConnected(!!(token && secret));
  }, []);
  
  const isConnected = (platform) => {
    if (platform === "twitter") return !!localStorage.getItem("twitter_token");
    if (platform === "linkedin")
      return !!localStorage.getItem("linkedin_token");
    if (platform === "discord") return !!localStorage.getItem("discord_token");
    return false;
  };

  const handleConnect = (platform) => {
    if (platform === "linkedin") {
      const clientId = import.meta.env.VITE_LINKEDIN_CLIENT_ID;
      const redirectUri = encodeURIComponent(
        import.meta.env.VITE_LINKEDIN_REDIRECT_URI + platform
      );
      const scope = "r_liteprofile";
      const state = "dev123";
      const authUrl = `https://www.linkedin.com/oauth/v2/authorization?response_type=code&client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scope}&state=${state}`;
      window.location.href = authUrl;
    } else if (platform === "twitter") {
      window.location.href = `${import.meta.env.VITE_API_TWITTER_AUTH_URL}`;
    } else if (platform === "discord") {
      const clientId = import.meta.env.VITE_DISCORD_CLIENT_ID;
      const redirectUri = encodeURIComponent(
        import.meta.env.VITE_DISCORD_REDIRECT_URI + platform
      );
      const scope = "identify";
      const authUrl = `https://discord.com/api/oauth2/authorize?response_type=code&client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scope}`;
      window.location.href = authUrl;
    }
  };

  return (
    <>
      <Button
        variant="contained"
        color="primary"
        onClick={() => setIsOpen(true)}
        sx={{ backgroundColor: "#2563eb", color: "white" }}
      >
        Connect Socials
      </Button>

      <Dialog
        open={isOpen}
        onClose={() => setIsOpen(false)}
        fullWidth
        maxWidth="xs"
      >
        <DialogTitle align="center">Select a Platform</DialogTitle>
        <DialogContent>
          <Stack spacing={2} mt={1}>
            {PLATFORMS.map((p) => (
              <Button
                key={p.name}
                variant={isConnected(p.path) ? "outlined" : "contained"}
                color={isConnected(p.path) ? "secondary" : "primary"}
                fullWidth
                onClick={() =>
                  isConnected(p.path)
                    ? handleDisconnect(p.path)
                    : handleConnect(p.path)
                }
              >
                {isConnected(p.path)
                  ? `Disconnect ${p.name}`
                  : `Connect ${p.name}`}
              </Button>
            ))}

            {twitterConnected && (
              <>
                <Typography variant="body2" color="green">
                  ✅ Twitter connected
                </Typography>
                <FormControlLabel
                  control={
                    <Switch
                      checked={autoPost}
                      onChange={(e) => setAutoPost(e.target.checked)}
                    />
                  }
                  label="Auto-post to Twitter"
                />
              </>
            )}
          </Stack>
        </DialogContent>
      </Dialog>
    </>
  );
}
