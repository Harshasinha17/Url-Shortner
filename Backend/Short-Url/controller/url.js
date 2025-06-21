const shortid = require("shortid");

const URL = require("../models/url");

// Generate a new short URL

async function handleGenerateNewShortURLL(req, res) {
  const { url } = req.body;

  if (!url) {
    return res.status(400).json({ error: "URL is required" });
  }

  const shortID = shortid.generate();

  try {
    const newUrl = await URL.create({
      shortId: shortID,
      redirectURL: url,
      visitHistory: [],
      createdBy: req.user._id, // assuming middleware adds this
    });

    // ✅ Send JSON response
    return res.status(201).json({ shortId: newUrl.shortId });
  } catch (err) {
    console.error("Error creating URL:", err);
    return res.status(500).json({ error: "Server Error" });
  }
}

// Get analytics for a specific short URL
async function handleGetAnalytics(req, res) {
    const { shortID } = req.params;
    
    try {
        const result = await URL.findOne({ shortId: shortID });
        
        if (!result) {
            return res.status(404).json({ error: "Short URL not found" });
        }
        
        return res.json({
            totalClicks: result.visitHistory.length,
            analytics: result.visitHistory,
        });
    } catch (error) {
        console.error("Error fetching analytics:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
}
// controller/user.js
const User = require("../models/user");

async function handleUserSignup(req, res) {
    const { name, email, password } = req.body;
    
    try {
        await User.create({ name, email, password });
        return res.redirect("/");  // Redirect to home after signup
    } catch (error) {
        console.error("Error signing up:", error);
        return res.status(500).send("Internal Server Error");
    }
}




module.exports = {
    handleGenerateNewShortURLL,
    handleGetAnalytics,
    handleUserSignup,
};
