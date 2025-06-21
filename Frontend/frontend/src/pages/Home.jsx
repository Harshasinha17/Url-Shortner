import React, { useEffect, useState } from "react";
import "../styles/home.css";

function Home() {
  const [url, setUrl] = useState("");

 const handleGenerate = async (e) => {
  e.preventDefault();
  try {
    const res = await fetch("http://localhost:8001/url", {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ url }),
    });

    if (!res.ok) {
      const text = await res.text();
      throw new Error("Server error: " + text);
    }

    const data = await res.json();
    alert("Short URL: http://localhost:8001/" + data.shortId);
    setUrl(""); // Clear input
  } catch (err) {
    console.error("Fetch failed:", err);
    alert("Failed to connect to server or invalid response.");
  }
};


  return (
    <div className="home-container">
      <h1>URL Shortener</h1>
      <form className="url-form" onSubmit={handleGenerate}>
        <input type="text" placeholder="Enter URL" value={url} onChange={(e) => setUrl(e.target.value)} required />
        <button type="submit">Generate</button>
      </form>
    </div>
  );
}

export default Home;
