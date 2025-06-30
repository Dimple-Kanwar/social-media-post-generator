import { useEffect } from "react";

export default function TwitterCallback() {
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");
    const secret = params.get("secret");

    if (token && secret) {
      localStorage.setItem("twitter_token", token);
      localStorage.setItem("twitter_secret", secret);
      alert("✅ Twitter connected successfully!");
    } else {
      alert("❌ Failed to connect Twitter.");
    }

    // Redirect back to main screen after 2 seconds
    setTimeout(() => {
      window.location.href = "/";
    }, 2000);
  }, []);

  return <p>Connecting your Twitter account...</p>;
}
